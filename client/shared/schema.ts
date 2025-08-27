import { z } from "zod";

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.date().optional(),
  model: z.string().optional(),
});

export const chatRequestSchema = z.object({
  model: z.string(),
  messages: z.array(messageSchema),
  session_id: z.string().optional(),
});

export const chatResponseSchema = z.object({
  session_id: z.string(),
  model: z.string(),
  reply: z.string(),
});

export const multiChatRequestSchema = z.object({
  models: z.array(z.string()),
  messages: z.array(messageSchema),
  session_id: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export type MultiChatRequest = z.infer<typeof multiChatRequestSchema>;

export const availableModels = [
  { id: "deepseek", name: "DeepSeek", description: "DeepSeek R1 Model", color: "blue" },
  { id: "mistral", name: "Mistral", description: "Mistral Large", color: "orange" },
  { id: "qwen", name: "Qwen", description: "Qwen Turbo", color: "purple" },
] as const;

export type ModelId = typeof availableModels[number]["id"];
