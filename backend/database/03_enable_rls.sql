-- ===================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================================================
-- This enables security policies on tables
-- ===================================================================

-- Enable RLS on message_history
ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Verification
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('message_history', 'user_sessions');

SELECT 'RLS enabled successfully!' as status;
