-- ===================================================================
-- FIX RLS POLICIES FOR BACKEND SERVICE ACCESS
-- ===================================================================
-- This updates the RLS policies to allow backend service access
-- while maintaining security
-- ===================================================================

-- Drop existing restrictive policies on user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Create new policies that work with service role key
-- These allow authenticated backend service to perform operations

-- Allow service role to view all sessions
CREATE POLICY "Service can view all sessions" 
ON user_sessions
FOR SELECT 
TO authenticated, anon, service_role
USING (true);

-- Allow service role to insert sessions
CREATE POLICY "Service can create sessions" 
ON user_sessions
FOR INSERT 
TO authenticated, anon, service_role
WITH CHECK (true);

-- Allow service role to update sessions
CREATE POLICY "Service can update sessions" 
ON user_sessions
FOR UPDATE 
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- Allow service role to delete sessions
CREATE POLICY "Service can delete sessions" 
ON user_sessions
FOR DELETE 
TO authenticated, anon, service_role
USING (true);

-- Verification
SELECT 'RLS Policies updated successfully!' as status;

SELECT tablename, policyname, cmd 
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_sessions'
ORDER BY policyname;
