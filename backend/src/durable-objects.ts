import { Env, ChatMessage } from './types';

export class ChatState {
  constructor(private state: DurableObjectState, private env: Env) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      if (url.pathname === '/store' && request.method === 'POST') {
        return await this.storeMessage(request);
      }
      
      if (url.pathname === '/history' && request.method === 'GET') {
        return await this.getHistory();
      }
      
      if (url.pathname === '/clear' && request.method === 'POST') {
        return await this.clearHistory();
      }
      
      return new Response('Not found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async storeMessage(request: Request): Promise<Response> {
    const { message, role }: { message: string; role: string } = await request.json();
    
    // Get existing messages
    const messages: ChatMessage[] = (await this.state.storage.get('messages')) || [];
    
    // Add new message
    const newMessage: ChatMessage = {
      role: role as 'user' | 'assistant' | 'system',
      content: message,
      timestamp: Date.now()
    };
    
    messages.push(newMessage);
    
    // Keep only last 50 messages to manage memory
    const recentMessages = messages.slice(-50);
    
    await this.state.storage.put('messages', recentMessages);
    
    return new Response(JSON.stringify({ success: true, messageCount: recentMessages.length }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async getHistory(): Promise<Response> {
    const messages: ChatMessage[] = (await this.state.storage.get('messages')) || [];
    
    // Format for LLM (include system message)
    const formattedMessages: ChatMessage[] = [
      { 
        role: 'system', 
        content: 'You are a helpful AI assistant. You can handle both text and voice interactions. Be concise but informative in your responses.'
      },
      ...messages
    ];
    
    return new Response(JSON.stringify(formattedMessages), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async clearHistory(): Promise<Response> {
    await this.state.storage.delete('messages');
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}