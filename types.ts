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

export type View = 'landing' | 'partner-setup' | 'chatting' | 'tutor';
