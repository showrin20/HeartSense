#!/bin/bash

# HeartSense Quick Setup Script
# This script will help you get your application running

echo "🚀 HeartSense Setup Script"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the HeartSense root directory"
    exit 1
fi

# Step 1: Check backend .env file
echo "📋 Step 1: Checking backend environment variables..."
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found!"
    echo "Creating backend/.env file..."
    cat > backend/.env << 'EOF'
# Gemini API Key
GEMINI_API_KEY=AIzaSyAg4CcrjOD92D3PNBveynt2zgdc-Aj_FEo

# Supabase Configuration
SUPABASE_URL=https://auqhuozialxppjnpuioa.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cWh1b3ppYWx4cHBqbnB1aW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTczNTgsImV4cCI6MjA3NzU3MzM1OH0.XKNTSh2mNEqWL6NcHxJqqkQW3xNYyifixeclEDjGgmg

# JWT Secret Key (for authentication tokens)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-min-32-chars-long-secure-token
EOF
    echo "✅ Created backend/.env file"
else
    echo "✅ backend/.env exists"
fi

echo ""

# Step 2: Check if Python dependencies are installed
echo "📦 Step 2: Checking Python dependencies..."
cd backend
if ! python -c "import fastapi" 2>/dev/null; then
    echo "❌ Python dependencies not installed"
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    echo "✅ Python dependencies are installed"
fi
cd ..

echo ""

# Step 3: Check if port 8000 is available
echo "🔍 Step 3: Checking if port 8000 is available..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8000 is in use"
    echo "Killing process on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 2
    echo "✅ Port 8000 is now free"
else
    echo "✅ Port 8000 is available"
fi

echo ""
echo "=========================="
echo "⚠️  IMPORTANT: Database Setup Required!"
echo "=========================="
echo ""
echo "Before starting the application, you MUST create the database tables in Supabase:"
echo ""
echo "1. Open: https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql"
echo "2. Copy the contents of 'backend/database_schema.sql'"
echo "3. Paste into the SQL Editor and click 'Run'"
echo "4. Verify both tables are created: message_history and user_sessions"
echo ""
echo "=========================="
echo ""
read -p "Have you created the database tables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "❌ Please create the database tables first, then run this script again."
    echo ""
    echo "Quick reference - Run this SQL in Supabase:"
    echo "-------------------------------------------"
    cat backend/database_schema.sql | head -n 70
    echo "..."
    echo "(Full SQL in backend/database_schema.sql)"
    echo ""
    exit 1
fi

echo ""
echo "✅ Great! Starting the application..."
echo ""

# Step 4: Start the backend
echo "🚀 Starting backend server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
    echo "📚 API Docs available at: http://localhost:8000/docs"
else
    echo "❌ Backend failed to start. Check the terminal output above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "=========================="
echo "🎉 Setup Complete!"
echo "=========================="
echo ""
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Now start the frontend in a new terminal:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "To stop the backend, press Ctrl+C or run:"
echo "  kill $BACKEND_PID"
echo ""
