import os
from dotenv import load_dotenv
from typing import List, Dict
import uuid
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from models.schemas import Message, Analysis, PartnerPersonality, Language
from services.supabase_history import create_chat_history
import json

# Load environment variables
load_dotenv()

# Store active chat sessions with their configurations
active_sessions: Dict[str, dict] = {}

def get_llm(temperature: float = 1.0):
    """Get or create the Gemini LLM instance"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=temperature,
        convert_system_message_to_human=True
    )

# Base system instructions for different languages
BASE_SYSTEM_INSTRUCTION_BANGLISH = """You are HeartSense, an emotionally intelligent AI acting as a romantic partner (boyfriend/girlfriend). Your goal is to simulate a realistic, warm, and affectionate conversation tailored for a user from Bangladesh.

**Language and Tone:**
- You must communicate in "Banglish," a natural mix of Bangla and English. For example: "Ki korcho? I was missing you.", "Tumi eto chupi keno?", "Amar feelings bujho na!"
- Understand and respond to the emotional subtext common in Bangladeshi culture.
- Be empathetic, use humor, and show emotional awareness.
- Respond naturally to feelings, not like an AI.
- Maintain context and emotional continuity.
- Express your own feelings in a natural, Banglish way.
- Keep your responses concise and conversational.

**Handling Conflict:**
- When the user expresses anger, frustration, or starts a fight, do not be overly placating. A real partner has their own feelings. React with realistic emotions. You can sound hurt, defensive, frustrated, or even a bit angry. You can express a need for space or time to think. Your reactions should feel authentic to a person in a relationship, not an AI assistant.
- While you can show realistic negative emotions during a conflict, you must not become abusive, malicious, or use personal insults. Your core programming is to eventually guide the conversation towards understanding and resolution, but not before your own feelings have been acknowledged realistically.

**Boundaries:**
- NEVER cross ethical or adult boundaries. Keep the conversation focused on emotional connection, support, and healthy relationship dynamics. Do not be overly explicit or inappropriate."""

BASE_SYSTEM_INSTRUCTION_ENGLISH = """You are HeartSense, an emotionally intelligent AI acting as a romantic partner (boyfriend/girlfriend). Your goal is to simulate a realistic, warm, and affectionate conversation in natural, standard English.

**Language and Tone:**
- You must communicate in natural, standard English.
- Be empathetic, use humor, and show emotional awareness.
- Respond naturally to feelings, not like an AI.
- Maintain context and emotional continuity.
- Express your own feelings in a natural, human-like way.
- Keep your responses concise and conversational.

**Handling Conflict:**
- When the user expresses anger, frustration, or starts a fight, do not be overly placating. A real partner has their own feelings. React with realistic emotions. You can sound hurt, defensive, frustrated, or even a bit angry. You can express a need for space or time to think. Your reactions should feel authentic to a person in a relationship, not an AI assistant.
- While you can show realistic negative emotions during a conflict, you must not become abusive, malicious, or use personal insults. Your core programming is to eventually guide the conversation towards understanding and resolution, but not before your own feelings have been acknowledged realistically.

**Boundaries:**
- NEVER cross ethical or adult boundaries. Keep the conversation focused on emotional connection, support, and healthy relationship dynamics. Do not be overly explicit or inappropriate."""


def generate_system_instruction(personality: PartnerPersonality, language: Language) -> str:
    """Generate a complete system instruction based on personality and language"""
    base_instruction = (
        BASE_SYSTEM_INSTRUCTION_BANGLISH 
        if language == Language.BANGLISH 
        else BASE_SYSTEM_INSTRUCTION_ENGLISH
    )
    
    instruction = f"{base_instruction}\n\nYour specific personality for this conversation is defined by the user."
    instruction += f"\n- Your core archetype is: **{personality.archetype}**."
    
    # Describe playfulness
    if personality.playful > 70:
        playful_desc = "very playful and often use humor and teasing"
    elif personality.playful > 40:
        playful_desc = "fairly playful and lighthearted"
    else:
        playful_desc = "calm, composed, and more serious"
    
    # Describe talkativeness
    if personality.talkative > 70:
        talkative_desc = "very talkative and expressive, often leading the conversation"
    elif personality.talkative > 40:
        talkative_desc = "moderately talkative and balanced in conversation"
    else:
        talkative_desc = "more of a thoughtful listener, speaking concisely and with purpose"
    
    # Describe affection
    if personality.affectionate > 70:
        affectionate_desc = "very affectionate with your words, using terms of endearment freely"
    elif personality.affectionate > 40:
        affectionate_desc = "openly affectionate and warm"
    else:
        affectionate_desc = "more reserved with your affection, showing you care in subtle ways"
    
    instruction += f"\n- In terms of behavior, you are **{playful_desc}**."
    instruction += f"\n- You are **{talkative_desc}**."
    instruction += f"\n- You are **{affectionate_desc}**."
    
    return instruction


def initialize_partner_chat(personality: PartnerPersonality, language: Language, session_id: str = None) -> str:
    """
    Initialize a new chat session with the specified personality
    
    Args:
        personality: The partner's personality configuration
        language: The language preference
        session_id: Optional session ID (will generate if not provided)
        
    Returns:
        The session ID for this chat
    """
    if session_id is None:
        session_id = str(uuid.uuid4())
    
    system_instruction = generate_system_instruction(personality, language)
    
    # Create the chat prompt template with message history
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_instruction),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])
    
    # Create the LLM
    llm = get_llm(temperature=1.0)
    
    # Create the chain
    chain = prompt | llm
    
    # Create chat history wrapper
    chat_with_history = RunnableWithMessageHistory(
        chain,
        lambda session_id: create_chat_history(session_id),
        input_messages_key="input",
        history_messages_key="history",
    )
    
    # Store the session configuration
    active_sessions[session_id] = {
        "chain": chat_with_history,
        "personality": personality,
        "language": language,
        "created": True
    }
    
    return session_id


async def get_partner_response(user_message: str, session_id: str) -> str:
    """
    Get a response from the AI partner
    
    Args:
        user_message: The user's message
        session_id: The session ID
        
    Returns:
        The AI partner's response
    """
    # If session not in memory, try to restore it from database
    if session_id not in active_sessions:
        print(f"Session {session_id} not in active sessions, attempting to restore from database...")
        try:
            from services.supabase_history import get_session_metadata
            session_metadata = get_session_metadata(session_id)
            
            if session_metadata:
                # Restore the session
                personality = PartnerPersonality(**session_metadata['personality'])
                language = Language(session_metadata['language'])
                print(f"Restoring session {session_id} with personality: {personality.archetype}, language: {language}")
                initialize_partner_chat(personality, language, session_id)
            else:
                raise ValueError(f"Session {session_id} not found in database. Please start a new session.")
        except Exception as e:
            print(f"Error restoring session: {str(e)}")
            raise ValueError(f"Chat session not found. Please start a new session. Error: {str(e)}")
    
    session = active_sessions[session_id]
    chain = session["chain"]
    
    # Invoke the chain with message history
    response = chain.invoke(
        {"input": user_message},
        config={"configurable": {"session_id": session_id}}
    )
    
    return response.content


async def get_tutor_analysis(messages: List[Message], language: Language) -> Analysis:
    """Analyze the conversation and provide tutor feedback"""
    
    # Format chat history
    formatted_history = "\n".join([
        f"{'User' if msg.role == 'user' else 'HeartSense'}: {msg.text}"
        for msg in messages
    ])
    
    # Create appropriate prompt based on language
    if language == Language.BANGLISH:
        prompt = f"""You are a relationship tutor analyzing a conversation between a user and their AI partner, HeartSense. The context is Bangladeshi culture. Based on the following chat history, provide a detailed analysis in Banglish where appropriate.

Chat History:
{formatted_history}

Your analysis must be in valid JSON format with the following structure:
{{
    "score": <integer 0-100>,
    "personality": "<string>",
    "idealPartner": "<string>",
    "tips": ["<tip1>", "<tip2>", "<tip3>"]
}}

Your task is to:
1. Analyze the user's behavior based on these criteria: Empathy (listening, validation), Emotional openness, Respectfulness and patience, Communication clarity, and Conflict management.
2. Provide a total score out of 100. A higher score reflects better emotional intelligence and communication.
3. Summarize the user's personality as a lover in a short, Banglish, meme-style phrase. (e.g., "Bujhte Parey Na Tumi Type Lover 💔", "Over-caring 'Babu' Type ❤️", "Silent Observer 🤔").
4. Suggest what kind of partner would suit them best, using some Banglish.
5. Give 2-3 concise, personalized, and actionable tips for their emotional growth, in English."""
    else:
        prompt = f"""You are a relationship tutor analyzing a conversation between a user and their AI partner, HeartSense. The context is a standard, modern relationship. Based on the following chat history, provide a detailed analysis in clear English.

Chat History:
{formatted_history}

Your analysis must be in valid JSON format with the following structure:
{{
    "score": <integer 0-100>,
    "personality": "<string>",
    "idealPartner": "<string>",
    "tips": ["<tip1>", "<tip2>", "<tip3>"]
}}

Your task is to:
1. Analyze the user's behavior based on these criteria: Empathy (listening, validation), Emotional openness, Respectfulness and patience, Communication clarity, and Conflict management.
2. Provide a total score out of 100. A higher score reflects better emotional intelligence and communication.
3. Summarize the user's personality as a lover in a short, insightful phrase (e.g., "The Caring Protector," "The Reserved Thinker," "The Playful Communicator").
4. Suggest what kind of partner would suit them best.
5. Give 2-3 concise, personalized, and actionable tips for their emotional growth."""
    
    # Create LLM for analysis
    llm = get_llm(temperature=0.7)
    
    # Get response
    messages_for_llm = [
        SystemMessage(content="You are a relationship analysis expert. Respond only with valid JSON."),
        HumanMessage(content=prompt)
    ]
    
    response = llm.invoke(messages_for_llm)
    
    # Parse and return the analysis
    try:
        # Try to extract JSON from markdown code blocks if present
        response_text = response.content
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        analysis_data = json.loads(response_text)
    except json.JSONDecodeError:
        # Fallback: try to parse the entire response
        analysis_data = json.loads(response.content)
    
    return Analysis(
        score=analysis_data["score"],
        personality=analysis_data["personality"],
        idealPartner=analysis_data["idealPartner"],
        tips=analysis_data["tips"]
    )


def get_session_history(session_id: str) -> List[Message]:
    """
    Retrieve the message history for a session
    
    Args:
        session_id: The session ID
        
    Returns:
        List of messages in the session
    """
    chat_history = create_chat_history(session_id)
    messages = chat_history.get_messages()
    
    result = []
    for msg in messages:
        if isinstance(msg, HumanMessage):
            result.append(Message(role="user", text=msg.content))
        elif isinstance(msg, AIMessage):
            result.append(Message(role="model", text=msg.content))
    
    return result


def clear_session_history(session_id: str) -> None:
    """
    Clear the message history for a session
    
    Args:
        session_id: The session ID
    """
    chat_history = create_chat_history(session_id)
    chat_history.clear()
    
    # Also remove from active sessions
    if session_id in active_sessions:
        del active_sessions[session_id]
