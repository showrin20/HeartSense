# 🎉 HeartSense v2.0 - User Authentication & Session Management

## What's New?

HeartSense now includes **complete user authentication** and **user-based session management**!

---

## ✅ Implemented Features

### 1. **User Authentication**
- Sign up with email/password
- Sign in with credentials
- JWT access & refresh tokens
- Secure password hashing (bcrypt)
- Supabase Auth integration

### 2. **User Session Management**
- Each user has their own chat sessions
- View all sessions with metadata
- Delete individual sessions
- Track message count & timestamps
- Link sessions to authenticated users

### 3. **Security**
- Row Level Security (RLS) in Supabase
- Protected API endpoints
- Users can only access their own data
- JWT token-based authentication

---

## 📋 Setup Checklist

### 1. Install New Dependencies
```bash
cd backend
pip install -r requirements.txt
```

New packages added:
- `python-jose[cryptography]==3.3.0` - JWT handling
- `passlib[bcrypt]==1.7.4` - Password hashing
- `python-multipart==0.0.20` - Form support
- `email-validator==2.2.0` - Email validation

### 2. Run Database Schema
Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql) and run:

```sql
-- Copy and run the complete SQL from database_schema.sql
```

This creates:
- `user_sessions` table
- Row Level Security policies
- Helpful views & functions

### 3. Update Environment Variables
Add to `backend/.env`:

```env
JWT_SECRET_KEY=your_secure_random_key_here
```

Generate a secure key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🔌 New API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### User Sessions
- `GET /api/user/sessions` - Get all user's sessions
- `DELETE /api/user/sessions/{id}` - Delete a session

### Updated Chat (Now Requires Auth)
- `POST /api/chat/message` - Send message (requires Bearer token)
- `GET /api/chat/history/{id}` - Get session history

---

## 🚀 Quick Start

### 1. Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "full_name": "Demo User"
  }'
```

### 2. Start Chatting (with token)
```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
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
```

### 3. View Your Sessions
```bash
curl http://localhost:8000/api/user/sessions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📁 New Files

### Backend
- ✅ `services/auth_service.py` - Authentication logic
- ✅ `backend/database_schema.sql` - Complete database schema
- ✅ `backend/AUTHENTICATION_GUIDE.md` - Detailed auth documentation
- ✅ Updated `models/schemas.py` - Auth models
- ✅ Updated `services/supabase_history.py` - User session functions
- ✅ Updated `main.py` - Auth endpoints
- ✅ Updated `requirements.txt` - New dependencies

---

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing
   - Minimum 6 characters
   - Never stored in plain text

2. **JWT Tokens**
   - Access token: 24 hours
   - Refresh token: 30 days
   - Signed with secret key

3. **Row Level Security**
   - Database-level enforcement
   - Users see only their own data
   - Automatic with Supabase Auth

4. **Protected Endpoints**
   - Require valid Bearer token
   - 401 for invalid/expired tokens
   - Automatic user identification

---

## 📊 Database Schema

```sql
user_sessions
├── id (PK)
├── user_id (FK -> auth.users)
├── session_id (unique)
├── personality (JSONB)
├── language
├── message_count
├── created_at
└── last_message_at

message_history (unchanged)
├── id (PK)
├── session_id
├── message (JSONB)
└── created_at
```

---

## 🎯 Next Steps

### For Backend:
1. ✅ Install new dependencies
2. ✅ Run database schema SQL
3. ✅ Add JWT_SECRET_KEY to .env
4. ✅ Restart the server

### For Frontend:
1. Create login/signup pages
2. Store JWT tokens (localStorage)
3. Add Authorization header to API calls
4. Implement token refresh logic
5. Add session management UI

---

## 📚 Documentation

- **[AUTHENTICATION_GUIDE.md](backend/AUTHENTICATION_GUIDE.md)** - Complete auth documentation
- **[database_schema.sql](backend/database_schema.sql)** - Database setup
- **[API_ROUTES.md](backend/API_ROUTES.md)** - All API endpoints
- **[README.md](README.md)** - Project overview

---

## 🔄 Migration Guide

### Old Way (No Auth)
```javascript
// Anyone could chat
fetch('/api/chat/message', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
})
```

### New Way (With Auth)
```javascript
// 1. Sign in first
const authResponse = await fetch('/api/auth/signin', {
  method: 'POST',
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'password123' 
  })
});
const { access_token } = await authResponse.json();

// 2. Use token for chat
fetch('/api/chat/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({ message: 'Hello' })
})
```

---

## ⚠️ Breaking Changes

1. **All chat endpoints now require authentication**
   - Must include `Authorization: Bearer <token>` header
   - Returns 401 if not authenticated

2. **Sessions are now user-specific**
   - Each user can only see their own sessions
   - Session IDs must belong to the authenticated user

3. **New database tables required**
   - `user_sessions` table must be created
   - Run the SQL schema before using

---

## 🧪 Testing

### Test Authentication Flow
```bash
# 1. Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 2. Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Use the access_token from response in subsequent requests
```

---

## 🎊 Summary

- ✅ Complete authentication system
- ✅ User-based session management
- ✅ Secure JWT tokens
- ✅ Row Level Security
- ✅ Protected API endpoints
- ✅ Ready for production use

**HeartSense is now a secure, multi-user platform!** 🚀

For detailed documentation, see [AUTHENTICATION_GUIDE.md](backend/AUTHENTICATION_GUIDE.md)
