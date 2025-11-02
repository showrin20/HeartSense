# ✅ Session History Routes - Quick Reference

## 📍 Available Routes

### 1. **GET** `/api/chat/history/{session_id}`
Get all messages for a specific session

**Example:**
```bash
curl http://localhost:8000/api/chat/history/your-session-id-here
```

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message_count": 5,
  "messages": [
    {"role": "user", "text": "Hey"},
    {"role": "model", "text": "Hey! Ki korcho? 💕"}
  ],
  "success": true
}
```

---

### 2. **DELETE** `/api/chat/history/{session_id}`
Delete all messages for a specific session

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/chat/history/your-session-id-here
```

**Response:**
```json
{
  "message": "Session 550e8400-e29b-41d4-a716-446655440000 history deleted successfully",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "success": true
}
```

---

## 🚀 Quick Start

### 1. Run the SQL to create the table in Supabase:
Go to: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql

```sql
CREATE TABLE IF NOT EXISTS message_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_message_history_session_id ON message_history(session_id);

ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on message_history" ON message_history
FOR ALL USING (true) WITH CHECK (true);
```

### 2. Start the backend server:
```bash
cd backend
python main.py
```

### 3. Test the API:
```bash
# Start a new chat
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "personality": {
      "archetype": "Caring Listener",
      "playful": 60,
      "talkative": 50,
      "affectionate": 80
    },
    "language": "banglish"
  }'

# Copy the session_id from response, then:
SESSION_ID="paste-your-session-id-here"

# Send a message
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Hey, how are you?\",
    \"session_id\": \"$SESSION_ID\"
  }"

# Get history
curl http://localhost:8000/api/chat/history/$SESSION_ID

# Delete history
curl -X DELETE http://localhost:8000/api/chat/history/$SESSION_ID
```

---

## 📖 Full API Documentation

For complete API documentation, see:
- **Interactive Docs:** http://localhost:8000/docs
- **Full API Guide:** [`API_ROUTES.md`](API_ROUTES.md)
- **Setup Guide:** [`SETUP_GUIDE.md`](SETUP_GUIDE.md)

---

## ✨ Features

- ✅ Persistent chat history in Supabase
- ✅ Session-based conversations with UUID tracking
- ✅ Retrieve past conversations anytime
- ✅ Delete sessions when done
- ✅ Automatic message history management with LangChain
- ✅ Supports multiple concurrent sessions

---

## 🔍 Check Server Status

```bash
# Health check
curl http://localhost:8000/health

# API info
curl http://localhost:8000/
```
