# HeartSense Backend - LangChain + Supabase Integration

## Overview

This backend now uses **LangChain** with **Google Gemini** and stores chat history in **Supabase** (PostgreSQL).

## Features

- ✅ LangChain integration for conversation management
- ✅ Supabase PostgreSQL for persistent chat history
- ✅ Session-based conversations with unique session IDs
- ✅ Message history retrieval and management
- ✅ Emotional intelligence analysis

## Prerequisites

1. **Python 3.11+**
2. **Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Supabase Account** - Project at `https://auqhuozialxppjnpuioa.supabase.co`

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Supabase

#### Get your Supabase credentials:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa
2. Navigate to **Project Settings** > **API**
   - Copy the `anon` public key (SUPABASE_KEY)
3. Navigate to **Project Settings** > **Database**
   - Copy the connection string (choose "URI" format)
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.auqhuozialxppjnpuioa.supabase.co:5432/postgres`

#### Create the message history table:

Run this SQL in the Supabase SQL Editor:

```sql
-- Create the message_history table for LangChain
CREATE TABLE IF NOT EXISTS message_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_message_history_session_id ON message_history(session_id);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on message_history" ON message_history
FOR ALL USING (true) WITH CHECK (true);
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key

# Supabase Configuration
SUPABASE_URL=https://auqhuozialxppjnpuioa.supabase.co
SUPABASE_KEY=your_actual_supabase_anon_key

# Supabase Database Connection
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.auqhuozialxppjnpuioa.supabase.co:5432/postgres
```

### 4. Run the Server

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### 1. Initialize Chat & Send Message

**POST** `/api/chat/message`

```json
{
  "message": "Hey, how are you?",
  "personality": {
    "archetype": "Caring Listener",
    "playful": 60,
    "talkative": 50,
    "affectionate": 80
  },
  "language": "banglish",
  "session_id": "optional-session-id"
}
```

Response:
```json
{
  "message": {
    "role": "model",
    "text": "Hey! Ami bhalo achi. Missing you! 💕"
  },
  "session_id": "generated-or-provided-session-id",
  "success": true
}
```

### 2. Get Chat History

**GET** `/api/chat/history/{session_id}`

Response:
```json
{
  "messages": [
    {"role": "user", "text": "Hey, how are you?"},
    {"role": "model", "text": "Hey! Ami bhalo achi. Missing you! 💕"}
  ],
  "success": true
}
```

### 3. Reset Chat Session

**POST** `/api/chat/reset?session_id=your-session-id`

### 4. Get Tutor Analysis

**POST** `/api/analysis/tutor`

```json
{
  "messages": [
    {"role": "user", "text": "Hey"},
    {"role": "model", "text": "Hey! How are you?"}
  ],
  "language": "banglish"
}
```

## Architecture

```
User Request
    ↓
FastAPI Endpoint
    ↓
LangChain (gemini_service.py)
    ↓
├─→ Google Gemini (via LangChain)
└─→ Supabase PostgreSQL (Chat History)
    ↓
Response to User
```

## Session Management

- Each conversation has a unique `session_id` (UUID)
- Sessions are stored in Supabase's `message_history` table
- Chat history is automatically loaded for each session
- Sessions persist across server restarts

## Troubleshooting

### Database Connection Issues

If you see `SUPABASE_DB_URL environment variable is not set`:
- Make sure your `.env` file has the correct `SUPABASE_DB_URL`
- Verify the connection string format
- Check that your Supabase database password is correct

### Table Not Found

If you see errors about missing `message_history` table:
- Run the SQL script provided above in Supabase SQL Editor
- Verify the table was created: `SELECT * FROM message_history LIMIT 1;`

### Import Errors

If you see `Import "langchain" could not be resolved`:
- The packages need to be installed: `pip install -r requirements.txt`
- These errors are just linter warnings before installation

## Development

To test locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Test endpoint
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "personality": {...}, "language": "english"}'
```

## Next Steps

1. ✅ Set up your `.env` file with credentials
2. ✅ Create the database table in Supabase
3. ✅ Install dependencies
4. ✅ Run the server
5. 🎉 Start chatting!
