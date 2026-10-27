export interface Milestone {
  id: string;
  title: string;
  dateOrEra: string;
  category: 'past' | 'present' | 'future' | 'forever';
  description: string;
  emotionalQuote: string;
  isUnlocked: boolean;
  userMemory?: string;
  iconType: 'heart' | 'ring' | 'cake' | 'home' | 'plane' | 'star' | 'infinity';
}

export interface ConversationPrompt {
  id: string;
  yashPrompt: string;
  context: string;
  suggestedAnswers: string[];
  category: 'cute' | 'deep' | 'future' | 'mischief';
}

export interface LoveVow {
  id: number;
  vowHindi: string;
  vowEnglish: string;
  isAgreed: boolean;
}

export interface TelegramActivity {
  id: string;
  timestamp: string;
  eventType: string;
  message: string;
  status: 'sent' | 'simulated' | 'failed';
  details?: string;
}

export interface TelegramConfigState {
  chat_id: string;
  hasToken: boolean;
  isDemo: boolean;
  bot_token_preview: string;
}
