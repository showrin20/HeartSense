-- ===================================================================
-- STEP 5: CREATE VIEWS AND FUNCTIONS
-- ===================================================================
-- Helper views and functions for analytics and maintenance
-- ===================================================================

-- ============================================
-- View: user_session_stats
-- ============================================
-- Provides session statistics per user
CREATE OR REPLACE VIEW user_session_stats AS
SELECT 
    user_id,
    COUNT(*) as total_sessions,
    SUM(message_count) as total_messages,
    MAX(created_at) as latest_session,
    MAX(last_message_at) as last_activity,
    AVG(message_count) as avg_messages_per_session
FROM user_sessions
GROUP BY user_id;

COMMENT ON VIEW user_session_stats IS 'Aggregated statistics for user sessions';


-- ============================================
-- Function: cleanup_old_sessions
-- ============================================
-- Removes sessions with no activity for 30+ days
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS TABLE(deleted_count INTEGER, deleted_sessions TEXT[]) AS $$
DECLARE
    v_deleted_count INTEGER;
    v_deleted_sessions TEXT[];
BEGIN
    -- Delete sessions with no activity for 30 days
    WITH deleted AS (
        DELETE FROM user_sessions
        WHERE (last_message_at IS NULL AND created_at < NOW() - INTERVAL '30 days')
           OR (last_message_at < NOW() - INTERVAL '30 days')
        RETURNING session_id
    )
    SELECT COUNT(*)::INTEGER, ARRAY_AGG(session_id) 
    INTO v_deleted_count, v_deleted_sessions
    FROM deleted;
    
    deleted_count := v_deleted_count;
    deleted_sessions := v_deleted_sessions;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_sessions IS 'Deletes sessions older than 30 days with no activity';


-- ============================================
-- Function: get_user_session_count
-- ============================================
-- Returns the number of sessions for a user
CREATE OR REPLACE FUNCTION get_user_session_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO session_count
    FROM user_sessions
    WHERE user_id = p_user_id;
    
    RETURN session_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_session_count IS 'Returns total session count for a specific user';


-- ============================================
-- Function: get_session_message_count
-- ============================================
-- Returns the number of messages in a session
CREATE OR REPLACE FUNCTION get_session_message_count(p_session_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    msg_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO msg_count
    FROM message_history
    WHERE session_id = p_session_id;
    
    RETURN msg_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_session_message_count IS 'Returns total message count for a specific session';


-- Verification
SELECT 'Views and functions created successfully!' as status;

-- List all views
SELECT table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public';

-- List all functions
SELECT routine_name as function_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';
