# 🔐 HeartSense User Authentication & Session Management

## Overview

HeartSense now includes **user authentication** and **user-based session management**. Users can create accounts, sign in, and manage their conversation history across multiple sessions.

---

## ✨ New Features

### 1. **User Authentication**
- ✅ Sign up with email and password
- ✅ Sign in with existing account
- ✅ JWT-based authentication
- ✅ Refresh token support
- ✅ Secure password hashing (bcrypt)
- ✅ Supabase Auth integration

### 2. **User Session Management**
- ✅ Each user has their own chat sessions
- ✅ View all sessions for authenticated user
- ✅ Track message count per session
- ✅ Delete individual sessions
- ✅ Session metadata (personality, language, timestamps)

### 3. **Security**
- ✅ Row Level Security (RLS) in Supabase
- ✅ JWT tokens for API authentication
- ✅ Protected endpoints
- ✅ User can only access their own data

---

## 📦 Setup

### 1. Install Additional Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages:
- `python-jose[cryptography]` - JWT token handling
- `passlib[bcrypt]` - Password hashing
- `python-multipart` - Form data support
- `email-validator` - Email validation

### 2. Create Database Tables

Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/auqhuozialxppjnpuioa/sql) and run:

```bash
# The complete schema is in database_schema.sql
```

Or copy and run the SQL from `database_schema.sql` file.

This creates:
- `message_history` table (for chat messages)
- `user_sessions` table (links users to sessions)
- Row Level Security policies
- Helpful views and functions

### 3. Update Environment Variables

Add to your `backend/.env`:

```env
# Generate a secure JWT secret key
JWT_SECRET_KEY=your_secure_random_key_here
```

Generate a secure key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🔑 API Endpoints

### Authentication Endpoints

#### 1. Sign Up
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2025-01-01T00:00:00Z"
  },
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

---

#### 2. Sign In
**POST** `/api/auth/signin`

Sign in with existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "success": true
}
```

---

#### 3. Sign Out
**POST** `/api/auth/signout`

Sign out the current user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Successfully signed out",
  "success": true
}
```

---

#### 4. Refresh Token
**POST** `/api/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

#### 5. Get Current User
**GET** `/api/auth/me`

Get information about the currently authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### User Session Management Endpoints

#### 6. Get All User Sessions
**GET** `/api/user/sessions`

Get all chat sessions for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user_id": "uuid-here",
  "session_count": 5,
  "sessions": [
    {
      "session_id": "session-uuid-1",
      "user_id": "uuid-here",
      "personality": {
        "archetype": "Caring Listener",
        "playful": 60,
        "talkative": 50,
        "affectionate": 80
      },
      "language": "banglish",
      "message_count": 15,
      "created_at": "2025-01-01T10:00:00Z",
      "last_message_at": "2025-01-01T10:30:00Z"
    }
  ],
  "success": true
}
```

---

#### 7. Delete User Session
**DELETE** `/api/user/sessions/{session_id}`

Delete a specific session for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Session abc-123 deleted successfully",
  "success": true
}
```

---

### Updated Chat Endpoints

#### 8. Chat (Now Requires Authentication)
**POST** `/api/chat/message`

Send a message or initialize a new chat session. **Now requires authentication**.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "message": "Hey, how are you?",
  "session_id": "optional-session-id",
  "personality": {
    "archetype": "Caring Listener",
    "playful": 60,
    "talkative": 50,
    "affectionate": 80
  },
  "language": "banglish"
}
```

**Response:**
```json
{
  "message": {
    "role": "model",
    "text": "Hey! Ami bhalo achi. How was your day? 💕"
  },
  "session_id": "session-uuid-here",
  "success": true
}
```

---

## 🔄 Complete Workflow Example

### Step 1: Register a User
```bash
# Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "full_name": "Demo User"
  }' | jq

# Save the access_token from response
ACCESS_TOKEN="your-access-token-here"
```

### Step 2: Start a Chat Session
```bash
# Initialize chat with personality
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "message": "",
    "personality": {
      "archetype": "Caring Listener",
      "playful": 60,
      "talkative": 50,
      "affectionate": 80
    },
    "language": "banglish"
  }' | jq

# Save the session_id
SESSION_ID="your-session-id-here"
```

### Step 3: Send Messages
```bash
# Send a message
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"message\": \"Hey, I had a tough day today\",
    \"session_id\": \"$SESSION_ID\"
  }" | jq
```

### Step 4: View All Sessions
```bash
# Get all your sessions
curl -X GET http://localhost:8000/api/user/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

### Step 5: Get Session History
```bash
# Get history for a specific session
curl -X GET http://localhost:8000/api/chat/history/$SESSION_ID | jq
```

### Step 6: Delete a Session
```bash
# Delete a session
curl -X DELETE http://localhost:8000/api/user/sessions/$SESSION_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

---

## 🔒 Security Features

### 1. **Password Security**
- Passwords hashed using bcrypt
- Minimum 6 characters required
- Never stored in plain text

### 2. **JWT Tokens**
- Access token expires in 24 hours
- Refresh token expires in 30 days
- Tokens include user ID and email

### 3. **Row Level Security**
- Users can only see their own sessions
- Enforced at database level
- Prevents unauthorized access

### 4. **Protected Endpoints**
- All chat endpoints require authentication
- Invalid tokens return 401 Unauthorized
- Tokens validated on every request

---

## 📊 Database Schema

### `user_sessions` Table
```sql
- id: SERIAL PRIMARY KEY
- user_id: UUID (references auth.users)
- session_id: TEXT UNIQUE
- personality: JSONB
- language: TEXT
- message_count: INTEGER
- created_at: TIMESTAMP
- last_message_at: TIMESTAMP
```

### `message_history` Table
```sql
- id: SERIAL PRIMARY KEY
- session_id: TEXT
- message: JSONB
- created_at: TIMESTAMP
```

---

## 🧪 Testing with Frontend

### 1. Store Tokens
```javascript
// After sign in/sign up
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);
localStorage.setItem('user', JSON.stringify(response.user));
```

### 2. Include Token in Requests
```javascript
const response = await fetch('http://localhost:8000/api/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    message: 'Hello!',
    session_id: sessionId
  })
});
```

### 3. Handle Token Expiration
```javascript
// If you get 401 Unauthorized, refresh the token
async function refreshToken() {
  const response = await fetch('http://localhost:8000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: localStorage.getItem('refresh_token')
    })
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data.access_token;
}
```

---

## 🎯 Migration from Unauthenticated Version

### Before (No Auth):
```bash
# Anyone could chat
POST /api/chat/message
{
  "message": "Hello"
}
```

### After (With Auth):
```bash
# Must sign in first
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

# Then use token
POST /api/chat/message
Headers: Authorization: Bearer <token>
{
  "message": "Hello"
}
```

---

## 📝 Notes

1. **Supabase Auth**: Uses Supabase's built-in authentication
2. **JWT**: Custom JWT tokens for our API endpoints
3. **Sessions**: Automatically linked to authenticated user
4. **History**: Each user sees only their own sessions
5. **Cleanup**: Run `SELECT cleanup_old_sessions();` periodically

---

## 🆘 Troubleshooting

### "Invalid authentication credentials"
- Check your access token is valid
- Token may have expired (use refresh token)
- Ensure Bearer prefix in Authorization header

### "Session not found"
- Verify session belongs to your user
- Check session_id is correct
- User can only access their own sessions

### "Database connection error"
- Verify SUPABASE_DB_URL in .env
- Check Supabase project is active
- Ensure tables were created

---

## 🎉 Summary

- ✅ Full user authentication system
- ✅ Secure JWT-based tokens
- ✅ User-specific session management
- ✅ Protected API endpoints
- ✅ Row Level Security in database
- ✅ Refresh token support
- ✅ Complete REST API for auth & sessions

**All chat features now require authentication!** 🔐
