# 🚀 Shared Database Setup Guide

## ✅ **Current Status**
- ✅ Both apps use the same Supabase project
- ✅ Environment variables are synchronized
- ✅ Master schema file created
- ✅ API connections working

## 📋 **Step-by-Step Setup**

### 1. **Verify Environment Variables**

Check that both applications have identical Supabase configuration:

**Patient-facing** (`patient-facing/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://yuyruqdqlkecsnschziv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Admin-facing** (`admin-facing/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://yuyruqdqlkecsnschziv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. **Apply Database Schema**

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to your project: `yuyruqdqlkecsnschziv`
3. Navigate to **SQL Editor**
4. Copy the contents of `shared-database/supabase-schema.sql`
5. Paste and run the SQL script
6. Verify all tables are created successfully

### 3. **Test Both Applications**

**Patient-facing** (http://localhost:3000):
- ✅ Appointment booking works
- ✅ User registration/login works
- ✅ Dashboard shows appointments

**Admin-facing** (http://localhost:3001):
- ✅ Dashboard loads without errors
- ✅ Appointments list loads
- ✅ Statistics display correctly

## 🔄 **Making Schema Changes**

### **DO:**
1. ✅ Update `shared-database/supabase-schema.sql`
2. ✅ Test changes in Supabase SQL Editor
3. ✅ Apply to production database
4. ✅ Update both applications if needed

### **DON'T:**
- ❌ Make direct changes in Supabase without updating schema file
- ❌ Create separate schema files for each app
- ❌ Use different Supabase projects

## 🛠️ **Troubleshooting**

### **API Errors:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Database Connection Issues:**
1. Verify Supabase project is active
2. Check API keys are not expired
3. Ensure RLS policies allow access

### **Schema Sync Issues:**
1. Compare `shared-database/supabase-schema.sql` with actual database
2. Re-run schema script if needed
3. Check for missing tables/columns

## 📊 **Benefits of This Setup**

- 🎯 **Single Source of Truth**: One database, consistent data
- 💰 **Cost Effective**: One Supabase project instead of two
- 🔄 **Real-time Sync**: Changes reflect immediately across apps
- 🛡️ **Centralized Security**: One set of RLS policies
- 📈 **Easier Scaling**: Unified data model
