# Multi-LLM Chat Application

## Overview

This is a full-stack chat application that allows users to interact with multiple Large Language Models (LLMs) including DeepSeek, Mistral, and Qwen. The application features a React TypeScript frontend with a Node.js Express proxy server that communicates with a separate FastAPI backend service. Users can switch between different AI models mid-conversation while maintaining session context, and the interface provides a modern chat experience with real-time typing indicators and message management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation

### Backend Architecture
- **Express Proxy Server**: Node.js/Express server that acts as a proxy between the frontend and FastAPI backend
- **FastAPI Service**: Python-based FastAPI service (referenced in attached files) that handles LLM integrations
- **Session Management**: In-memory storage for user sessions with UUID generation
- **API Design**: RESTful endpoints with Zod schema validation for type safety

### Data Management
- **Database**: Drizzle ORM configured for PostgreSQL with Neon Database serverless integration
- **Schema Validation**: Zod schemas shared between frontend and backend for consistent data types
- **Session Storage**: Temporary in-memory storage for chat sessions with fallback to database persistence

### Chat System Design
- **Multi-Model Support**: Architecture supports switching between different LLM providers (DeepSeek, Mistral, Qwen) within the same conversation
- **Context Preservation**: Session-based message history that persists across model switches
- **Real-time Features**: Typing indicators, auto-scroll, and optimistic UI updates for responsive user experience
- **Message Management**: Copy functionality, timestamp display, and role-based message rendering

### External Dependencies

- **Database**: Neon PostgreSQL serverless database with connection pooling
- **LLM Services**: 
  - DeepSeek API for advanced reasoning capabilities
  - Mistral API for general-purpose conversations  
  - Qwen API for multilingual support
- **UI Framework**: Radix UI component library for accessibility-first primitives
- **Build Tools**: Vite for frontend bundling with TypeScript support
- **Development**: Replit integration with hot reload and error overlay support