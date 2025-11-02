## 🚀 Run Locally

### Prerequisites
- **Node.js** (for frontend)
- **Python 3.11+** (for backend)
- **Gemini API Key** (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- **Supabase Account** (for persistent chat history)

---

## 📦 Setup Instructions

### 1️⃣ Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Step 3: Set up Supabase Database
Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql) and run:

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

#### Step 4: Configure environment variables
Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://auqhuozialxppjnpuioa.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.auqhuozialxppjnpuioa.supabase.co:5432/postgres
```

#### Step 5: Run the backend server
```bash
python main.py
```

The backend API will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

---

### 2️⃣ Frontend Setup

#### Step 1: Install dependencies
```bash
npm install
```

#### Step 2: Set environment variables
Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Step 3: Run the frontend app
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

---

## 🎯 Quick Start

### Option 1: Run Both (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## 📚 Documentation

- **[API Routes Guide](backend/API_ROUTES.md)** - Complete API endpoint documentation
- **[Session History Routes](backend/SESSION_HISTORY_ROUTES.md)** - Session management API
- **[Setup Guide](backend/SETUP_GUIDE.md)** - Detailed LangChain + Supabase setup
- **[Integration Summary](INTEGRATION_SUMMARY.md)** - Architecture and changes overview

---

## 🔧 Technology Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI (Python)
- LangChain (for conversation management)
- Google Gemini 2.0 (AI model)
- Supabase PostgreSQL (persistent storage)

---

## 🌟 Features

- 💬 AI-powered romantic partner conversations
- 🎭 Customizable personality traits (playful, talkative, affectionate)
- 🌐 Banglish & English language support
- 📊 Emotional intelligence analysis
- 💾 Persistent chat history with sessions
- 🔄 Multi-session support with UUID tracking

---

## 🔗 API Endpoints

- `POST /api/chat/message` - Send messages & initialize chat
- `GET /api/chat/history/{session_id}` - Retrieve session history
- `DELETE /api/chat/history/{session_id}` - Delete session
- `POST /api/analysis/tutor` - Get emotional intelligence feedback
- `GET /health` - Server health check

For full API documentation, visit: http://localhost:8000/docs

---

## 🐛 Troubleshooting

### Backend won't start?
- Ensure all Python packages are installed: `pip install -r requirements.txt`
- Check your `.env` file has all required variables
- Verify Supabase table was created successfully

### Frontend can't connect to backend?
- Make sure backend is running on port 8000
- Check CORS settings in `backend/main.py`

### Database connection errors?
- Verify your `SUPABASE_DB_URL` in `.env`
- Check your Supabase project is active
- Ensure the `message_history` table exists

---

## 📝 License

MIT License - feel free to use this project for learning and development!
