import { Check, Copy, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
  onCopy: (content: string) => void;
}

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.role === "system") {
    return (
      <div className="flex justify-center" data-testid="system-message">
        <div className="bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800 flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in-up" data-testid="user-message">
        <div className="max-w-xs sm:max-w-md lg:max-w-lg">
          <div className="bg-chat-user text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center justify-end space-x-2 mt-1 px-1">
            {message.timestamp && (
              <span className="text-xs text-slate-500">
                {formatTime(message.timestamp)}
              </span>
            )}
            <div className="w-4 h-4 text-slate-400">
              <Check className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex justify-start animate-fade-in-up" data-testid="assistant-message">
        <div className="max-w-xs sm:max-w-md lg:max-w-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div className="bg-chat-assistant border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              {message.model && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    {message.model}
                  </span>
                </div>
              )}
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start space-x-2 mt-1 px-11">
            {message.timestamp && (
              <span className="text-xs text-slate-500">
                {formatTime(message.timestamp)}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(message.content)}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200 h-auto p-1"
              data-testid="copy-message-button"
            >
              <Copy className="w-3 h-3 mr-1" />
              <span>Copy</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
