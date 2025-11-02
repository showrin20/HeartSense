# 🗄️ HeartSense Database Setup Instructions

Complete guide to setting up your Supabase database for HeartSense.

---

## 📋 Prerequisites

- ✅ Supabase account created
- ✅ Project created: `auqhuozialxppjnpuioa`
- ✅ Access to Supabase SQL Editor

---

## 🚀 Setup Steps

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa
2. Click on "SQL Editor" in the left sidebar
3. Click "New query" button

---

### Step 2: Run SQL Files in Order

**IMPORTANT:** Run these files **IN ORDER** from the SQL Editor.

#### Option A: Fresh Install (Recommended)

If this is your first time setting up or you want a clean start:

1. **Run `01_drop_existing.sql`** *(optional - only if tables exist)*
   - Copy contents from `backend/database/01_drop_existing.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see: "All existing objects dropped successfully!"

2. **Run `02_create_tables.sql`** *(required)*
   - Copy contents from `backend/database/02_create_tables.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see: "Tables created successfully!" with table list

3. **Run `03_enable_rls.sql`** *(required)*
   - Copy contents from `backend/database/03_enable_rls.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see: "RLS enabled successfully!"

4. **Run `04_create_policies.sql`** *(required)*
   - Copy contents from `backend/database/04_create_policies.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see: "Policies created successfully!" with policy list

5. **Run `05_create_views_functions.sql`** *(optional but recommended)*
   - Copy contents from `backend/database/05_create_views_functions.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see: "Views and functions created successfully!"

6. **Run `07_verify_setup.sql`** *(verification)*
   - Copy contents from `backend/database/07_verify_setup.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see complete setup summary

#### Option B: Quick Setup (All at Once)

If you want to run everything at once:

1. Open `02_create_tables.sql`, `03_enable_rls.sql`, `04_create_policies.sql`, and `05_create_views_functions.sql`
2. Copy all contents into one query
3. Run in SQL Editor
4. Verify with `07_verify_setup.sql`

---

### Step 3: Get Database Connection String

1. Go to: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/settings/database

2. Scroll to **"Connection String"** section

3. Select **"Connection pooling"** → **"Transaction mode"**

4. Copy the connection string - it looks like:
   ```
   postgresql://postgres.auqhuozialxppjnpuioa:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **Get your password:**
   - If you don't have it, click "Reset database password"
   - Copy the new password
   - Replace `[YOUR-PASSWORD]` in the connection string

---

### Step 4: Update Backend .env File

1. Open `/Users/showrinrahman/Desktop/HeartSense/backend/.env`

2. Update the `SUPABASE_DB_URL` line with your actual connection string:
   ```bash
   # Before:
   SUPABASE_DB_URL=postgresql://postgres.auqhuozialxppjnpuioa:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   
   # After (example):
   SUPABASE_DB_URL=postgresql://postgres.auqhuozialxppjnpuioa:your_actual_password_here@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

3. Save the file

---

### Step 5: Restart Backend Server

1. Stop your current backend server (Ctrl+C in terminal)
2. Restart it:
   ```bash
   cd /Users/showrinrahman/Desktop/HeartSense/backend
   python main.py
   ```
3. The server should start without errors now!

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] SQL Editor shows "Tables created successfully!"
- [ ] SQL Editor shows "RLS enabled successfully!"
- [ ] SQL Editor shows "Policies created successfully!"
- [ ] `07_verify_setup.sql` shows all tables, indexes, and policies
- [ ] `.env` file has real password (not `[YOUR-PASSWORD]`)
- [ ] Backend server starts without errors
- [ ] No "table not found" errors in logs
- [ ] No "SUPABASE_DB_URL not set" errors in logs

---

## 📊 What Gets Created

### Tables
- ✅ `message_history` - Stores chat messages (LangChain format)
- ✅ `user_sessions` - Links users to their chat sessions

### Indexes
- ✅ `idx_message_history_session_id` - Fast session lookups
- ✅ `idx_user_sessions_user_id` - Fast user lookups
- ✅ `idx_user_sessions_session_id` - Fast session lookups
- ✅ `idx_user_sessions_created_at` - Fast date-based queries

### Security (RLS Policies)
- ✅ Message history: Allow all (linked to sessions)
- ✅ User sessions: Users can only access their own data

### Views (Optional)
- ✅ `user_session_stats` - Session analytics per user

### Functions (Optional)
- ✅ `cleanup_old_sessions()` - Remove inactive sessions
- ✅ `get_user_session_count(user_id)` - Count user sessions
- ✅ `get_session_message_count(session_id)` - Count messages

---

## 🔧 Troubleshooting

### Error: "policy already exists"
- **Solution:** Run `01_drop_existing.sql` first to clean up, then re-run other files

### Error: "table does not exist"
- **Solution:** Make sure you ran `02_create_tables.sql` successfully

### Error: "relation does not exist"
- **Solution:** Tables weren't created. Run `02_create_tables.sql` again

### Error: "SUPABASE_DB_URL not set"
- **Solution:** Update your `.env` file with actual password (Step 4)

### Error: "Could not find the table 'public.user_sessions'"
- **Solution:** Tables not created or RLS blocking access. Run setup files again.

---

## 🔒 Security Notes

### Production Deployment
Before going to production:

1. ✅ Use strong database password
2. ✅ Keep RLS enabled
3. ✅ Review policies for your security needs
4. ✅ Enable SSL for database connections
5. ✅ Rotate JWT secrets regularly
6. ✅ Set up database backups

### RLS Policy Customization
The `message_history` table currently allows all operations. For stricter security:

```sql
-- Replace the current policy with session-based access
DROP POLICY "Allow all operations on message_history" ON message_history;

CREATE POLICY "Users access messages via their sessions" 
ON message_history
FOR ALL
USING (
    session_id IN (
        SELECT session_id FROM user_sessions 
        WHERE user_id = auth.uid()
    )
);
```

---

## 📞 Need Help?

If you encounter issues:

1. Check the verification output from `07_verify_setup.sql`
2. Review backend logs for specific errors
3. Ensure `.env` file has correct credentials
4. Make sure Supabase project is active
5. Check Supabase dashboard for any quota limits

---

## 🎯 Quick Reference

### Supabase Links
- **Dashboard:** https://supabase.com/dashboard/project/auqhuozialxppjnpuioa
- **SQL Editor:** https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql
- **Database Settings:** https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/settings/database
- **Table Editor:** https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/editor

### File Locations
- SQL Files: `/Users/showrinrahman/Desktop/HeartSense/backend/database/`
- Environment: `/Users/showrinrahman/Desktop/HeartSense/backend/.env`
- Backend Code: `/Users/showrinrahman/Desktop/HeartSense/backend/`

---

**✨ That's it! Your database should now be fully set up and ready to use.**
