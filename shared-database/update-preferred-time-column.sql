-- Migration to update preferred_time column from TIME to TEXT
-- This allows storing time ranges like "09:00:00-12:00:00" instead of just single times

-- First, add a new temporary column
ALTER TABLE appointments ADD COLUMN preferred_time_new TEXT;

-- Copy existing data, converting TIME to TEXT format
UPDATE appointments SET preferred_time_new = preferred_time::TEXT;

-- Drop the old column
ALTER TABLE appointments DROP COLUMN preferred_time;

-- Rename the new column to the original name
ALTER TABLE appointments RENAME COLUMN preferred_time_new TO preferred_time;

-- Add NOT NULL constraint
ALTER TABLE appointments ALTER COLUMN preferred_time SET NOT NULL;

-- Add a comment to document the new format
COMMENT ON COLUMN appointments.preferred_time IS 'Stores time ranges in format "HH:MM:SS-HH:MM:SS" (e.g., "09:00:00-12:00:00")';
