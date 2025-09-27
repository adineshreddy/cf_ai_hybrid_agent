export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  type?: 'text' | 'voice';
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  timestamp: number;
}

export interface AppConfig {
  apiUrl: string;
  speechRecognitionLang: string;
  maxMessageLength: number;
}