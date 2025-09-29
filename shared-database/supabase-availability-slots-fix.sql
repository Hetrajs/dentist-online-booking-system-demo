-- =====================================================
-- AVAILABILITY SLOTS TABLE ENHANCEMENT
-- =====================================================
-- This migration adds missing columns to the availability_slots table
-- and creates the get_available_slots_for_date function

-- Add missing columns to availability_slots table
DO $$
BEGIN
    -- Check if availability_slots table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'availability_slots') THEN
        
        -- Add is_recurring column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'availability_slots' AND column_name = 'is_recurring') THEN
            ALTER TABLE availability_slots ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
        END IF;

        -- Add day_of_week column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'availability_slots' AND column_name = 'day_of_week') THEN
            ALTER TABLE availability_slots ADD COLUMN day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6);
        END IF;

        -- Add effective_from column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'availability_slots' AND column_name = 'effective_from') THEN
            ALTER TABLE availability_slots ADD COLUMN effective_from DATE;
        END IF;

        -- Add effective_until column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'availability_slots' AND column_name = 'effective_until') THEN
            ALTER TABLE availability_slots ADD COLUMN effective_until DATE;
        END IF;

        -- Make date column nullable for recurring slots
        ALTER TABLE availability_slots ALTER COLUMN date DROP NOT NULL;

    END IF;
END $$;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_availability_slots_recurring ON availability_slots(is_recurring);
CREATE INDEX IF NOT EXISTS idx_availability_slots_day_of_week ON availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_slots_effective_from ON availability_slots(effective_from);
CREATE INDEX IF NOT EXISTS idx_availability_slots_effective_until ON availability_slots(effective_until);

-- =====================================================
-- DATABASE FUNCTION: get_available_slots_for_date
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_available_slots_for_date(target_date DATE)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    date DATE,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN,
    max_appointments INTEGER,
    current_appointments INTEGER,
    notes TEXT,
    is_recurring BOOLEAN,
    day_of_week INTEGER,
    effective_from DATE,
    effective_until DATE,
    slot_time TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.created_at,
        s.date,
        s.start_time,
        s.end_time,
        s.is_available,
        s.max_appointments,
        COALESCE(
            (SELECT COUNT(*)::INTEGER 
             FROM appointments a 
             WHERE a.preferred_date = target_date 
               AND a.preferred_time >= s.start_time::TEXT 
               AND a.preferred_time <= s.end_time::TEXT
               AND a.status IN ('pending', 'confirmed', 'in_progress')
            ), 0
        ) as current_appointments,
        s.notes,
        s.is_recurring,
        s.day_of_week,
        s.effective_from,
        s.effective_until,
        s.start_time::TEXT as slot_time
    FROM availability_slots s
    WHERE s.is_available = true
      AND (
          -- Specific date slots
          (s.is_recurring = false AND s.date = target_date)
          OR
          -- Recurring slots for the day of week
          (s.is_recurring = true 
           AND s.day_of_week = EXTRACT(DOW FROM target_date)::INTEGER
           AND (s.effective_from IS NULL OR s.effective_from <= target_date)
           AND (s.effective_until IS NULL OR s.effective_until >= target_date)
          )
      )
    ORDER BY s.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION public.get_available_slots_for_date(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_slots_for_date(DATE) TO anon;

-- =====================================================
-- UPDATE RLS POLICIES FOR NEW COLUMNS
-- =====================================================

-- Update the availability slots policy to handle recurring slots
DROP POLICY IF EXISTS "Anyone can view availability slots" ON availability_slots;
CREATE POLICY "Anyone can view availability slots" ON availability_slots
  FOR SELECT USING (is_available = true);

-- Add policy for service role to manage all slots
DROP POLICY IF EXISTS "Service role can manage availability slots" ON availability_slots;
CREATE POLICY "Service role can manage availability slots" ON availability_slots
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert some sample recurring slots for testing (only if table is empty)
INSERT INTO availability_slots (
    date, start_time, end_time, is_available, max_appointments, 
    current_appointments, notes, is_recurring, day_of_week, effective_from
)
SELECT 
    NULL, '09:00'::TIME, '12:00'::TIME, true, 6, 0, 
    'Morning appointments - Monday to Friday', true, day_num, CURRENT_DATE
FROM generate_series(1, 5) as day_num
WHERE NOT EXISTS (SELECT 1 FROM availability_slots WHERE is_recurring = true)
ON CONFLICT DO NOTHING;

-- Insert afternoon slots
INSERT INTO availability_slots (
    date, start_time, end_time, is_available, max_appointments, 
    current_appointments, notes, is_recurring, day_of_week, effective_from
)
SELECT 
    NULL, '14:00'::TIME, '17:00'::TIME, true, 4, 0, 
    'Afternoon appointments - Monday to Friday', true, day_num, CURRENT_DATE
FROM generate_series(1, 5) as day_num
WHERE NOT EXISTS (SELECT 1 FROM availability_slots WHERE is_recurring = true AND start_time = '14:00'::TIME)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Test the function with today's date
-- SELECT * FROM get_available_slots_for_date(CURRENT_DATE);

-- Verify the new columns exist
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'availability_slots' 
-- ORDER BY ordinal_position;
