# Project Development Prompts

This document contains the key prompts and queries used during the development of the CF AI Hybrid Agent project.

## Initial Setup Prompts

### Project Initialization
```
Create a TypeScript-based AI hybrid chat and voice agent using:
- Cloudflare Workers AI with Llama 3.3 70B Instruct
- Durable Objects for conversation memory
- Vite frontend with TypeScript
- Voice input capabilities using Web Speech API
```

### Architecture Design
```
Design a serverless architecture for an AI agent with:
- Backend: Cloudflare Worker handling API endpoints
- Frontend: Modern web interface with chat and voice input
- Memory: Persistent conversation history per session
- AI Integration: Llama 3.3 model for text generation
```

## Technical Implementation Prompts

### Backend Development
```
Implement Cloudflare Worker with:
- POST /api/chat endpoint for AI conversations
- GET /api/health endpoint for connection status
- Durable Objects class for session management
- CORS headers for cross-origin requests
- Error handling and validation
```

### Frontend Development
```
Create a responsive chat interface with:
- TypeScript for type safety
- Web Speech API for voice input
- Real-time connection status indicator
- Message history display
- Voice and text input modes
```

### Configuration Setup
```
Configure development environment with:
- wrangler.toml for Cloudflare Worker settings
- tsconfig.json for TypeScript compilation
- vite.config.ts for frontend build
- VS Code tasks for development workflow
```

## Debugging Prompts

### CORS Issues
```
Fix CORS errors when frontend calls backend:
- Add Access-Control-Allow-Origin headers
- Handle OPTIONS preflight requests
- Ensure all endpoints return proper CORS headers
```

### Model Integration
```
Resolve AI model not found error:
- Check available models with wrangler ai models
- Update model name to correct version
- Use @cf/meta/llama-3.3-70b-instruct-fp8-fast
```

### Connection Status
```
Implement connection monitoring:
- Health check endpoint with CORS support
- Frontend status indicator (connected/offline)
- Automatic retry mechanism for failed connections
- Debug logging for connection attempts
```

## Deployment Considerations

### Local Development
```
Set up local development environment:
- Backend runs on localhost:8787 via wrangler dev
- Frontend runs on localhost:3000 via vite dev
- Both servers need to run simultaneously
- API URL configuration for local testing
```

### Production Deployment
```
Prepare for Cloudflare deployment:
- Configure Durable Objects migrations
- Set up KV namespaces if needed
- Update API URLs for production
- Handle authentication and billing requirements
```

## Git and Repository Management

### Repository Setup
```
Initialize Git repository and push to GitHub:
- Create .gitignore for Node.js projects
- Add MIT license for open source distribution
- Include VS Code tasks for team collaboration
- Document setup process in README.md
```

### Project Documentation
```
Create comprehensive documentation:
- Installation and setup instructions
- API endpoint documentation
- Development workflow guidelines
- Troubleshooting common issues
```

## Voice Integration Prompts

### Web Speech API
```
Implement voice input functionality:
- Check browser compatibility for SpeechRecognition
- Handle microphone permissions
- Convert speech to text for chat input
- Provide visual feedback for voice recording
```

### Audio Output
```
Add optional voice output:
- Use SpeechSynthesis API for text-to-speech
- Allow users to toggle voice responses
- Configure voice settings (rate, pitch, volume)
```

## Performance Optimization

### Frontend Optimization
```
Optimize frontend performance:
- Implement efficient message rendering
- Add loading states and animations
- Minimize bundle size with tree shaking
- Cache static assets appropriately
```

### Backend Optimization
```
Optimize Cloudflare Worker performance:
- Minimize response times for AI calls
- Implement proper error handling
- Use efficient data structures for message storage
- Monitor usage and costs
```

## Security Considerations

### Input Validation
```
Implement security measures:
- Validate message length and content
- Sanitize user inputs
- Rate limiting for API calls
- Session isolation and management
```

### Authentication
```
Consider authentication requirements:
- Session-based user identification
- Optional user authentication
- API key management for production
- Privacy considerations for conversation data
```

---

*Note: This project was developed with minimal external assistance, focusing on learning Cloudflare Workers AI integration and modern TypeScript development practices.*