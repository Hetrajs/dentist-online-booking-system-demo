const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create the admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@dentalclinic.com',
      password: 'admin@1234',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Dr. Priya Sharma'
      }
    })

    if (authError) {
      console.error('Error creating admin user:', authError)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@dentalclinic.com')
    console.log('🔑 Password: admin@1234')
    console.log('👤 User ID:', authData.user.id)

    // Also create a user profile if needed
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: authData.user.id,
        email: 'admin@dentalclinic.com',
        full_name: 'Dr. Priya Sharma',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.warn('Warning: Could not create user profile:', profileError.message)
    } else {
      console.log('✅ User profile created successfully!')
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser()
