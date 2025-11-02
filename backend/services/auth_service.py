import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from supabase import create_client, Client
from dotenv import load_dotenv
from models.schemas import UserResponse

load_dotenv()

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://auqhuozialxppjnpuioa.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def get_supabase_client() -> Client:
    """Get Supabase client for authentication"""
    if not SUPABASE_KEY:
        raise ValueError("SUPABASE_KEY environment variable is not set")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


async def sign_up_user(email: str, password: str, full_name: Optional[str] = None) -> dict:
    """
    Sign up a new user using Supabase Auth
    
    Args:
        email: User's email address
        password: User's password (min 6 characters)
        full_name: Optional full name
        
    Returns:
        dict with access_token, refresh_token, and user info
    """
    try:
        supabase = get_supabase_client()
        
        # Sign up with Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": full_name
                }
            }
        })
        
        if not response.user:
            raise ValueError("Failed to create user")
        
        # Create custom JWT tokens for our API
        access_token = create_access_token(data={"sub": response.user.id, "email": email})
        refresh_token = create_refresh_token(data={"sub": response.user.id, "email": email})
        
        user_response = UserResponse(
            user_id=response.user.id,
            email=response.user.email,
            full_name=response.user.user_metadata.get("full_name") if response.user.user_metadata else None,
            created_at=str(response.user.created_at) if hasattr(response.user, 'created_at') and response.user.created_at else None
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user_response,
            "supabase_session": response.session
        }
        
    except Exception as e:
        raise ValueError(f"Sign up failed: {str(e)}")


async def sign_in_user(email: str, password: str) -> dict:
    """
    Sign in an existing user using Supabase Auth
    
    Args:
        email: User's email address
        password: User's password
        
    Returns:
        dict with access_token, refresh_token, and user info
    """
    try:
        supabase = get_supabase_client()
        
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not response.user:
            raise ValueError("Invalid credentials")
        
        # Create custom JWT tokens for our API
        access_token = create_access_token(data={"sub": response.user.id, "email": email})
        refresh_token = create_refresh_token(data={"sub": response.user.id, "email": email})
        
        user_response = UserResponse(
            user_id=response.user.id,
            email=response.user.email,
            full_name=response.user.user_metadata.get("full_name") if response.user.user_metadata else None,
            created_at=str(response.user.created_at) if hasattr(response.user, 'created_at') and response.user.created_at else None
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user_response,
            "supabase_session": response.session
        }
        
    except Exception as e:
        raise ValueError(f"Sign in failed: {str(e)}")


async def sign_out_user(access_token: str) -> bool:
    """
    Sign out a user
    
    Args:
        access_token: User's access token
        
    Returns:
        bool indicating success
    """
    try:
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        return True
    except Exception as e:
        raise ValueError(f"Sign out failed: {str(e)}")


async def get_current_user(token: str) -> Optional[UserResponse]:
    """
    Get current user from token
    
    Args:
        token: JWT access token
        
    Returns:
        UserResponse or None
    """
    payload = verify_token(token)
    if not payload:
        return None
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    if not user_id or not email:
        return None
    
    try:
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        
        if user:
            return UserResponse(
                user_id=user.user.id,
                email=user.user.email,
                full_name=user.user.user_metadata.get("full_name") if user.user.user_metadata else None,
                created_at=str(user.user.created_at) if hasattr(user.user, 'created_at') and user.user.created_at else None
            )
    except:
        pass
    
    # Fallback to token data
    return UserResponse(
        user_id=user_id,
        email=email,
        full_name=None,
        created_at=None
    )


async def refresh_access_token(refresh_token: str) -> dict:
    """
    Refresh access token using refresh token
    
    Args:
        refresh_token: JWT refresh token
        
    Returns:
        dict with new access_token
    """
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise ValueError("Invalid refresh token")
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    if not user_id or not email:
        raise ValueError("Invalid token payload")
    
    # Create new access token
    access_token = create_access_token(data={"sub": user_id, "email": email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
