-- ===================================================================
-- STEP 6: SEED DATA (OPTIONAL - For Testing Only)
-- ===================================================================
-- This file contains sample data for testing
-- DO NOT RUN IN PRODUCTION
-- ===================================================================

-- Note: You need actual user_id from auth.users table
-- This is just a template - replace with your actual user ID

-- Example: Insert a test session (replace USER_ID_HERE with actual UUID)
/*
INSERT INTO user_sessions (user_id, session_id, personality, language, message_count)
VALUES (
    'USER_ID_HERE'::UUID,  -- Replace with actual user ID from auth.users
    'test-session-123',
    '{"trait": "caring", "communication_style": "warm"}'::JSONB,
    'banglish',
    0
);
*/

-- Example: Insert test messages
/*
INSERT INTO message_history (session_id, message)
VALUES 
    ('test-session-123', '{"type": "human", "data": {"content": "Hello"}}'::JSONB),
    ('test-session-123', '{"type": "ai", "data": {"content": "Hi! How are you?"}}'::JSONB);
*/

-- Verification query
SELECT 'Seed data setup template ready!' as status;
SELECT 'Remember to replace USER_ID_HERE with actual UUID from auth.users' as note;
