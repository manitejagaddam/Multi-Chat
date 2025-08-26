import { useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message, ModelId } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  selectedModel: ModelId;
  onCopyMessage: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ 
  messages, 
  isTyping, 
  selectedModel, 
  onCopyMessage, 
  messagesEndRef 
}: ChatMessagesProps) {
  
  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          onCopy={onCopyMessage}
        />
      ))}
      
      {isTyping && (
        <TypingIndicator model={selectedModel} />
      )}
      
      <div ref={messagesEndRef} />
    </main>
  );
}
