-- ===================================================================
-- STEP 4: CREATE RLS POLICIES
-- ===================================================================
-- This sets up security policies for data access
-- ===================================================================

-- ============================================
-- Policies for message_history table
-- ============================================

-- Allow all operations on message_history
-- (Messages are linked to sessions, which are linked to users)
CREATE POLICY "Allow all operations on message_history" 
ON message_history
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Note: For stricter security, you can restrict by session_id
-- and verify session ownership via user_sessions table


-- ============================================
-- Policies for user_sessions table
-- ============================================

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions" 
ON user_sessions
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create their own sessions" 
ON user_sessions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update their own sessions" 
ON user_sessions
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions" 
ON user_sessions
FOR DELETE 
USING (auth.uid() = user_id);


-- Verification
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('message_history', 'user_sessions')
ORDER BY tablename, policyname;

SELECT 'Policies created successfully!' as status;
