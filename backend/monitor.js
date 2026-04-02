  require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPerformance() {
  console.log('📊 ElderCare Performance Monitor\n');
  
  try {
    // Check connection pool
    console.log('🔌 Connection Pool Status:');
    console.log(`   Total Connections: ${pool.totalCount}`);
    console.log(`   Idle Connections: ${pool.idleCount}`);
    console.log(`   Waiting Requests: ${pool.waitingCount}\n`);
    
    // Check database size
    const dbSize = await pool.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    console.log('💾 Database Size:', dbSize.rows[0].size, '\n');
    
    // Check table sizes
    console.log('📋 Table Sizes:');
    const tables = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
        pg_total_relation_size(schemaname||'.'||tablename) AS bytes
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY bytes DESC
      LIMIT 10
    `);
    tables.rows.forEach(t => {
      console.log(`   ${t.tablename.padEnd(25)} ${t.size}`);
    });
    
    // Check indexes
    console.log('\n🔍 Index Usage:');
    const indexes = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan as scans
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC
      LIMIT 10
    `);
    indexes.rows.forEach(i => {
      console.log(`   ${i.indexname.padEnd(35)} Scans: ${i.scans || 0}`);
    });
    
    // Check record counts
    console.log('\n📊 Record Counts:');
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM families'),
      pool.query('SELECT COUNT(*) FROM caretakers'),
      pool.query('SELECT COUNT(*) FROM elders'),
      pool.query('SELECT COUNT(*) FROM caretaker_requests'),
      pool.query('SELECT COUNT(*) FROM service_assignments'),
      pool.query('SELECT COUNT(*) FROM daily_care_logs'),
      pool.query('SELECT COUNT(*) FROM vitals_logs')
    ]);
    
    console.log(`   Families: ${counts[0].rows[0].count}`);
    console.log(`   Caretakers: ${counts[1].rows[0].count}`);
    console.log(`   Elders: ${counts[2].rows[0].count}`);
    console.log(`   Requests: ${counts[3].rows[0].count}`);
    console.log(`   Assignments: ${counts[4].rows[0].count}`);
    console.log(`   Care Logs: ${counts[5].rows[0].count}`);
    console.log(`   Vitals Logs: ${counts[6].rows[0].count}`);
    
    // Test query performance
    console.log('\n⚡ Query Performance Test:');
    
    const start1 = Date.now();
    await pool.query('SELECT * FROM families LIMIT 10');
    console.log(`   Families query: ${Date.now() - start1}ms`);
    
    const start2 = Date.now();
    await pool.query('SELECT * FROM caretakers WHERE availability_status = $1 LIMIT 10', ['available']);
    console.log(`   Caretakers query: ${Date.now() - start2}ms`);
    
    const start3 = Date.now();
    await pool.query(`
      SELECT cr.*, e.full_name, f.full_name 
      FROM caretaker_requests cr
      JOIN elders e ON e.id = cr.elder_id
      JOIN families f ON f.id = cr.family_id
      LIMIT 10
    `);
    console.log(`   Complex JOIN query: ${Date.now() - start3}ms`);
    
    console.log('\n✅ Performance check complete!');
    console.log('\n💡 Tips:');
    console.log('   • Queries under 50ms are excellent');
    console.log('   • Queries 50-200ms are good');
    console.log('   • Queries over 200ms need optimization');
    console.log('   • High index scans = indexes are working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPerformance();
