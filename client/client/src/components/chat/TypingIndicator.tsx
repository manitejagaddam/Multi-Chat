import { Lightbulb } from "lucide-react";
import { availableModels, type ModelId } from "@shared/schema";

interface TypingIndicatorProps {
  model: ModelId;
}

export function TypingIndicator({ model }: TypingIndicatorProps) {
  const currentModel = availableModels.find(m => m.id === model);
  
  return (
    <div className="flex justify-start animate-fade-in-up" data-testid="typing-indicator">
      <div className="max-w-xs sm:max-w-md lg:max-w-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Lightbulb className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="bg-chat-assistant border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {currentModel?.name}
              </span>
              <span className="text-xs text-slate-500">is typing...</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
