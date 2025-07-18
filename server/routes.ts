import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertReplySchema, insertAdminSchema } from "@shared/schema";
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

  // Get messages by recipient
  app.get("/api/messages/recipient/:recipient", async (req, res) => {
    try {
      const { recipient } = req.params;
      const messages = await storage.getMessagesByRecipient(recipient);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages by recipient:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get available recipients
  app.get("/api/recipients", async (req, res) => {
    try {
      const recipients = await storage.getRecipients();
      res.json(recipients);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      res.status(500).json({ message: "Failed to fetch recipients" });
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

  // Update message visibility (make private message public)
  app.patch("/api/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isPublic } = req.body;
      const message = await storage.updateMessageVisibility(parseInt(id), isPublic);
      res.json(message);
    } catch (error) {
      console.error("Error updating message visibility:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Admin management routes
  app.post("/api/admins", async (req, res) => {
    try {
      const validatedData = insertAdminSchema.parse(req.body);
      const admin = await storage.createAdmin(validatedData);
      // Don't return password in response
      const { password, ...adminWithoutPassword } = admin;
      res.status(201).json(adminWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid admin data", errors: error.errors });
        return;
      }
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  app.get("/api/admins", async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      // Don't return passwords in response
      const adminsWithoutPasswords = admins.map(({ password, ...admin }) => admin);
      res.json(adminsWithoutPasswords);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  app.patch("/api/admins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const admin = await storage.updateAdminStatus(parseInt(id), isActive);
      const { password, ...adminWithoutPassword } = admin;
      res.json(adminWithoutPassword);
    } catch (error) {
      console.error("Error updating admin status:", error);
      res.status(500).json({ message: "Failed to update admin status" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password || !admin.isActive) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      
      const { password: _, ...adminWithoutPassword } = admin;
      res.json(adminWithoutPassword);
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
