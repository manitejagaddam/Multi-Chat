import { apiRequest } from "./queryClient";
import type { ChatRequest, ChatResponse, MultiChatRequest, Message } from "@shared/schema";

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/chat", request);
  return response.json();
}

export async function sendMultiChatMessage(request: MultiChatRequest) {
  const response = await apiRequest("POST", "/chatAll", request);
  return response.json();
}

export async function getAvailableModels() {
  const response = await apiRequest("GET", "/models");
  return response.json();
}
