require('dotenv').config();
const dns = require('dns').promises;
const net = require('net');
const { Client } = require('pg');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function runDiagnostics() {
  console.log('--- Neon Database Connectivity Diagnostics ---');

  if (!process.env.DATABASE_URL) {
    console.error(`${RED}✗ FAILED: DATABASE_URL is not defined in environment variables.${RESET}`);
    process.exit(1);
  }

  let dbUrl;
  try {
    dbUrl = new URL(process.env.DATABASE_URL);
  } catch (err) {
    console.error(`${RED}✗ FAILED: Invalid DATABASE_URL format.${RESET}`);
    process.exit(1);
  }

  const host = dbUrl.hostname;
  const port = dbUrl.port || 5432;
  const isPooler = host.includes('-pooler');

  console.log(`\nConnection Details:`);
  console.log(`Host: ${host}`);
  console.log(`Port: ${port}`);
  console.log(`Type: ${isPooler ? 'Pooled Connection (-pooler)' : 'Direct Connection'}`);
  
  if (isPooler) {
    console.log(`${YELLOW}⚠️ Suggestion: You are using a pooled connection. If you experience network issues, try using the direct connection string instead.${RESET}`);
  }

  // 1. DNS Resolution Test
  console.log(`\n[Test 1/3] DNS Resolution Test...`);
  try {
    const addresses = await dns.resolve4(host);
    console.log(`${GREEN}✓ SUCCESS: DNS resolved ${host} to [${addresses.join(', ')}]${RESET}`);
  } catch (err) {
    console.error(`${RED}✗ FAILED: DNS Resolution failed. Error: ${err.code}${RESET}`);
    console.error(`${YELLOW}💡 Action: Your network (e.g., home WiFi) or ISP might be blocking Neon DB's DNS. Try explicitly changing your DNS provider to Google DNS (8.8.8.8) or Cloudflare (1.1.1.1).${RESET}`);
    process.exit(1);
  }

  // 2. TCP Connectivity Test
  console.log(`\n[Test 2/3] TCP Connectivity Test on Port ${port}...`);
  const tcpSuccess = await new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(5000); // 5 sec timeout
    socket.on('connect', () => {
      console.log(`${GREEN}✓ SUCCESS: Successfully established TCP connection to ${host}:${port}${RESET}`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      console.error(`${RED}✗ FAILED: TCP connection timed out (ETIMEDOUT).${RESET}`);
      console.error(`${YELLOW}💡 Action: Port ${port} is reachable but timing out. This usually means a strict firewall or ISP routing issue. Try using a VPN or connecting via mobile hotspot.${RESET}`);
      socket.destroy();
      resolve(false);
    });
    socket.on('error', (err) => {
      console.error(`${RED}✗ FAILED: TCP connection refused (${err.code}).${RESET}`);
      if (err.code === 'ECONNREFUSED') {
          console.error(`${YELLOW}💡 Action: Connection was explicitly refused. Your router or ISP might be blocking outgoing connections to Postgres (port 5432).${RESET}`);
      }
      resolve(false);
    });
    socket.connect(port, host);
  });

  if (!tcpSuccess) {
    process.exit(1);
  }

  // 3. PostgreSQL SSL/Handshake Connection Test
  console.log(`\n[Test 3/3] PostgreSQL Connection Test...`);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log(`${GREEN}✓ SUCCESS: Logged in and established PostgreSQL session via pg!${RESET}`);
    
    const res = await client.query('SELECT version()');
    console.log(`Server Version: ${res.rows[0].version}`);
    
    await client.end();
  } catch (err) {
    console.error(`${RED}✗ FAILED: Error establishing PostgreSQL connection.${RESET}`);
    console.error(`Error Code: ${err.code || err.message}`);
    
    if (err.message.includes('SSL') || err.code === 'ECONNRESET') {
       console.error(`${YELLOW}💡 Action: SSL handshake failed or connection reset. Even if the port is open, the network might be breaking SSL interception. Try mobile hotspot or a VPN.${RESET}`);
    } else if (err.code === 'ENOTFOUND') {
       console.error(`${YELLOW}💡 Action: DNS ENOTFOUND within pg client. Check network config.${RESET}`);
    } else {
       console.error(`${YELLOW}💡 Action: Review the error message above for specific pg pool errors.${RESET}`);
    }
  }
  
  console.log('\n--- Diagnostics Complete ---');
}

runDiagnostics();
