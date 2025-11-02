# HeartSense API Routes

## 🔐 Session History Routes

### 1. Get Session History
**Endpoint:** `GET /api/chat/history/{session_id}`

**Description:** Retrieve all messages for a specific chat session

**Parameters:**
- `session_id` (path parameter) - The UUID of the session

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message_count": 10,
  "messages": [
    {
      "role": "user",
      "text": "Hey, how are you?"
    },
    {
      "role": "model",
      "text": "Hey! Ami bhalo achi. Missing you! 💕"
    }
  ],
  "success": true
}
```

**Example:**
```bash
curl http://localhost:8000/api/chat/history/550e8400-e29b-41d4-a716-446655440000
```

---

### 2. Delete Session History
**Endpoint:** `DELETE /api/chat/history/{session_id}`

**Description:** Delete all messages for a specific chat session

**Parameters:**
- `session_id` (path parameter) - The UUID of the session to delete

**Response:**
```json
{
  "message": "Session 550e8400-e29b-41d4-a716-446655440000 history deleted successfully",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "success": true
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/chat/history/550e8400-e29b-41d4-a716-446655440000
```

---

## 💬 Chat Routes

### 3. Initialize Chat Session
**Endpoint:** `POST /api/chat/message`

**Description:** Initialize a new chat session with personality settings

**Request Body:**
```json
{
  "message": "",
  "personality": {
    "archetype": "Caring Listener",
    "playful": 60,
    "talkative": 50,
    "affectionate": 80
  },
  "language": "banglish",
  "session_id": "optional-custom-session-id"
}
```

**Response:**
```json
{
  "message": {
    "role": "model",
    "text": "Hey, ki korcho? I've been thinking about you."
  },
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "success": true
}
```

**Example:**
```bash
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
```

---

### 4. Send Message
**Endpoint:** `POST /api/chat/message`

**Description:** Send a message in an existing chat session

**Request Body:**
```json
{
  "message": "Hey, I missed you!",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "message": {
    "role": "model",
    "text": "Aww, ami o tomar jonno wait korchilam! 💕 Tell me about your day!"
  },
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hey, I missed you!",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

---

### 5. Reset Chat Session
**Endpoint:** `POST /api/chat/reset?session_id={session_id}`

**Description:** Clear chat history (alias for DELETE)

**Parameters:**
- `session_id` (query parameter) - The session ID to reset

**Response:**
```json
{
  "message": "Chat session 550e8400-e29b-41d4-a716-446655440000 reset successfully",
  "success": true
}
```

**Example:**
```bash
curl -X POST "http://localhost:8000/api/chat/reset?session_id=550e8400-e29b-41d4-a716-446655440000"
```

---

## 📊 Analysis Routes

### 6. Get Tutor Analysis
**Endpoint:** `POST /api/analysis/tutor`

**Description:** Analyze conversation and get emotional intelligence feedback

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "text": "Hey"},
    {"role": "model", "text": "Hey! How are you?"},
    {"role": "user", "text": "I'm feeling stressed"}
  ],
  "language": "banglish"
}
```

**Response:**
```json
{
  "score": 75,
  "personality": "Thoughtful Communicator 💭",
  "idealPartner": "Someone patient and understanding who values deep conversations",
  "tips": [
    "Try to express your feelings more openly",
    "Practice active listening by acknowledging emotions",
    "Don't be afraid to show vulnerability"
  ],
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/chat/analysis/tutor \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "text": "Hey"},
      {"role": "model", "text": "Hey! How are you?"}
    ],
    "language": "english"
  }'
```

---

## 🏥 Health Routes

### 7. Root Health Check
**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "HeartSense API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

### 8. Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "HeartSense API"
}
```

---

## 📝 Data Models

### Message
```typescript
{
  role: "user" | "model",
  text: string
}
```

### PartnerPersonality
```typescript
{
  archetype: string,        // e.g., "Caring Listener", "Confident Teaser"
  playful: number,          // 0-100
  talkative: number,        // 0-100
  affectionate: number      // 0-100
}
```

### Language
```typescript
"banglish" | "english"
```

---

## 🔄 Complete Workflow Example

```bash
# 1. Initialize a new chat session
SESSION_ID=$(curl -X POST http://localhost:8000/api/chat/message \
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
  }' | jq -r '.session_id')

echo "Session ID: $SESSION_ID"

# 2. Send a message
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Hey, how was your day?\",
    \"session_id\": \"$SESSION_ID\"
  }"

# 3. Get history
curl http://localhost:8000/api/chat/history/$SESSION_ID

# 4. Delete history when done
curl -X DELETE http://localhost:8000/api/chat/history/$SESSION_ID
```

---

## 🌐 Interactive API Documentation

Visit these URLs when the server is running:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

These provide interactive API documentation where you can test all endpoints directly from your browser.
