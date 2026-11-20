export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

export interface AnalysisBreakdown {
  empathy: number;
  openness: number;
  respect: number;
  conflict: number;
}

export interface Analysis {
  score: number;
  personality: string;
  idealPartner: string;
  tips: string[];
  breakdown?: AnalysisBreakdown;
}

export interface PartnerPersonality {
  archetype: string;
  playful: number; // 0-100: Calm -> Playful
  talkative: number; // 0-100: Thoughtful -> Talkative
  affectionate: number; // 0-100: Reserved -> Affectionate
  partnerName?: string;
  scenario?: string;
  avatar?: string;
}

export type Language = 'banglish' | 'english';

export type View = 'landing' | 'partner-setup' | 'chatting' | 'tutor';
