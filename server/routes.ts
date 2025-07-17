import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertReplySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all public messages
  app.get("/api/messages/public", async (req, res) => {
    try {
      const messages = await storage.getPublicMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching public messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get all private messages (admin only)
  app.get("/api/messages/private", async (req, res) => {
    try {
      const messages = await storage.getPrivateMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching private messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get messages by category
  app.get("/api/messages/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const messages = await storage.getMessagesByCategory(category);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages by category:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create new message
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
        return;
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Create new reply
  app.post("/api/replies", async (req, res) => {
    try {
      const validatedData = insertReplySchema.parse(req.body);
      const reply = await storage.createReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reply data", errors: error.errors });
        return;
      }
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
