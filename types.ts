export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Analysis {
  score: number;
  personality: string;
  idealPartner: string;
  tips: string[];
}

export interface PartnerPersonality {
  archetype: string;
  playful: number; // 0-100: Calm -> Playful
  talkative: number; // 0-100: Thoughtful -> Talkative
  affectionate: number; // 0-100: Reserved -> Affectionate
}

export type Language = 'banglish' | 'english';

export type View = 'landing' | 'auth' | 'partner-setup' | 'chatting' | 'tutor' | 'sessions';

// Authentication types
export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  success: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Session types
export interface ChatSession {
  id?: number;
  session_id: string;
  user_id: string;
  personality?: PartnerPersonality;
  language: Language;
  message_count: number;
  created_at: string;
  last_message_at?: string;
}

export interface SessionListResponse {
  user_id: string;
  session_count: number;
  sessions: ChatSession[];
  success: boolean;
}

export interface ChatMessageResponse {
  message: Message;
  session_id: string;
  success: boolean;
}

