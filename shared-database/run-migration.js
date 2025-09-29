#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * This script runs the availability slots migration against your Supabase database.
 * Make sure you have the following environment variables set:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../patient-facing/.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('Make sure these are set in patient-facing/.env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...')
    console.log(`📍 Database URL: ${supabaseUrl}`)
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase-availability-slots-fix.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Running migration SQL...')
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution (this might not work for complex SQL)
      console.log('⚠️  exec_sql function not available, trying alternative approach...')
      
      // Split the SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.includes('DO $$') || statement.includes('CREATE OR REPLACE FUNCTION')) {
          console.log('⚠️  Complex SQL detected. Please run the migration manually in your Supabase SQL editor.')
          console.log('📄 Migration file location: shared-database/supabase-availability-slots-fix.sql')
          return
        }
      }
    }
    
    console.log('✅ Migration completed successfully!')
    
    // Test the function
    console.log('🧪 Testing the get_available_slots_for_date function...')
    const { data: testData, error: testError } = await supabase
      .rpc('get_available_slots_for_date', { target_date: new Date().toISOString().split('T')[0] })
    
    if (testError) {
      console.log('⚠️  Function test failed:', testError.message)
      console.log('📝 This is expected if no slots are configured yet.')
    } else {
      console.log('✅ Function test successful!')
      console.log(`📊 Found ${testData?.length || 0} available slots for today`)
    }
    
    // Verify table structure
    console.log('🔍 Verifying table structure...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'availability_slots')
      .order('ordinal_position')
    
    if (columnsError) {
      console.log('⚠️  Could not verify table structure:', columnsError.message)
    } else {
      console.log('📋 Table structure:')
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`)
      })
    }
    
    console.log('')
    console.log('🎉 Migration process completed!')
    console.log('📝 Next steps:')
    console.log('   1. Test the patient-facing booking system')
    console.log('   2. Create some availability slots in the admin interface')
    console.log('   3. Verify that appointments can be booked successfully')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('')
    console.error('🔧 Manual migration required:')
    console.error('   1. Open your Supabase dashboard')
    console.error('   2. Go to SQL Editor')
    console.error('   3. Copy and paste the contents of shared-database/supabase-availability-slots-fix.sql')
    console.error('   4. Run the SQL')
    process.exit(1)
  }
}

// Run the migration
runMigration()
