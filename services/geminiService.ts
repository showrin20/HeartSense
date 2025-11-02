import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { Message, Analysis, PartnerPersonality, Language } from '../types';
import { authenticatedFetch } from './authService';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const baseSystemInstructionBanglish = `You are HeartSense, an emotionally intelligent AI acting as a romantic partner (boyfriend/girlfriend). Your goal is to simulate a realistic, warm, and affectionate conversation tailored for a user from Bangladesh.

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
- NEVER cross ethical or adult boundaries. Keep the conversation focused on emotional connection, support, and healthy relationship dynamics. Do not be overly explicit or inappropriate.`;

const baseSystemInstructionEnglish = `You are HeartSense, an emotionally intelligent AI acting as a romantic partner (boyfriend/girlfriend). Your goal is to simulate a realistic, warm, and affectionate conversation in natural, standard English.

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
- NEVER cross ethical or adult boundaries. Keep the conversation focused on emotional connection, support, and healthy relationship dynamics. Do not be overly explicit or inappropriate.`;


const generateSystemInstruction = (personality: PartnerPersonality, language: Language): string => {
    const baseInstruction = language === 'banglish' ? baseSystemInstructionBanglish : baseSystemInstructionEnglish;
    let instruction = `${baseInstruction}\n\nYour specific personality for this conversation is defined by the user.`;
    instruction += `\n- Your core archetype is: **${personality.archetype}**.`;

    const playfulDesc = personality.playful > 70 ? "very playful and often use humor and teasing" : personality.playful > 40 ? "fairly playful and lighthearted" : "calm, composed, and more serious";
    const talkativeDesc = personality.talkative > 70 ? "very talkative and expressive, often leading the conversation" : personality.talkative > 40 ? "moderately talkative and balanced in conversation" : "more of a thoughtful listener, speaking concisely and with purpose";
    const affectionateDesc = personality.affectionate > 70 ? "very affectionate with your words, using terms of endearment freely" : personality.affectionate > 40 ? "openly affectionate and warm" : "more reserved with your affection, showing you care in subtle ways";

    instruction += `\n- In terms of behavior, you are **${playfulDesc}**.`;
    instruction += `\n- You are **${talkativeDesc}**.`;
    instruction += `\n- You are **${affectionateDesc}**.`;
    
    return instruction;
}


let chat: Chat | null = null;
const API_BASE_URL = 'http://localhost:8000';

export const initializePartnerChat = async (personality: PartnerPersonality, language: Language, sessionId?: string): Promise<string> => {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '',  // Empty message for initialization
                personality: personality,
                language: language.toLowerCase(),  // Ensure lowercase
                session_id: sessionId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to initialize chat' }));
            console.error('Initialize chat error:', errorData);
            throw new Error(errorData.detail || 'Failed to initialize chat');
        }

        const data = await response.json();
        return data.session_id;
    } catch (error) {
        console.error('Initialize chat error:', error);
        throw error;
    }
};

export const getPartnerResponse = async (newMessage: string, sessionId: string): Promise<string> => {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: newMessage,
                session_id: sessionId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to get response' }));
            console.error('Get partner response error:', errorData);
            throw new Error(errorData.detail || 'Failed to get response');
        }

        const data = await response.json();
        return data.message.text;
    } catch (error) {
        console.error('Get partner response error:', error);
        throw error;
    }
};

export const getTutorAnalysis = async (history: Message[], language: Language): Promise<Analysis> => {
    const formattedChatHistory = history
        .map(msg => `${msg.role === 'user' ? 'User' : 'HeartSense'}: ${msg.text}`)
        .join('\n');
    
    const banglishPrompt = `You are a relationship tutor analyzing a conversation between a user and their AI partner, HeartSense. The context is Bangladeshi culture. Based on the following chat history, provide a detailed analysis in Banglish where appropriate.

    Chat History:
    ${formattedChatHistory}
    
    Your analysis must be in the specified JSON format.
    
    Your task is to:
    1. Analyze the user's behavior based on these criteria: Empathy (listening, validation), Emotional openness, Respectfulness and patience, Communication clarity, and Conflict management.
    2. Provide a total score out of 100. A higher score reflects better emotional intelligence and communication.
    3. Summarize the user's personality as a lover in a short, Banglish, meme-style phrase. (e.g., "Bujhte Parey Na Tumi Type Lover 💔", "Over-caring 'Babu' Type ❤️", "Silent Observer 🤔").
    4. Suggest what kind of partner would suit them best, using some Banglish.
    5. Give 2-3 concise, personalized, and actionable tips for their emotional growth, in English.`;

    const englishPrompt = `You are a relationship tutor analyzing a conversation between a user and their AI partner, HeartSense. The context is a standard, modern relationship. Based on the following chat history, provide a detailed analysis in clear English.

    Chat History:
    ${formattedChatHistory}

    Your analysis must be in the specified JSON format.
    
    Your task is to:
    1. Analyze the user's behavior based on these criteria: Empathy (listening, validation), Emotional openness, Respectfulness and patience, Communication clarity, and Conflict management.
    2. Provide a total score out of 100. A higher score reflects better emotional intelligence and communication.
    3. Summarize the user's personality as a lover in a short, insightful phrase (e.g., "The Caring Protector," "The Reserved Thinker," "The Playful Communicator").
    4. Suggest what kind of partner would suit them best.
    5. Give 2-3 concise, personalized, and actionable tips for their emotional growth.`;

    const tutorPrompt = language === 'banglish' ? banglishPrompt : englishPrompt;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: tutorPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.OBJECT,
             properties: {
               score: {
                 type: Type.INTEGER,
                 description: 'A score out of 100 for the user\'s emotional intelligence.',
               },
               personality: {
                 type: Type.STRING,
                 description: language === 'banglish' 
                   ? 'A Banglish, meme-style summary of the user\'s lover personality type.'
                   : 'An insightful summary of the user\'s lover personality type in English.',
               },
               idealPartner: {
                 type: Type.STRING,
                 description: 'A description of the ideal partner for the user.',
               },
               tips: {
                 type: Type.ARRAY,
                 items: {
                   type: Type.STRING,
                 },
                 description: 'Actionable tips for the user\'s emotional growth, in English.',
               },
             },
             required: ["score", "personality", "idealPartner", "tips"],
           },
        },
     });

    try {
        const jsonText = response.text.trim();
        const parsedAnalysis = JSON.parse(jsonText) as Analysis;
        chat = null; 
        return parsedAnalysis;
    } catch (error) {
        console.error("Error parsing tutor analysis JSON:", error);
        chat = null;
        return {
            score: 0,
            personality: "Analysis Error",
            idealPartner: "Could not generate analysis.",
            tips: ["There was an error analyzing the conversation. Please try again."]
        };
    }
};

export const getSessionHistory = async (sessionId: string): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to get session history');
        }

        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        console.error('Get session history error:', error);
        return [];
    }
};

export const clearSessionHistory = async (sessionId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error('Clear session history error:', error);
        return false;
    }
};
