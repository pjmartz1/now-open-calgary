const { createClient } = require('@supabase/supabase-js');

// Debug script for comprehensive Supabase and sync analysis
async function runComprehensiveDebug() {
  console.log('🔍 Starting Comprehensive Debug Analysis...\n');

  // 1. Environment Variables Check
  console.log('1. ENVIRONMENT VARIABLES:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.log('- API_SECRET_KEY:', process.env.API_SECRET_KEY ? '✅ Set' : '❌ Missing');
  console.log('- CRON_SECRET:', process.env.CRON_SECRET ? '✅ Set' : '❌ Missing');
  console.log('');

  // 2. Supabase Connection Test
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('2. SUPABASE CONNECTION TEST:');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    try {
      // Test basic connection
      const { count, error } = await supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log('❌ Supabase connection failed:', error.message);
      } else {
        console.log('✅ Supabase connected successfully');
        console.log(`📊 Total records in database: ${count}`);
      }

      // Test data freshness
      const { data: recentData, error: recentError } = await supabase
        .from('calgary_businesses')
        .select('tradename, first_issued_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!recentError && recentData) {
        console.log('📅 Most recently added businesses:');
        recentData.forEach(business => {
          console.log(`   - ${business.tradename} (License: ${business.first_issued_date}, Added: ${business.created_at})`);
        });
      }

      // Check for recent business licenses (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateFilter = sevenDaysAgo.toISOString().split('T')[0];

      const { count: recentCount, error: recentCountError } = await supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .gte('first_issued_date', dateFilter);

      if (!recentCountError) {
        console.log(`🆕 Businesses licensed in last 7 days: ${recentCount}`);
      }

    } catch (error) {
      console.log('❌ Database test failed:', error.message);
    }
    console.log('');
  }

  // 3. Calgary API Test
  console.log('3. CALGARY OPEN DATA API TEST:');
  try {
    const response = await fetch('https://data.calgary.ca/resource/vdjc-pybd.json?$limit=5&$order=first_iss_dt DESC');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Calgary API accessible');
      console.log(`📊 Sample data retrieved: ${data.length} records`);
      
      if (data.length > 0) {
        console.log('📅 Most recent business license:');
        console.log(`   - ${data[0].tradename} (${data[0].first_iss_dt || 'No date'})`);
      }
    } else {
      console.log('❌ Calgary API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Calgary API test failed:', error.message);
  }
  console.log('');

  // 4. Check for recent licenses in Calgary API
  console.log('4. RECENT CALGARY LICENSES CHECK:');
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateFilter = thirtyDaysAgo.toISOString();

    const url = `https://data.calgary.ca/resource/vdjc-pybd.json?$where=first_iss_dt >= '${dateFilter}'&$limit=1000`;
    console.log('🔗 Checking URL:', url);

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.length} licenses issued in last 30 days`);
      
      if (data.length > 0) {
        // Group by license date
        const dateGroups = {};
        data.forEach(business => {
          const date = business.first_iss_dt ? business.first_iss_dt.split('T')[0] : 'unknown';
          if (!dateGroups[date]) dateGroups[date] = 0;
          dateGroups[date]++;
        });
        
        console.log('📊 Recent licenses by date:');
        Object.entries(dateGroups)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 10)
          .forEach(([date, count]) => {
            console.log(`   - ${date}: ${count} licenses`);
          });
      }
    } else {
      console.log('❌ Calgary recent data check failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Recent licenses check failed:', error.message);
  }
  console.log('');

  // 5. Sync Status Analysis
  console.log('5. SYNC STATUS ANALYSIS:');
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check data staleness
    const { data: oldestData, error: oldestError } = await supabase
      .from('calgary_businesses')
      .select('created_at')
      .order('created_at', { ascending: true })
      .limit(1);

    const { data: newestData, error: newestError } = await supabase
      .from('calgary_businesses')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!oldestError && !newestError && oldestData?.[0] && newestData?.[0]) {
      console.log(`📊 Data age range:`);
      console.log(`   - Oldest record: ${oldestData[0].created_at}`);
      console.log(`   - Newest record: ${newestData[0].created_at}`);
      
      const daysSinceLastUpdate = Math.floor((new Date() - new Date(newestData[0].created_at)) / (1000 * 60 * 60 * 24));
      console.log(`⏰ Days since last update: ${daysSinceLastUpdate}`);
      
      if (daysSinceLastUpdate > 3) {
        console.log('⚠️  WARNING: Data appears stale (>3 days since last update)');
      }
    }
  }

  console.log('\n🔍 Debug Analysis Complete!');
  console.log('\n📋 RECOMMENDATIONS:');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('🔴 CRITICAL: Configure Supabase environment variables');
  }
  
  if (!process.env.API_SECRET_KEY) {
    console.log('🔴 CRITICAL: Set API_SECRET_KEY for sync authentication');
  }
  
  if (!process.env.CRON_SECRET) {
    console.log('🔴 CRITICAL: Set CRON_SECRET for Vercel cron job authentication');
  }
  
  console.log('🟡 Check Vercel deployment environment variables');
  console.log('🟡 Monitor cron job logs in Vercel dashboard');
  console.log('🟡 Test manual sync with proper API keys');
}

// Run if called directly
if (require.main === module) {
  runComprehensiveDebug().catch(console.error);
}

module.exports = { runComprehensiveDebug };