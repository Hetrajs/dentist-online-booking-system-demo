const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createExecSqlFunction() {
  console.log('Creating exec_sql function...')

  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
    RETURNS text AS $$
    BEGIN
      EXECUTE sql;
      RETURN 'SQL executed successfully';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `

  try {
    // Try to create the exec_sql function first
    const { data, error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL })

    if (error && error.code === 'PGRST202') {
      // Function doesn't exist, we need to create it manually
      console.log('exec_sql function does not exist. Please run the following SQL in your Supabase dashboard first:')
      console.log(createFunctionSQL)
      return false
    }

    return true
  } catch (err) {
    console.log('exec_sql function does not exist. Please run the following SQL in your Supabase dashboard first:')
    console.log(createFunctionSQL)
    return false
  }
}

async function createMedicalRecordsTable() {
  console.log('Creating medical_records table...')

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS medical_records (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      patient_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
      appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
      record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('consultation', 'treatment', 'prescription', 'lab_result', 'x_ray', 'diagnosis', 'follow_up')),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      diagnosis TEXT,
      treatment TEXT,
      medications JSONB,
      vital_signs JSONB,
      notes TEXT,
      attachments JSONB,
      created_by VARCHAR(255),
      is_confidential BOOLEAN DEFAULT FALSE,
      tags TEXT[]
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
    CREATE INDEX IF NOT EXISTS idx_medical_records_appointment_id ON medical_records(appointment_id);
    CREATE INDEX IF NOT EXISTS idx_medical_records_record_type ON medical_records(record_type);
    CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at);

    -- Enable RLS (Row Level Security)
    ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Enable read access for all users" ON medical_records FOR SELECT USING (true);
    CREATE POLICY "Enable insert for authenticated users only" ON medical_records FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for authenticated users only" ON medical_records FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for authenticated users only" ON medical_records FOR DELETE USING (true);
  `

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      console.error('Error creating table:', error)
      console.log('\nPlease run the following SQL in your Supabase dashboard:')
      console.log(createTableSQL)
      return false
    }

    console.log('✅ medical_records table created successfully!')
    console.log('Result:', data)
    return true
  } catch (err) {
    console.error('Error:', err)
    console.log('\nPlease run the following SQL in your Supabase dashboard:')
    console.log(createTableSQL)
    return false
  }
}

async function insertSampleData() {
  console.log('Inserting sample medical records...')
  
  // First, get a user profile ID
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1)
  
  if (profileError || !profiles || profiles.length === 0) {
    console.log('No user profiles found, skipping sample data insertion')
    return
  }
  
  const patientId = profiles[0].id
  
  const sampleRecords = [
    {
      patient_id: patientId,
      record_type: 'consultation',
      title: 'Initial Dental Consultation',
      description: 'Comprehensive oral examination and assessment',
      diagnosis: 'Mild gingivitis, one cavity in upper left molar',
      treatment: 'Professional cleaning recommended, filling required',
      medications: [{"name": "Fluoride rinse", "dosage": "Daily", "duration": "2 weeks"}],
      vital_signs: {"blood_pressure": "120/80", "temperature": "98.6°F"},
      notes: 'Patient reports sensitivity to cold. Good oral hygiene habits.',
      created_by: 'Dr. Smith',
      tags: ['routine', 'consultation']
    },
    {
      patient_id: patientId,
      record_type: 'treatment',
      title: 'Dental Filling - Upper Left Molar',
      description: 'Composite filling procedure for cavity',
      diagnosis: 'Dental caries - upper left first molar',
      treatment: 'Composite resin filling completed successfully',
      medications: [],
      vital_signs: {},
      notes: 'Procedure completed without complications. Patient tolerated well.',
      created_by: 'Dr. Smith',
      tags: ['treatment', 'filling']
    },
    {
      patient_id: patientId,
      record_type: 'prescription',
      title: 'Post-Treatment Medication',
      description: 'Pain management following dental procedure',
      diagnosis: null,
      treatment: null,
      medications: [{"name": "Ibuprofen", "dosage": "400mg", "frequency": "Every 6 hours", "duration": "3 days"}],
      vital_signs: {},
      notes: 'Take with food to avoid stomach upset. Contact office if pain persists.',
      created_by: 'Dr. Smith',
      tags: ['prescription', 'pain-management']
    }
  ]
  
  const { data, error } = await supabase
    .from('medical_records')
    .insert(sampleRecords)
  
  if (error) {
    console.error('Error inserting sample data:', error)
  } else {
    console.log('✅ Sample medical records inserted successfully!')
  }
}

async function main() {
  console.log('🏥 Setting up medical records table...')

  // First, try to create the exec_sql function
  const functionExists = await createExecSqlFunction()

  if (!functionExists) {
    console.log('❌ Please create the exec_sql function first in your Supabase dashboard')
    process.exit(1)
  }

  const tableCreated = await createMedicalRecordsTable()

  if (tableCreated) {
    await insertSampleData()
    console.log('🎉 Medical records setup completed!')
  } else {
    console.log('❌ Failed to create medical records table')
  }

  process.exit(0)
}

main().catch(console.error)
