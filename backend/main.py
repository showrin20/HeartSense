from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.gemini_service import (
    initialize_partner_chat,
    get_partner_response,
    get_tutor_analysis,
    get_session_history,
    clear_session_history
)
from services.auth_service import (
    sign_up_user,
    sign_in_user,
    sign_out_user,
    get_current_user,
    refresh_access_token
)
from services.supabase_history import (
    get_user_sessions,
    create_user_session,
    update_session_message_count,
    delete_user_session
)
from models.schemas import (
    PartnerPersonality,
    Language,
    ChatRequest,
    ChatMessageResponse,
    AnalysisRequest,
    AnalysisResponse,
    Message,
    UserSignUp,
    UserLogin,
    AuthResponse,
    UserResponse,
    SessionMetadata
)

# Load environment variables
load_dotenv()

# Security
security = HTTPBearer()

app = FastAPI(
    title="HeartSense API",
    description="AI-powered emotional intelligence and relationship conversation platform with user authentication",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port and common alternatives
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "HeartSense API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "HeartSense API"}


# Authentication dependency
async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Dependency to get current user from JWT token"""
    token = credentials.credentials
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user


# === Authentication Endpoints ===

@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup(user_data: UserSignUp):
    """
    Register a new user
    
    Args:
        user_data: User registration data (email, password, optional full_name)
        
    Returns:
        AuthResponse with access_token, refresh_token, and user info
    """
    try:
        result = await sign_up_user(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name
        )
        
        return AuthResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            user=result["user"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/api/auth/signin", response_model=AuthResponse)
async def signin(user_data: UserLogin):
    """
    Sign in an existing user
    
    Args:
        user_data: User login data (email, password)
        
    Returns:
        AuthResponse with access_token, refresh_token, and user info
    """
    try:
        result = await sign_in_user(
            email=user_data.email,
            password=user_data.password
        )
        
        return AuthResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            user=result["user"]
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sign in failed: {str(e)}")


@app.post("/api/auth/signout")
async def signout(current_user: UserResponse = Depends(get_current_user_from_token)):
    """
    Sign out the current user
    
    Args:
        current_user: Current authenticated user (from token)
        
    Returns:
        Success message
    """
    try:
        await sign_out_user(current_user.user_id)
        return {"message": "Successfully signed out", "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sign out failed: {str(e)}")


@app.post("/api/auth/refresh")
async def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token
    
    Args:
        refresh_token: JWT refresh token
        
    Returns:
        New access token
    """
    try:
        result = await refresh_access_token(refresh_token)
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token refresh failed: {str(e)}")


@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user_from_token)):
    """
    Get current user information
    
    Args:
        current_user: Current authenticated user (from token)
        
    Returns:
        User information
    """
    return current_user


# === User Session Management Endpoints ===

@app.get("/api/user/sessions")
async def get_user_session_list(current_user: UserResponse = Depends(get_current_user_from_token)):
    """
    Get all chat sessions for the current user
    
    Args:
        current_user: Current authenticated user (from token)
        
    Returns:
        List of user's chat sessions with metadata
    """
    try:
        sessions = get_user_sessions(current_user.user_id)
        return {
            "user_id": current_user.user_id,
            "session_count": len(sessions),
            "sessions": sessions,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")


@app.delete("/api/user/sessions/{session_id}")
async def delete_user_session_endpoint(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user_from_token)
):
    """
    Delete a specific session for the current user
    
    Args:
        session_id: The session ID to delete
        current_user: Current authenticated user (from token)
        
    Returns:
        Success message
    """
    try:
        success = delete_user_session(session_id, current_user.user_id)
        if success:
            return {
                "message": f"Session {session_id} deleted successfully",
                "success": True
            }
        else:
            raise HTTPException(status_code=404, detail="Session not found or delete failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete session: {str(e)}")


# === Chat Endpoints ===

@app.post("/api/chat/message", response_model=ChatMessageResponse)
async def chat(request: ChatRequest, current_user: UserResponse = Depends(get_current_user_from_token)):
    """
    Unified chat endpoint - handles both initialization and messaging
    
    Requires authentication. If personality is provided, initializes a new chat session first.
    Otherwise, sends message to existing session.
    
    Args:
        request: ChatRequest containing message and optional personality/language/session_id
        current_user: Current authenticated user (from token)
        
    Returns:
        AI partner's response with session_id
    """
    try:
        session_id = request.session_id
        user_id = current_user.user_id
        
        print(f"Chat request - session_id: {session_id}, has_personality: {request.personality is not None}, message: '{request.message[:50] if request.message else 'None'}...'")
        
        # If personality is provided, initialize chat first
        if request.personality:
            session_id = initialize_partner_chat(
                request.personality, 
                request.language,
                session_id
            )
            
            # Create user session entry
            create_user_session(
                user_id=user_id,
                session_id=session_id,
                personality=request.personality.dict(),
                language=request.language.value
            )
            
            # For initialization, return welcome message
            if not request.message or request.message.strip() == "":
                if request.language == Language.BANGLISH:
                    initial_text = "Hey, ki korcho? I've been thinking about you."
                else:
                    initial_text = "Hey, what are you up to? I've been thinking about you."
                
                return ChatMessageResponse(
                    message=Message(role="model", text=initial_text),
                    session_id=session_id,
                    success=True
                )
        
        # Validate message and session
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID is required for sending messages")
        
        # Get response from AI partner
        try:
            response_text = await get_partner_response(request.message, session_id)
        except ValueError as ve:
            # Session not found in active sessions - may need to reinitialize
            print(f"Session {session_id} not found in active sessions. Error: {str(ve)}")
            raise HTTPException(status_code=400, detail=f"Session not initialized or expired. Please start a new session. Error: {str(ve)}")
        
        # Update session message count
        update_session_message_count(session_id, user_id)
        
        return ChatMessageResponse(
            message=Message(role="model", text=response_text),
            session_id=session_id,
            success=True
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process chat: {str(e)}")

@app.post("/api/analysis/tutor", response_model=AnalysisResponse)
async def analyze_conversation(request: AnalysisRequest):
    """
    Analyze the conversation and provide tutor feedback
    
    Args:
        request: AnalysisRequest containing message history and language
        
    Returns:
        Analysis with score, personality assessment, and tips
    """
    try:
        if not request.messages or len(request.messages) == 0:
            raise HTTPException(status_code=400, detail="No messages to analyze")
        
        analysis = await get_tutor_analysis(request.messages, request.language)
        
        return AnalysisResponse(
            score=analysis.score,
            personality=analysis.personality,
            idealPartner=analysis.idealPartner,
            tips=analysis.tips,
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze conversation: {str(e)}")

@app.post("/api/chat/reset")
async def reset_chat(session_id: str = None):
    """
    Reset the current chat session
    
    Args:
        session_id: Optional session ID to reset
        
    Returns:
        Success message
    """
    try:
        if session_id:
            clear_session_history(session_id)
            return {"message": f"Chat session {session_id} reset successfully", "success": True}
        return {"message": "No session ID provided", "success": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset chat: {str(e)}")


@app.get("/api/chat/history/{session_id}")
async def get_history(session_id: str):
    """
    Get the message history for a session
    
    Args:
        session_id: The session ID
        
    Returns:
        List of messages with metadata
    """
    try:
        messages = get_session_history(session_id)
        return {
            "session_id": session_id,
            "message_count": len(messages),
            "messages": messages,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")


@app.delete("/api/chat/history/{session_id}")
async def delete_history(session_id: str):
    """
    Delete the message history for a session
    
    Args:
        session_id: The session ID to delete
        
    Returns:
        Success message
    """
    try:
        clear_session_history(session_id)
        return {
            "message": f"Session {session_id} history deleted successfully",
            "session_id": session_id,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete history: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
