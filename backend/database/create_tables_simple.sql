-- ===================================================================
-- ⚠️ DEPRECATED: This file is outdated
-- Please use the files in the database/ folder instead
-- ===================================================================
-- 
-- For quick setup, use: database/QUICK_SETUP.md
-- For detailed setup, use: database/SETUP_INSTRUCTIONS.md
-- 
-- This file is kept for reference only.
-- ===================================================================

-- If you get "policy already exists" error, run this first:
DROP POLICY IF EXISTS "Allow all operations on message_history" ON message_history;
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Then run the SQL files in database/ folder in order (01 through 07)
