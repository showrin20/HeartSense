import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { Message, Analysis, PartnerPersonality, Language } from '../types';

const MODEL_FALLBACKS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'] as const;
const API_KEY_STORAGE_KEY = 'heartsense_gemini_api_key';

// Collect all unique configured API keys for automatic failover
const getApiKeyPool = (): string[] => {
    const candidates: string[] = [];

    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (stored && stored.trim()) candidates.push(stored.trim());
    }

    const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
    if (metaEnv) {
        [
            metaEnv.VITE_GEMINI_API_KEY,
            metaEnv.GEMINI_API_KEY,
            metaEnv.GEMINI_API_KEY_1,
            metaEnv.GEMINI_API_KEY_2,
            metaEnv.GEMINI_API_KEY_3,
        ].forEach((k) => {
            if (k && k.trim()) candidates.push(k.trim());
        });
    }

    // Vite statically replaces process.env.* at build time via `define` even though `process` is undefined in the browser.
    try {
        [
            process.env.API_KEY,
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_1,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3,
        ].forEach((k) => {
            if (k && k.trim()) candidates.push(k.trim());
        });
    } catch {
        // Ignore if `process` is not defined outside Vite
    }

    return Array.from(new Set(candidates));
};

export const getActiveApiKey = (): string => {
    const pool = getApiKeyPool();
    return pool[0] || '';
};

export const saveApiKey = (key: string): void => {
    if (typeof window !== 'undefined') {
        if (key && key.trim().length > 0) {
            localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
        } else {
            localStorage.removeItem(API_KEY_STORAGE_KEY);
        }
    }
};

export const isApiKeySet = (): boolean => {
    return getApiKeyPool().length > 0;
};

export const isDemoModeActive = (): boolean => false;
export const setDemoMode = (_enabled: boolean): void => {};

export const testApiKey = async (candidateKey: string): Promise<{ success: boolean; message: string }> => {
    const testClient = new GoogleGenAI({ apiKey: candidateKey.trim() });
    let lastError = 'Invalid API key or network error.';
    for (const model of MODEL_FALLBACKS) {
        try {
            const res = await testClient.models.generateContent({
                model,
                contents: 'Hello',
            });
            if (res && res.text) {
                return { success: true, message: `API key is valid and connected to ${model}!` };
            }
        } catch (err: unknown) {
            lastError = err instanceof Error ? err.message : String(err);
        }
    }
    return { success: false, message: lastError };
};

// DO NOT CHANGE PROMPTING: Exactly preserved from original code
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
};

let chat: Chat | null = null;
let currentKeyIndex = 0;
let currentModelIndex = 0;
let currentSystemInstruction = '';
let conversationHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

const createChatWithKey = (
    apiKey: string,
    model: string,
    systemInstruction: string,
    history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
): Chat => {
    const ai = new GoogleGenAI({ apiKey });
    return ai.chats.create({
        model,
        history,
        config: {
            systemInstruction,
        },
    });
};

export const initializePartnerChat = (personality: PartnerPersonality, language: Language) => {
    const keys = getApiKeyPool();
    if (keys.length === 0) {
        throw new Error("GEMINI_API_KEY is not configured in .env.");
    }

    currentKeyIndex = 0;
    currentModelIndex = 0;
    currentSystemInstruction = generateSystemInstruction(personality, language);
    conversationHistory = [];
    chat = createChatWithKey(keys[currentKeyIndex], MODEL_FALLBACKS[currentModelIndex], currentSystemInstruction);
};

export const getPartnerResponse = async (newMessage: string): Promise<string> => {
    const keys = getApiKeyPool();
    if (keys.length === 0) {
        throw new Error("GEMINI_API_KEY is not configured in .env.");
    }
    if (!chat) {
        throw new Error("Chat not initialized. Please select a partner personality first.");
    }

    let lastError: unknown = null;
    let isFirstTry = true;

    for (let mOffset = 0; mOffset < MODEL_FALLBACKS.length; mOffset++) {
        const modelIdx = (currentModelIndex + mOffset) % MODEL_FALLBACKS.length;
        const model = MODEL_FALLBACKS[modelIdx];

        for (let kOffset = 0; kOffset < keys.length; kOffset++) {
            const keyIdx = (currentKeyIndex + kOffset) % keys.length;
            try {
                if (!isFirstTry) {
                    chat = createChatWithKey(keys[keyIdx], model, currentSystemInstruction, conversationHistory);
                }
                isFirstTry = false;
                const response = await chat.sendMessage({ message: newMessage });
                const replyText = response.text;
                if (!replyText) {
                    throw new Error("Empty response received from Gemini.");
                }
                currentKeyIndex = keyIdx;
                currentModelIndex = modelIdx;
                conversationHistory.push(
                    { role: 'user', parts: [{ text: newMessage }] },
                    { role: 'model', parts: [{ text: replyText }] }
                );
                return replyText;
            } catch (error) {
                console.error(`Gemini chat error (${model}, key #${keyIdx + 1}):`, error);
                lastError = error;
            }
        }
    }

    throw lastError || new Error("Failed to get response from Gemini.");
};

export const getTutorAnalysis = async (history: Message[], language: Language): Promise<Analysis> => {
    const formattedChatHistory = history
        .map(msg => `${msg.role === 'user' ? 'User' : 'HeartSense'}: ${msg.text}`)
        .join('\n');
    
    // DO NOT CHANGE PROMPTING: Exactly preserved from original code
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
    const keys = getApiKeyPool();

    if (keys.length === 0) {
        throw new Error("GEMINI_API_KEY is not configured in .env.");
    }

    let lastError: unknown = null;

    for (let mOffset = 0; mOffset < MODEL_FALLBACKS.length; mOffset++) {
        const modelIdx = (currentModelIndex + mOffset) % MODEL_FALLBACKS.length;
        const model = MODEL_FALLBACKS[modelIdx];

        for (let kOffset = 0; kOffset < keys.length; kOffset++) {
            const keyIdx = (currentKeyIndex + kOffset) % keys.length;
            try {
                const ai = new GoogleGenAI({ apiKey: keys[keyIdx] });
                const response = await ai.models.generateContent({
                    model,
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

                let jsonText = (response.text || "").trim();
                jsonText = jsonText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
                const parsedAnalysis = JSON.parse(jsonText) as Analysis;
                chat = null;
                conversationHistory = [];
                currentKeyIndex = keyIdx;
                currentModelIndex = modelIdx;

                parsedAnalysis.breakdown = {
                    empathy: Math.min(100, Math.max(30, Math.round(parsedAnalysis.score * 0.95))),
                    openness: Math.min(100, Math.max(30, Math.round(parsedAnalysis.score * 0.9 + 5))),
                    respect: Math.min(100, Math.max(30, Math.round(parsedAnalysis.score * 1.05 - 2))),
                    conflict: Math.min(100, Math.max(30, Math.round(parsedAnalysis.score * 0.85 + 8)))
                };

                return parsedAnalysis;
            } catch (error) {
                console.error(`Error generating tutor analysis (${model}, key #${keyIdx + 1}):`, error);
                lastError = error;
            }
        }
    }

    chat = null;
    conversationHistory = [];
    throw lastError || new Error("Could not generate tutor analysis.");
};
