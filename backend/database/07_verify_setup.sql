-- ===================================================================
-- STEP 7: VERIFICATION QUERIES
-- ===================================================================
-- Run this to verify your database setup is correct
-- ===================================================================

-- Check tables exist
SELECT 'Checking tables...' as step;
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('message_history', 'user_sessions')
ORDER BY table_name;

-- Check indexes
SELECT 'Checking indexes...' as step;
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('message_history', 'user_sessions')
ORDER BY tablename, indexname;

-- Check RLS is enabled
SELECT 'Checking RLS...' as step;
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('message_history', 'user_sessions');

-- Check policies
SELECT 'Checking policies...' as step;
SELECT tablename, policyname, cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('message_history', 'user_sessions')
ORDER BY tablename, policyname;

-- Check views
SELECT 'Checking views...' as step;
SELECT table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public';

-- Check functions
SELECT 'Checking functions...' as step;
SELECT routine_name as function_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- Check constraints
SELECT 'Checking constraints...' as step;
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('message_history', 'user_sessions')
ORDER BY tc.table_name, tc.constraint_type;

-- Final summary
SELECT 'Setup verification complete!' as status;
SELECT 
    (SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name IN ('message_history', 'user_sessions')) as tables_count,
    (SELECT COUNT(*) FROM pg_indexes 
     WHERE schemaname = 'public' AND tablename IN ('message_history', 'user_sessions')) as indexes_count,
    (SELECT COUNT(*) FROM pg_policies 
     WHERE schemaname = 'public' AND tablename IN ('message_history', 'user_sessions')) as policies_count,
    (SELECT COUNT(*) FROM information_schema.views 
     WHERE table_schema = 'public') as views_count,
    (SELECT COUNT(*) FROM information_schema.routines 
     WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') as functions_count;
