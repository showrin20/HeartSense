-- ===================================================================
-- STEP 2: CREATE TABLES
-- ===================================================================
-- This creates the core tables for HeartSense application
-- ===================================================================

-- Table 1: message_history (stores chat messages for LangChain)
CREATE TABLE message_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for faster session lookups
CREATE INDEX idx_message_history_session_id ON message_history(session_id);

-- Add comment
COMMENT ON TABLE message_history IS 'Stores chat message history for each session using LangChain format';


-- Table 2: user_sessions (links users to their chat sessions)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    personality JSONB,
    language TEXT DEFAULT 'banglish',
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add indexes for faster queries
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at DESC);

-- Add comment
COMMENT ON TABLE user_sessions IS 'Stores user chat sessions with metadata and personality settings';

-- Verification
SELECT 'Tables created successfully!' as status;

SELECT table_name, 
       (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('message_history', 'user_sessions');
