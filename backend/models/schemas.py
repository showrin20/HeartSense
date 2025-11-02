from pydantic import BaseModel, Field, EmailStr
from typing import List, Literal, Optional
from enum import Enum
from datetime import datetime

class Language(str, Enum):
    """Language options for the conversation"""
    BANGLISH = "banglish"
    ENGLISH = "english"

class Message(BaseModel):
    """Represents a single message in the conversation"""
    role: Literal["user", "model"]
    text: str

class PartnerPersonality(BaseModel):
    """Defines the AI partner's personality traits"""
    archetype: str = Field(..., description="Core personality archetype (e.g., 'Caring Listener', 'Confident Teaser')")
    playful: int = Field(..., ge=0, le=100, description="Playfulness level (0-100)")
    talkative: int = Field(..., ge=0, le=100, description="Talkativeness level (0-100)")
    affectionate: int = Field(..., ge=0, le=100, description="Affection level (0-100)")

class Analysis(BaseModel):
    """Analysis results from the tutor"""
    score: int = Field(..., ge=0, le=100, description="Overall emotional intelligence score")
    personality: str = Field(..., description="User's personality as a lover")
    idealPartner: str = Field(..., description="Description of ideal partner match")
    tips: List[str] = Field(..., description="Actionable tips for improvement")

# Authentication Models
class UserSignUp(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User information response"""
    user_id: str
    email: str
    full_name: Optional[str] = None
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    """Authentication response with tokens"""
    access_token: str
    refresh_token: str
    user: UserResponse
    success: bool = True

class SessionMetadata(BaseModel):
    """Session metadata for user"""
    session_id: str
    user_id: str
    created_at: str
    message_count: int
    last_message_at: Optional[str] = None
    personality: Optional[PartnerPersonality] = None
    language: Language = Language.BANGLISH

# Request Models
class ChatRequest(BaseModel):
    """Request to send a message or initialize chat"""
    message: str
    personality: PartnerPersonality | None = None
    language: Language = Language.BANGLISH
    session_id: str | None = None  # Optional session ID for history tracking
    user_id: str | None = None  # User ID for authenticated requests

class AnalysisRequest(BaseModel):
    """Request to analyze a conversation"""
    messages: List[Message]
    language: Language = Language.BANGLISH

# Response Models
class ChatMessageResponse(BaseModel):
    """Response containing a chat message"""
    message: Message
    success: bool = True
    session_id: str | None = None  # Return session ID for tracking

class AnalysisResponse(Analysis):
    """Response containing the analysis results"""
    success: bool = True
