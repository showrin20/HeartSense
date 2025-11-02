-- ===================================================================
-- STEP 1: DROP EXISTING OBJECTS (Run this first to clean up)
-- ===================================================================
-- This file removes any existing tables, policies, and indexes
-- Run this ONLY if you're starting fresh or fixing conflicts
-- ===================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on message_history" ON message_history;
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Drop existing tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS message_history CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS user_session_stats CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS cleanup_old_sessions();
DROP FUNCTION IF EXISTS get_user_session_count(UUID);

-- Verification
SELECT 'All existing objects dropped successfully!' as status;
