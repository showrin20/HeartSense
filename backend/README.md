# HeartSense Backend API

FastAPI backend for the HeartSense emotional intelligence and relationship conversation platform.

## Features

- **Partner Chat**: Initialize AI partner with customizable personality traits
- **Real-time Messaging**: Send and receive messages from your AI partner
- **Conversation Analysis**: Get detailed emotional intelligence feedback
- **Bilingual Support**: English and Banglish (Bengali-English mix)

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Google Gemini AI**: Advanced AI for natural conversations
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: Lightning-fast ASGI server

## Setup

### Prerequisites

- Python 3.9 or higher
- Google Gemini API key ([Get it here](https://aistudio.google.com/apikey))

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

```bash
# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file from the example:

```bash
cp .env.example .env
```

6. Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

## Running the Server

### Development Mode (with auto-reload)

```bash
python main.py
```

Or using uvicorn directlyspan

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:

- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### Health Check

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

### Chat Endpoints

- `POST /api/chat/message` - Unified endpoint for chat (handles both initialization and messaging)
  - If `personality` is provided: Initializes new chat session
  - If `personality` is omitted: Sends message to existing session
- `POST /api/chat/reset` - Reset the current chat session

### Analysis Endpoint

- `POST /api/analysis/tutor` - Analyze conversation and get feedback

## Example API Usage

### Initialize Chat and Send First Message

```bash
curl -X POST "http://localhost:8000/api/chat/message" \
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

### Send Message to Existing Chat

```bash
curl -X POST "http://localhost:8000/api/chat/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hey, how are you?"
  }'
```

### Get Analysis

```bash
curl -X POST "http://localhost:8000/api/analysis/tutor" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "text": "Hey, how are you?"},
      {"role": "model", "text": "I am doing great! How about you?"}
    ],
    "language": "english"
  }'
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application and routes
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example          # Example environment variables
├── models/
│   └── schemas.py        # Pydantic models for requests/responses
└── services/
    └── gemini_service.py # Gemini AI integration
```

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Common dev port)

To add more origins, update the `allow_origins` list in `main.py`.

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error

Error responses include a `detail` field with the error message.

## Development

### Adding New Endpoints

1. Define request/response models in `models/schemas.py`
2. Add business logic to appropriate service file
3. Create endpoint in `main.py` with proper documentation

### Testing

Test endpoints using:

- Interactive docs at `/docs`
- cURL commands
- Python requests library
- Postman or similar API clients

## License

Private project - All rights reserved
