# Supabase Database Setup Instructions

## Quick Setup

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard/projects
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema**
   - Copy the entire content of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" button

## What This Schema Does

### ✅ **Safe to Run Multiple Times**
- Uses `IF NOT EXISTS` for all tables
- Uses `DO $$` blocks to safely add columns to existing tables
- Won't break existing data

### 🗄️ **Tables Created/Updated**
- **`user_profiles`** - User profile information
- **`appointments`** - Enhanced appointment booking with status tracking
- **`contact_forms`** - Contact form submissions
- **`testimonials`** - Patient testimonials
- **`services`** - Dental services catalog
- **`newsletter_subscribers`** - Newsletter subscriptions
- **`appointment_history`** - Audit trail for appointment changes
- **`notifications`** - In-app notification system
- **`availability_slots`** - Time slot management

### 🔧 **Enhanced Appointments Table**
The schema will add these columns to your existing appointments table:
- `appointment_date` - Confirmed appointment datetime
- `duration` - Appointment duration in minutes
- `price` - Service price in cents
- `status` - Workflow status (pending, confirmed, completed, etc.)
- `priority` - Priority level (low, normal, high, urgent)
- `payment_status` - Payment tracking (unpaid, partial, paid, refunded)
- `payment_amount` - Amount paid in cents
- `notes` - Internal staff notes
- `reminder_sent` - Reminder tracking
- `confirmed_at` - Confirmation timestamp
- `completed_at` - Completion timestamp
- `cancelled_at` - Cancellation timestamp
- `cancellation_reason` - Reason for cancellation

### 🔒 **Security Features**
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public access for services and testimonials
- Secure policies for all operations

### 📊 **Sample Data Included**
- 6 dental services with realistic pricing
- 6 patient testimonials
- All ready for immediate use

## Troubleshooting

### ✅ **Fixed Issues**
- **"relation 'appointments' does not exist"** - Fixed by reordering table creation
- **"column 'payment_status' does not exist"** - Fixed by adding missing columns safely
- **Multiple schema files confusion** - Consolidated into single `supabase-schema.sql`

### If you get "column already exists" errors:
- This is normal and safe to ignore
- The schema handles existing columns gracefully

### If you get "relation already exists" errors:
- This is normal and safe to ignore
- The schema uses `IF NOT EXISTS` to prevent conflicts

### If you get permission errors:
- Make sure you're running this as the project owner
- Check that RLS policies are properly set

### If you get constraint errors:
- The schema safely adds constraints only if they don't exist
- Existing data will be preserved

## After Running the Schema

1. **Test the connection** - Try logging into your app
2. **Book a test appointment** - Verify the booking system works
3. **Check the dashboard** - Confirm appointment tracking works
4. **Verify notifications** - Test the notification system

## File Structure Cleanup

The following files have been consolidated into `supabase-schema.sql`:
- ~~`supabase-schema-clean.sql`~~ (removed)
- ~~`supabase-schema-fixed.sql`~~ (removed)
- ~~`supabase-reset.sql`~~ (removed)

**Use only `supabase-schema.sql` going forward.**
