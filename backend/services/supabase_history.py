import os
from typing import List
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://auqhuozialxppjnpuioa.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# PostgreSQL connection string for Supabase
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_DB_URL = os.environ.get("SUPABASE_DB_URL")

supabase_client: Client = None

def get_supabase_client() -> Client:
    """Get or create Supabase client"""
    global supabase_client
    if supabase_client is None:
        if not SUPABASE_KEY:
            raise ValueError("SUPABASE_KEY environment variable is not set")
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase_client


class SupabaseChatMessageHistory:
    """Chat message history stored in Supabase using LangChain's SQL history"""
    
    def __init__(self, session_id: str, connection_string: str = None):
        """
        Initialize Supabase chat message history
        
        Args:
            session_id: Unique identifier for the chat session
            connection_string: PostgreSQL connection string for Supabase
        """
        self.session_id = session_id
        
        # Use provided connection string or get from environment
        conn_string = connection_string or SUPABASE_DB_URL
        if not conn_string:
            raise ValueError(
                "SUPABASE_DB_URL environment variable is not set. "
                "Please set it with format: "
                "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
            )
        
        # Initialize SQL-based chat history (using 'connection' instead of deprecated 'connection_string')
        self.history = SQLChatMessageHistory(
            session_id=session_id,
            connection=conn_string,
            table_name="message_history"  # Custom table name
        )
    
    def add_user_message(self, message: str) -> None:
        """Add a user message to the history"""
        self.history.add_user_message(message)
    
    def add_ai_message(self, message: str) -> None:
        """Add an AI message to the history"""
        self.history.add_ai_message(message)
    
    def get_messages(self) -> List[BaseMessage]:
        """Retrieve all messages for this session"""
        return self.history.messages
    
    @property
    def messages(self) -> List[BaseMessage]:
        """Property to access messages directly (for compatibility)"""
        return self.history.messages
    
    def clear(self) -> None:
        """Clear all messages for this session"""
        self.history.clear()
    
    def get_message_count(self) -> int:
        """Get the number of messages in this session"""
        return len(self.history.messages)


def create_chat_history(session_id: str) -> SupabaseChatMessageHistory:
    """
    Factory function to create a new chat history instance
    
    Args:
        session_id: Unique identifier for the chat session
        
    Returns:
        SupabaseChatMessageHistory instance
    """
    return SupabaseChatMessageHistory(session_id=session_id)


def get_user_sessions(user_id: str) -> List[dict]:
    """
    Get all chat sessions for a specific user
    
    Args:
        user_id: The user's ID
        
    Returns:
        List of session metadata dictionaries
    """
    try:
        supabase = get_supabase_client()
        
        # Query sessions table for user
        response = supabase.table("user_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching user sessions: {e}")
        return []


def get_session_metadata(session_id: str) -> dict:
    """
    Get metadata for a specific session
    
    Args:
        session_id: The session ID
        
    Returns:
        Session metadata dictionary or None if not found
    """
    try:
        supabase = get_supabase_client()
        
        # Query sessions table for session
        response = supabase.table("user_sessions").select("*").eq("session_id", session_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching session metadata: {e}")
        return None


def create_user_session(user_id: str, session_id: str, personality: dict = None, language: str = "banglish") -> dict:
    """
    Create a new session entry for a user
    
    Args:
        user_id: The user's ID
        session_id: Unique session identifier
        personality: Optional personality configuration
        language: Language preference
        
    Returns:
        Session metadata dictionary
    """
    try:
        supabase = get_supabase_client()
        
        session_data = {
            "user_id": user_id,
            "session_id": session_id,
            "personality": personality,
            "language": language,
            "message_count": 0
        }
        
        response = supabase.table("user_sessions").insert(session_data).execute()
        return response.data[0] if response.data else session_data
    except Exception as e:
        print(f"Error creating user session: {e}")
        return {"user_id": user_id, "session_id": session_id, "error": str(e)}


def update_session_message_count(session_id: str, user_id: str) -> None:
    """
    Update the message count and last_message_at for a session
    
    Args:
        session_id: The session ID
        user_id: The user's ID
    """
    try:
        supabase = get_supabase_client()
        
        # Get current message count from message_history
        history = create_chat_history(session_id)
        message_count = history.get_message_count()
        
        # Update user_sessions table
        supabase.table("user_sessions").update({
            "message_count": message_count,
            "last_message_at": "now()"
        }).eq("session_id", session_id).eq("user_id", user_id).execute()
    except Exception as e:
        print(f"Error updating session message count: {e}")


def delete_user_session(session_id: str, user_id: str) -> bool:
    """
    Delete a session and its history for a user
    
    Args:
        session_id: The session ID to delete
        user_id: The user's ID
        
    Returns:
        bool indicating success
    """
    try:
        supabase = get_supabase_client()
        
        # Delete from user_sessions
        supabase.table("user_sessions").delete().eq("session_id", session_id).eq("user_id", user_id).execute()
        
        # Clear message history
        history = create_chat_history(session_id)
        history.clear()
        
        return True
    except Exception as e:
        print(f"Error deleting user session: {e}")
        return False

