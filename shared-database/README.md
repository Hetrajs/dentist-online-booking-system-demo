# Shared Database Schema

This directory contains the shared Supabase database schema used by both the patient-facing and admin-facing applications.

## 🏗️ **Architecture**

```
Dentist Website/
├── patient-facing/          # Patient booking & dashboard
├── admin-facing/           # Admin management dashboard  
├── shared-database/        # 👈 Shared schema & config
│   ├── supabase-schema.sql # Master database schema
│   ├── README.md          # This file
│   └── .env.example       # Environment template
```

## 🔧 **Setup Instructions**

### 1. **Single Supabase Project**
Both applications use the same Supabase project:
- **URL**: `https://yuyruqdqlkecsnschziv.supabase.co`
- **Anon Key**: Same for both apps
- **Service Role Key**: Same for both apps

### 2. **Schema Management**
- **Master Schema**: `shared-database/supabase-schema.sql`
- **Apply Schema**: Run this file in your Supabase SQL Editor
- **Updates**: Always update the master schema file, then apply to Supabase

### 3. **Environment Variables**
Both apps should have identical Supabase configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yuyruqdqlkecsnschziv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 📊 **Database Tables**

### Core Tables:
- `user_profiles` - Patient information
- `appointments` - Appointment bookings
- `services` - Available dental services
- `contact_forms` - Contact form submissions
- `testimonials` - Patient reviews
- `newsletter_subscribers` - Email subscriptions

### Admin Tables:
- `appointment_history` - Audit trail
- `notifications` - System notifications
- `availability_slots` - Doctor availability

## 🔄 **Data Flow**

```
Patient App → Supabase ← Admin App
     ↓                      ↑
   Books                 Manages
Appointments           Appointments
```

## 🚀 **Deployment**

1. **Apply Schema**: Copy `supabase-schema.sql` to Supabase SQL Editor
2. **Configure RLS**: Row Level Security policies are included
3. **Test Connection**: Both apps should connect successfully

## 🔒 **Security**

- **RLS Enabled**: Row Level Security on all tables
- **Auth Integration**: Supabase Auth for user management
- **Service Role**: Admin operations use service role key
- **Anon Key**: Public operations use anon key
