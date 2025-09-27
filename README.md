# AI-Powered Hybrid Agent

A TypeScript-based hybrid chat and voice agent built on Cloudflare Workers AI using Llama 3.3 70B Instruct. This application demonstrates a complete AI-powered solution with text and voice interactions, persistent memory using Durable Objects, and a modern web interface.

## 🚀 Features

- **LLM Integration**: Powered by Llama 3.3 70B Instruct via Cloudflare Workers AI
- **Hybrid Interface**: Support for both text chat and voice input
- **Persistent Memory**: Conversation history stored using Cloudflare Durable Objects
- **Real-time Communication**: Instant messaging with typing indicators
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Fully typed for better development experience
- **Modern Architecture**: Built with Vite, Cloudflare Workers, and modern web APIs

## 📁 Project Structure

```
├── backend/                 # Cloudflare Worker (TypeScript)
│   ├── src/
│   │   ├── index.ts        # Main worker entry point
│   │   ├── durable-objects.ts  # Chat state management
│   │   └── types.ts        # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml       # Cloudflare configuration
├── frontend/               # Vite + TypeScript frontend
│   ├── src/
│   │   ├── main.ts        # Application logic
│   │   ├── types.ts       # Shared types
│   │   └── styles/
│   │       └── main.css   # Styling
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account with Workers AI access
- Wrangler CLI installed globally

## 📦 Installation

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Cloudflare Worker

1. Login to Cloudflare:
```bash
wrangler login
```

2. Update `backend/wrangler.toml` with your configuration:
   - Replace KV namespace IDs with your own
   - Adjust environment variables as needed

### 3. Configure Cloudflare Worker

1. Login to Cloudflare:
```bash
wrangler login
```

2. The `wrangler.toml` is already configured with:
   - Workers AI binding for Llama 3.3
   - Durable Objects for conversation memory

## 🚀 Development

### Backend Development

```bash
cd backend
npm run dev
```

This starts the Cloudflare Worker in development mode on `http://localhost:8787`

### Frontend Development

```bash
cd frontend
npm run dev
```

This starts the Vite development server on `http://localhost:3000`

### Type Checking

```bash
# Backend
cd backend
npm run type-check

# Frontend  
cd frontend
npm run type-check
```

## � Running the Application

This project is configured for **local development**. Both servers need to be running:

### Start Both Servers

1. **Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:8787`

2. **Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Access Your AI Agent

Open your browser to: `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (`backend/wrangler.toml`)

- `AI` binding: Provides access to Cloudflare Workers AI
- `CHAT_STATE` Durable Object: Manages conversation state
- Local development environment variables

### Frontend Configuration (`frontend/src/main.ts`)

```typescript
const CONFIG: AppConfig = {
  apiUrl: 'your-worker-url/api/chat',
  speechRecognitionLang: 'en-US',
  maxMessageLength: 1000
};
```

## 🎯 API Endpoints

### `POST /api/chat`
Send a message to the AI agent.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "sessionId": "session_123",
  "type": "text"
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "sessionId": "session_123", 
  "timestamp": 1695456789000
}
```

### `GET /api/health`
Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-09-23T10:00:00.000Z",
  "environment": "development"
}
```

## 🎤 Voice Features

The application includes voice input capabilities using the Web Speech API:

- **Voice Input**: Click the microphone button to speak
- **Automatic Transcription**: Speech is converted to text and sent to the AI
- **Voice Output**: AI responses can be spoken aloud (optional)
- **Browser Support**: Works in Chrome, Edge, and Safari

## 🧠 AI Model Details

- **Model**: Llama 3.3 70B Instruct FP8 Fast (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`)
- **Provider**: Cloudflare Workers AI
- **Features**: Instruction-tuned for conversation, optimized for speed
- **Context**: Maintains conversation history via Durable Objects

## 🔒 Security & Privacy

- **Session Isolation**: Each conversation has a unique session ID
- **Memory Management**: Conversation history is limited (last 50 messages)
- **CORS**: Properly configured for cross-origin requests
- **Data Storage**: All data stored on Cloudflare's edge network

## 🐛 Troubleshooting

### Common Issues

1. **"Offline Mode" status**: Ensure backend is running on port 8787
2. **Voice input not working**: Ensure microphone permissions in browser
3. **TypeScript errors**: Run `npm run type-check` to identify issues
4. **AI not responding**: Check Wrangler CLI is authenticated with `wrangler whoami`

### Debug Mode

Enable debug logging in the browser console to see detailed information about:
- API requests and responses
- Speech recognition events
- Connection status changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Resources

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Llama 3.3 Model Information](https://ai.meta.com/llama/)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

Built with ❤️ using Cloudflare Workers AI and TypeScript