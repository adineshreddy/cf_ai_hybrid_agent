import { Env, ChatRequest, ChatResponse, ChatMessage } from './types';
import { ChatState } from './durable-objects';

// Export the Durable Object class
export { ChatState };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Chat endpoint
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        return await handleChat(request, env);
      }

      // Health check endpoint
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'development'
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Default response
      return new Response(JSON.stringify({ 
        message: 'AI-Powered Hybrid Agent API',
        endpoints: ['/api/chat', '/api/health']
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  },
};

async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    const { message, sessionId, type = 'text' }: ChatRequest = await request.json();
    
    if (!message || !sessionId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: message and sessionId' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get Durable Object instance for session state
    const id = env.CHAT_STATE.idFromName(sessionId);
    const chatState = env.CHAT_STATE.get(id);
    
    // Store user message
    await chatState.fetch(new Request('https://dummy/store', {
      method: 'POST',
      body: JSON.stringify({ message, role: 'user' }),
      headers: { 'Content-Type': 'application/json' }
    }));
    
    // Get conversation history
    const historyResponse = await chatState.fetch(new Request('https://dummy/history'));
    const history: ChatMessage[] = await historyResponse.json();
    
    // Call Llama 3.3 via Workers AI (FP8 Fast version)
    const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: history.map(msg => ({ role: msg.role, content: msg.content })),
      max_tokens: 1000,
      temperature: 0.7,
      stream: false
    });
    
    const responseText = aiResponse.response || 'I apologize, but I could not generate a response.';
    
    // Store AI response
    await chatState.fetch(new Request('https://dummy/store', {
      method: 'POST',
      body: JSON.stringify({ message: responseText, role: 'assistant' }),
      headers: { 'Content-Type': 'application/json' }
    }));

    const response: ChatResponse = {
      response: responseText,
      sessionId,
      timestamp: Date.now()
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}