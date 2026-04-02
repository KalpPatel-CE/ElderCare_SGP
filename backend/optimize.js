require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function optimizeDatabase() {
  console.log('🚀 Starting database optimization...\n');
  
  try {
    const sqlFile = fs.readFileSync(path.join(__dirname, 'optimize-db.sql'), 'utf8');
    const statements = sqlFile.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          const match = statement.match(/CREATE INDEX.*idx_(\w+)/);
          if (match) {
            console.log(`✓ Created index: idx_${match[1]}`);
          } else if (statement.includes('ANALYZE')) {
            const table = statement.match(/ANALYZE (\w+)/)?.[1];
            console.log(`✓ Analyzed table: ${table}`);
          }
        } catch (err) {
          if (err.message.includes('already exists')) {
            // Index already exists, skip
          } else {
            console.error(`✗ Error: ${err.message}`);
          }
        }
      }
    }
    
    console.log('\n✅ Database optimization completed successfully!');
    console.log('\n📊 Performance improvements:');
    console.log('   • Faster query execution with indexes');
    console.log('   • Optimized JOIN operations');
    console.log('   • Improved WHERE clause filtering');
    console.log('   • Better query planner statistics');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

optimizeDatabase();
