require('dotenv').config();
const { Pool } = require('pg');
const dns = require('dns').promises;
const net = require('net');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  min: 2,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  allowExitOnIdle: false
});

pool.on('error', (err) => {
  console.error('✗ Background database pool error:', err.message);
  // Replaced immediate exit to allow retry logic to handle initial connection failures properly.
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

const runDiagnosticsAndConnect = async () => {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const host = dbUrl.hostname;
    const port = dbUrl.port || 5432;
    const isPooler = host.includes('-pooler');

    if (isPooler) {
      console.warn('⚠️ Using pooled connection. Try direct connection if network issues occur.');
    }

    // 1. DNS Resolution Check
    try {
      await dns.resolve4(host);
    } catch (err) {
      if (err.code === 'ENOTFOUND') {
         console.error('✗ DNS resolution failed (ENOTFOUND). Host not found.');
      } else {
         console.error(`✗ DNS resolution error: ${err.message}`);
      }
    }

    // 2. TCP Connectivity Test
    await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        console.error(`✗ Port ${port} blocked (ETIMEDOUT). Network/firewall issue.`);
        socket.destroy();
        resolve(false);
      });
      socket.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
          console.error(`✗ Port ${port} blocked (ECONNREFUSED). Connection refused.`);
        } else {
          console.error(`✗ TCP Connectivity issue: ${err.code}`);
        }
        resolve(false);
      });
      socket.connect(port, host);
    });

    // 3. PostgreSQL Connection & Retry Logic
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const client = await pool.connect();
        console.log('✓ Connected to Neon DB successfully');
        client.release();
        return; // Success
      } catch (err) {
        if (err.message.includes('SSL')) {
          console.error(`✗ Attempt ${attempt}: SSL handshake failed. (${err.message})`);
        } else {
          console.error(`✗ Attempt ${attempt}: Connection failed. ${err.message}`);
        }
        
        if (attempt === MAX_RETRIES) {
          console.error('Database connection failed due to network restrictions');
          process.exit(1);
        }
        console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      }
    }
  } catch (error) {
    console.error('✗ Fatal startup error configuring database:', error.message);
    process.exit(1);
  }
};

// Start diagnostic connection on startup
runDiagnosticsAndConnect();

module.exports = pool;
