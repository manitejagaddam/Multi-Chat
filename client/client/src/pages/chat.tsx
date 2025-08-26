import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { MessageInput } from "@/components/chat/MessageInput";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const {
    messages,
    selectedModel,
    setSelectedModel,
    sessionId,
    isTyping,
    isLoading,
    sendMessage,
    copyMessage,
    messagesEndRef,
  } = useChat();

  // Count only user and assistant messages
  const messageCount = messages.filter(msg => 
    msg.role === "user" || msg.role === "assistant"
  ).length;

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl">
      <ChatHeader
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        sessionId={sessionId}
        isLoading={isLoading}
      />
      
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        selectedModel={selectedModel}
        onCopyMessage={copyMessage}
        messagesEndRef={messagesEndRef}
      />
      
      <MessageInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        messageCount={messageCount}
      />
    </div>
  );
}
