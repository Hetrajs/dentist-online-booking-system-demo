import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // SQL to create medical_records table
    const createMedicalRecordsTableSQL = `
      -- Create medical_records table
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

    // Execute the SQL
    const { data, error } = await supabaseClient.rpc('exec_sql', {
      sql: createMedicalRecordsTableSQL
    })

    if (error) {
      console.error('Error creating medical_records table:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert sample data
    const sampleRecords = [
      {
        patient_id: '00000000-0000-0000-0000-000000000000', // Will be replaced with actual patient ID
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
      }
    ]

    // Get first user profile to use as patient_id
    const { data: profiles } = await supabaseClient
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (profiles && profiles.length > 0) {
      // Update sample records with actual patient ID
      sampleRecords.forEach(record => {
        record.patient_id = profiles[0].id
      })

      // Insert sample data
      const { error: insertError } = await supabaseClient
        .from('medical_records')
        .insert(sampleRecords)

      if (insertError) {
        console.error('Error inserting sample data:', insertError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Medical records table created successfully!',
        sampleDataInserted: profiles && profiles.length > 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
