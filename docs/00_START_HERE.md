# 🚀 START HERE - HeartSense Database Setup

## ⚡ Quick Fix for Your Current Error

**Error: "relation message_history does not exist"**

This means the tables haven't been created yet. Follow these steps:

---

## 📝 Step-by-Step Instructions

### 1️⃣ Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql

Click **"New query"**

---

### 2️⃣ Run This ONE Query

**Copy everything below and paste into SQL Editor, then click RUN:**

```sql
-- ===================================================================
-- HeartSense Database - Complete Setup (One Query)
-- ===================================================================

-- Create message_history table
CREATE TABLE message_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_message_history_session_id ON message_history(session_id);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    personality JSONB,
    language TEXT DEFAULT 'banglish',
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for message_history
CREATE POLICY "Allow all operations on message_history" 
ON message_history FOR ALL USING (true) WITH CHECK (true);

-- Create policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON user_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON user_sessions FOR DELETE USING (auth.uid() = user_id);

-- Verify setup
SELECT '✅ Database setup complete!' as status;

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('message_history', 'user_sessions');
```

**Expected Output:**
```
✅ Database setup complete!

table_name
message_history
user_sessions
```

---

### 3️⃣ Get Database Password

1. Go to: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/settings/database

2. Scroll to **"Connection String"** section

3. Select **"URI"** tab and find the connection string

4. If you don't see your password, click **"Reset Database Password"**

5. **IMPORTANT:** Save this password somewhere safe!

---

### 4️⃣ Update .env File

Open: `/Users/showrinrahman/Desktop/HeartSense/backend/.env`

Find this line:
```bash
SUPABASE_DB_URL=postgresql://postgres.auqhuozialxppjnpuioa:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR-PASSWORD]` with your actual password:
```bash
SUPABASE_DB_URL=postgresql://postgres.auqhuozialxppjnpuioa:YourActualPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Save the file!**

---

### 5️⃣ Restart Backend Server

In your terminal:
```bash
# Press Ctrl+C to stop current server
# Then restart:
cd /Users/showrinrahman/Desktop/HeartSense/backend
python main.py
```

---

## ✅ Verification

After completing all steps, you should see:

- ✅ No errors in backend logs
- ✅ No "table not found" errors
- ✅ No "SUPABASE_DB_URL not set" errors
- ✅ Chat requests working properly

---

## ❌ Troubleshooting

### If you get "policy already exists"

Run this cleanup first:
```sql
DROP POLICY IF EXISTS "Allow all operations on message_history" ON message_history;
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;
```

Then run the main setup query again.

### If backend still shows errors

1. **Check .env file** - Make sure password is correct (no brackets)
2. **Restart backend** - Must restart after changing .env
3. **Check Supabase** - Verify tables exist in Table Editor
4. **Check logs** - Look for specific error messages

---

## 📚 What's Next?

Once everything is working:

- ✅ Tables are created
- ✅ RLS (security) is enabled
- ✅ Backend connects successfully
- ✅ Chat messages are saved to database

**You're all set! 🎉**

---

## 🔍 Need More Details?

- **Detailed guide:** See `SETUP_INSTRUCTIONS.md`
- **Quick reference:** See `QUICK_SETUP.md`
- **Individual steps:** Use files `02_*.sql` through `07_*.sql`

---

**⚠️ DO NOT run `01_drop_existing.sql` unless you want to delete everything!**

That file is only for cleaning up when starting over.
