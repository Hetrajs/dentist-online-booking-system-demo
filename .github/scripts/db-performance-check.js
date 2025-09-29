const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkDatabasePerformance() {
  console.log('🗄️ Starting database performance check...');
  
  const tests = [
    {
      name: 'Appointments Query Performance',
      query: () => supabase.from('appointments').select('*').limit(100),
      threshold: 500 // ms
    },
    {
      name: 'User Profiles Query Performance',
      query: () => supabase.from('user_profiles').select('*').limit(50),
      threshold: 300 // ms
    },
    {
      name: 'Services Query Performance',
      query: () => supabase.from('services').select('*').eq('is_active', true),
      threshold: 200 // ms
    },
    {
      name: 'Availability Slots Query Performance',
      query: () => supabase.from('availability_slots').select('*').limit(20),
      threshold: 250 // ms
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    const startTime = Date.now();
    
    try {
      const { data, error } = await test.query();
      const duration = Date.now() - startTime;
      
      if (error) {
        console.error(`❌ ${test.name}: Query failed - ${error.message}`);
        allPassed = false;
        continue;
      }
      
      if (duration > test.threshold) {
        console.warn(`⚠️ ${test.name}: Slow query (${duration}ms > ${test.threshold}ms threshold)`);
        allPassed = false;
      } else {
        console.log(`✅ ${test.name}: ${duration}ms (${data?.length || 0} records)`);
      }
      
    } catch (err) {
      console.error(`❌ ${test.name}: Exception - ${err.message}`);
      allPassed = false;
    }
  }

  // Check database connections
  try {
    const { data: connectionInfo } = await supabase
      .from('pg_stat_activity')
      .select('count(*)')
      .single();
    
    console.log(`📊 Active database connections: ${connectionInfo?.count || 'Unknown'}`);
  } catch (err) {
    console.warn('⚠️ Could not retrieve connection info');
  }

  if (!allPassed) {
    console.error('❌ Database performance check failed!');
    process.exit(1);
  } else {
    console.log('✅ All database performance checks passed!');
  }
}

checkDatabasePerformance().catch(err => {
  console.error('💥 Database performance check crashed:', err);
  process.exit(1);
});
