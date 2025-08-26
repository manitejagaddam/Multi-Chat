import { MessageCircle } from "lucide-react";
import { LLMSelector } from "./LLMSelector";
import type { ModelId } from "@shared/schema";

interface ChatHeaderProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  sessionId: string;
  isLoading?: boolean;
}

export function ChatHeader({ selectedModel, onModelChange, sessionId, isLoading }: ChatHeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800" data-testid="app-title">
              Multi-LLM Chat
            </h1>
            <p className="text-xs text-slate-500" data-testid="session-info">
              Session: <span className="font-mono">{sessionId}</span>
            </p>
          </div>
        </div>
        
        <LLMSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={isLoading}
        />
      </div>
    </header>
  );
}
