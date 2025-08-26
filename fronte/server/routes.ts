import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatRequestSchema, multiChatRequestSchema } from "@shared/schema";

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Proxy chat request to FastAPI backend
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      
      const response = await fetch(`${FASTAPI_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `FastAPI Error: ${errorText}` 
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Chat API error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        error: "Internal server error" 
      });
    }
  });

  // Proxy multi-chat request to FastAPI backend
  app.post("/api/chat-all", async (req, res) => {
    try {
      const validatedData = multiChatRequestSchema.parse(req.body);
      
      const response = await fetch(`${FASTAPI_BASE_URL}/chatAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `FastAPI Error: ${errorText}` 
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Multi-chat API error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        error: "Internal server error" 
      });
    }
  });

  // Get available models
  app.get("/api/models", (req, res) => {
    const models = [
      { id: "deepseek", name: "DeepSeek", description: "DeepSeek R1 Model", color: "blue" },
      { id: "mistral", name: "Mistral", description: "Mistral Large", color: "orange" },
      { id: "qwen", name: "Qwen", description: "Qwen Turbo", color: "purple" },
    ];
    res.json(models);
  });

  const httpServer = createServer(app);
  return httpServer;
}
