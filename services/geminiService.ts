// services/geminiService.ts
// ✔ FIXED VERSION — NO GOOGLE GENAI IN FRONTEND
// ✔ Uses ONLY backend endpoints
// ✔ Prevents API key exposure
// ✔ Fixes browser crash

import type { Message, Analysis, PartnerPersonality, Language } from "../types";
import { authenticatedFetch } from "./authService";

const API_BASE_URL = "http://localhost:8000";

// ------------------------------------------------------
// 1. Initialize Partner Chat (Backend handles system prompt, LLM, session)
// ------------------------------------------------------
export const initializePartnerChat = async (
    personality: PartnerPersonality,
    language: Language,
    sessionId?: string
): Promise<string> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "",
            personality,
            language: language.toLowerCase(),
            session_id: sessionId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            detail: "Failed to initialize chat",
        }));
        throw new Error(errorData.detail);
    }

    const data = await response.json();
    return data.session_id;
};

// ------------------------------------------------------
// 2. Send message → Backend returns AI partner response
// ------------------------------------------------------
export const getPartnerResponse = async (
    newMessage: string,
    sessionId: string
): Promise<string> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: newMessage,
            session_id: sessionId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            detail: "Failed to get partner response",
        }));
        throw new Error(errorData.detail);
    }

    const data = await response.json();
    return data.message.text;
};

// ------------------------------------------------------
// 3. Get Tutor Analysis (Backend generates ALL analysis)
// ------------------------------------------------------
export const getTutorAnalysis = async (
    history: Message[],
    language: Language
): Promise<Analysis> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/analysis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: history,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to get tutor analysis");
    }

    const data = await response.json();
    return data as Analysis;
};

// ------------------------------------------------------
// 4. Load Session History
// ------------------------------------------------------
export const loadChatHistory = async (sessionId: string): Promise<Message[]> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);

    if (!response.ok) {
        throw new Error("Failed to load chat history");
    }

    const data = await response.json();
    return data.messages || [];
};

// ------------------------------------------------------
// 5. Fetch Session History
// ------------------------------------------------------
export const getSessionHistory = async (sessionId: string): Promise<Message[]> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.messages || [];
};

// ------------------------------------------------------
// 6. Clear Session History
// ------------------------------------------------------
export const clearSessionHistory = async (sessionId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
            method: "DELETE",
        });
        return response.ok;
    } catch {
        return false;
    }
};
