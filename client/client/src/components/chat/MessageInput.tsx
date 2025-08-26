import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  messageCount: number;
}

export function MessageInput({ onSendMessage, isLoading, messageCount }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Shift+Enter for new line)"
              className="resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 min-h-[48px] max-h-32"
              rows={1}
              disabled={isLoading}
              data-testid="message-input"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors duration-200 h-auto"
              data-testid="attachment-button"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-3 font-medium text-sm transition-all duration-200 min-w-[80px] h-12"
            data-testid="send-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>Send</span>
              </>
            )}
          </Button>
        </form>
        
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>Shift + Enter for new line</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Context preserved across models</span>
          </div>
          <div className="text-xs text-slate-500" data-testid="message-count">
            {messageCount} message{messageCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </footer>
  );
}
