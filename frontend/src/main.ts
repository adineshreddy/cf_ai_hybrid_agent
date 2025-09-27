import { ChatRequest, ChatResponse, AppConfig } from './types';

// Configuration
const CONFIG: AppConfig = {
  apiUrl: 'http://localhost:8787/api/chat', // Backend running on port 8787
  speechRecognitionLang: 'en-US',
  maxMessageLength: 1000
};

class HybridAgent {
  private sessionId: string;
  private recognition: any | null = null; // SpeechRecognition interface
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private isConnected: boolean = false;
  
  // DOM elements
  private messagesContainer!: HTMLElement;
  private messageInput!: HTMLInputElement;
  private sendButton!: HTMLButtonElement;
  private voiceButton!: HTMLButtonElement;
  private statusDot!: HTMLElement;
  private statusText!: HTMLElement;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeElements();
    this.setupEventListeners();
    this.setupSpeechRecognition();
    this.setupSpeechSynthesis();
    this.checkConnection();
    
    // Retry connection check every 10 seconds if offline
    setInterval(() => {
      if (!this.isConnected) {
        this.checkConnection();
      }
    }, 10000);
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private initializeElements(): void {
    this.messagesContainer = document.getElementById('messages')!;
    this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
    this.sendButton = document.getElementById('sendButton') as HTMLButtonElement;
    this.voiceButton = document.getElementById('voiceButton') as HTMLButtonElement;
    this.statusDot = document.getElementById('status-dot')!;
    this.statusText = document.getElementById('status-text')!;
  }

  private setupEventListeners(): void {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.messageInput.addEventListener('input', () => {
      this.updateSendButton();
    });

    this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
  }

  private setupSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = CONFIG.speechRecognitionLang;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.voiceButton.classList.add('listening');
        this.voiceButton.title = 'Listening... Click to stop';
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.messageInput.value = transcript;
        this.updateSendButton();
        this.sendMessage();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.voiceButton.classList.remove('listening');
        this.voiceButton.title = 'Voice input';
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.voiceButton.classList.remove('listening');
        this.addMessage('Sorry, I couldn\'t hear you clearly. Please try again.', 'assistant');
      };
    } else {
      // Hide voice button if not supported
      this.voiceButton.style.display = 'none';
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private setupSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private async checkConnection(): Promise<void> {
    try {
      const healthUrl = CONFIG.apiUrl.replace('/chat', '/health');
      console.log('Checking connection to:', healthUrl);
      
      const response = await fetch(healthUrl);
      console.log('Health check response:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check data:', data);
        this.updateConnectionStatus(true);
      } else {
        console.warn('Health check failed with status:', response.status);
        this.updateConnectionStatus(false);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      this.updateConnectionStatus(false);
    }
  }

  private updateConnectionStatus(connected: boolean): void {
    this.isConnected = connected;
    this.statusDot.className = `status-dot ${connected ? 'connected' : 'error'}`;
    this.statusText.textContent = connected ? 'Connected' : 'Offline Mode';
    this.updateSendButton();
    
    if (connected) {
      console.log('✅ Connected to AI backend');
    } else {
      console.log('❌ Offline - backend not available');
    }
  }

  private updateSendButton(): void {
    const hasText = this.messageInput.value.trim().length > 0;
    this.sendButton.disabled = !hasText || !this.isConnected;
  }

  private toggleVoiceInput(): void {
    if (!this.recognition) return;

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  private async sendMessage(): Promise<void> {
    const message = this.messageInput.value.trim();
    if (!message) return;

    // Validate message length
    if (message.length > CONFIG.maxMessageLength) {
      this.addMessage(`Message too long. Please keep it under ${CONFIG.maxMessageLength} characters.`, 'assistant');
      return;
    }

    this.addMessage(message, 'user');
    this.messageInput.value = '';
    this.updateSendButton();
    
    // Show typing indicator
    const typingId = this.addMessage('Thinking...', 'assistant', true);

    try {
      const requestData: ChatRequest = {
        message,
        sessionId: this.sessionId,
        type: 'text'
      };

      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      
      // Remove typing indicator
      this.removeMessage(typingId);
      
      if (data.response) {
        this.addMessage(data.response, 'assistant');
        
        // Optional: Speak the response
        if (this.synthesis && data.response.length < 500) {
          this.speakText(data.response);
        }
      } else {
        this.addMessage('I apologize, but I couldn\'t generate a response. Please try again.', 'assistant');
      }

      this.updateConnectionStatus(true);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator
      this.removeMessage(typingId);
      
      this.addMessage('Sorry, I\'m having trouble connecting right now. Please check your connection and try again.', 'assistant');
      this.updateConnectionStatus(false);
    }
  }

  private addMessage(content: string, role: 'user' | 'assistant', isTemporary: boolean = false): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.id = messageId;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isTemporary) {
      contentDiv.classList.add('loading');
    }
    
    contentDiv.textContent = content;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = this.formatTime(new Date());
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    return messageId;
  }

  private removeMessage(messageId: string): void {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.remove();
    }
  }

  private speakText(text: string): void {
    if (!this.synthesis) return;
    
    // Stop any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    this.synthesis.speak(utterance);
  }

  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new HybridAgent();
  console.log('🤖 AI Hybrid Agent initialized');
});