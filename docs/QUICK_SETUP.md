# ⚡ Quick Setup - Copy & Paste Guide

**For error: "policy already exists" or "table already exists"**

---

## 🎯 Step 1: Clean Up (Run this first)

Copy and paste this into Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on message_history" ON message_history;
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Drop existing tables
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS message_history CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS user_session_stats CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS cleanup_old_sessions();
DROP FUNCTION IF EXISTS get_user_session_count(UUID);

SELECT 'Cleanup complete!' as status;
```

✅ You should see: "Cleanup complete!"

---

## 🎯 Step 2: Create Everything (Run this next)

Copy and paste this into Supabase SQL Editor:

```sql
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

-- Success message
SELECT 'Database setup complete! ✅' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('message_history', 'user_sessions');
```

✅ You should see: "Database setup complete! ✅" and a list of 2 tables

---

## 🎯 Step 3: Update .env File

1. Go to: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/settings/database

2. Copy the **Connection pooling** URL (Transaction mode)

3. Replace `[YOUR-PASSWORD]` with your actual password

4. Update `backend/.env`:
```bash
SUPABASE_DB_URL=postgresql://postgres.auqhuozialxppjnpuioa:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 🎯 Step 4: Restart Backend

```bash
# Stop current server (Ctrl+C)
# Then restart
cd /Users/showrinrahman/Desktop/HeartSense/backend
python main.py
```

---

## ✅ Done!

Your database is now set up. No more errors! 🎉

**Common Issues:**
- ❌ "policy already exists" → Run Step 1 first
- ❌ "SUPABASE_DB_URL not set" → Complete Step 3
- ❌ "table not found" → Run Step 2 again
- ❌ 403 Forbidden → Check if user is authenticated

**Need detailed docs?** See `SETUP_INSTRUCTIONS.md`
