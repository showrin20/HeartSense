# HeartSense 💝

An AI-powered emotional intelligence platform that helps you practice and improve your relationship communication skills through realistic conversations with a customizable AI partner.

## Features

- 🤖 **AI Partner Conversations** - Practice emotional communication with a personalized AI partner
- 🎭 **Personality Customization** - Choose from 4 archetypes and customize personality traits
- 🌏 **Bilingual Support** - Chat in English or Banglish (Bengali + English)
- 📊 **Emotional Intelligence Analysis** - Get detailed feedback on your communication skills
- 💬 **Session History** - Resume previous conversations anytime, just like ChatGPT
- 🔐 **Secure Authentication** - JWT-based user authentication

## Tech Stack

**Frontend:**
- React 19.2 + TypeScript
- Vite
- Tailwind CSS

**Backend:**
- FastAPI (Python)
- Google Gemini AI
- Supabase (PostgreSQL)
- LangChain

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11 or 3.13
- **Supabase Account** (for database)
- **Google Gemini API Key** (for AI)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/showrin20/HeartSense.git
cd HeartSense
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend

# Create a virtual environment (requires Python ≥ 3.11)
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

<!-- Project Settings → API → Project URL (copy this)
Project Settings → API → service_role key (copy this, NOT the anon key)
Project Settings → Database → Connection String → URI (copy this) -->

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=service_role_key

# Supabase Database Connection (use POOLER for production)
SUPABASE_DB_URL=postgresql://postgres.your-project-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres

# JWT Secret Key (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
JWT_SECRET_KEY=your_jwt_secret_key_here
```

#### Run Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment if not already activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be running at: **http://localhost:8000**

### 3. Frontend Setup

#### Install Dependencies

Open a **new terminal** (keep backend running):

```bash
# Go to project root
cd HeartSense

# Install frontend dependencies
npm install
```

#### Run Frontend

```bash
# Make sure you're in the project root directory
npm run dev
```

The frontend will be running at: **http://localhost:5173** (or another port if 5173 is busy)

## Running Both Together

### Terminal 1 - Backend:
```bash
cd HeartSense/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 - Frontend:
```bash
cd HeartSense
npm run dev
```

Then open your browser to: **http://localhost:5173**

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in `backend/database/` in order:
   - `02_create_tables.sql` - Creates tables
   - `03_enable_rls.sql` - Enables Row Level Security
   - `04_create_policies.sql` - Creates security policies
3. Get your credentials from Supabase Dashboard > Settings > API

## Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'email_validator'`**
```bash
pip install email-validator==2.2.0
```

**Error: `could not translate host name`**
- Make sure you're using the POOLER connection string format
- Check if your Supabase project is active (not paused)

**Error: `Dependency conflicts`**
- Make sure you're using a clean virtual environment
- Try: `pip install --upgrade pip` then `pip install -r requirements.txt`

### Frontend Issues

**Error: `Failed to fetch`**
- Make sure backend is running on port 8000
- Check CORS settings in `backend/main.py`

**Port already in use**
- Frontend: Change port in `vite.config.ts`
- Backend: Use different port with `--port 8001`

## Project Structure

```
HeartSense/
├── backend/              # FastAPI backend
│   ├── main.py          # API routes
│   ├── services/        # Business logic
│   ├── models/          # Data schemas
│   └── database/        # SQL scripts
├── pages/               # React page components
├── components/          # Reusable React components
├── services/            # Frontend API services
└── types.ts             # TypeScript types
```

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/chat/message` - Send message to AI partner
- `GET /api/chat/history/{session_id}` - Get chat history
- `GET /api/user/sessions` - Get all user sessions
- `POST /api/analysis/tutor` - Get emotional intelligence analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Made with 💝 by [Showrin Rahman](https://github.com/showrin20)
