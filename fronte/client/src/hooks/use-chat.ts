import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/api";
import type { Message, ModelId } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelId>("deepseek");
  const [sessionId, setSessionId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    const newSessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // Add system message
    setMessages([{
      role: "system",
      content: "Chat session started. Context will be preserved across model switches.",
      timestamp: new Date(),
    }]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onMutate: async (request) => {
      // Add user message immediately
      const userMessage: Message = {
        role: "user",
        content: request.messages[request.messages.length - 1]?.content || "",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
    },
    onSuccess: (response) => {
      setIsTyping(false);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.reply,
        model: response.model,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session ID if provided
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
      }
    },
    onError: (error) => {
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        role: "system",
        content: `Error: ${error.message || "Failed to send message. Please try again."}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || sendMessageMutation.isPending) return;

    // Get only user and assistant messages for context
    const contextMessages = messages
      .filter(msg => msg.role === "user" || msg.role === "assistant")
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    const newMessage = {
      role: "user" as const,
      content: content.trim(),
    };

    sendMessageMutation.mutate({
      model: selectedModel,
      messages: [...contextMessages, newMessage],
      session_id: sessionId,
    });
  }, [messages, selectedModel, sessionId, sendMessageMutation]);

  const copyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    messages,
    selectedModel,
    setSelectedModel,
    sessionId,
    isTyping,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    copyMessage,
    messagesEndRef,
  };
}
