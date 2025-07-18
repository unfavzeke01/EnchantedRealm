import { messages, replies, type Message, type Reply, type InsertMessage, type InsertReply, type MessageWithReplies } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getPublicMessages(): Promise<MessageWithReplies[]>;
  getPrivateMessages(): Promise<MessageWithReplies[]>;
  getMessagesByCategory(category: string): Promise<MessageWithReplies[]>;
  getMessagesByRecipient(recipient: string): Promise<MessageWithReplies[]>;
  
  // Reply operations
  createReply(reply: InsertReply): Promise<Reply>;
  getRepliesByMessageId(messageId: number): Promise<Reply[]>;
  
  // Recipients operations
  getRecipients(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async getPublicMessages(): Promise<MessageWithReplies[]> {
    const result = await db.query.messages.findMany({
      where: eq(messages.isPublic, true),
      orderBy: desc(messages.createdAt),
      with: {
        replies: {
          orderBy: desc(replies.createdAt),
        },
      },
    });
    return result;
  }

  async getPrivateMessages(): Promise<MessageWithReplies[]> {
    const result = await db.query.messages.findMany({
      where: eq(messages.isPublic, false),
      orderBy: desc(messages.createdAt),
      with: {
        replies: {
          orderBy: desc(replies.createdAt),
        },
      },
    });
    return result;
  }

  async getMessagesByCategory(category: string): Promise<MessageWithReplies[]> {
    const result = await db.query.messages.findMany({
      where: eq(messages.category, category),
      orderBy: desc(messages.createdAt),
      with: {
        replies: {
          orderBy: desc(replies.createdAt),
        },
      },
    });
    return result;
  }

  async createReply(replyData: InsertReply): Promise<Reply> {
    const [reply] = await db
      .insert(replies)
      .values(replyData)
      .returning();
    return reply;
  }

  async getRepliesByMessageId(messageId: number): Promise<Reply[]> {
    const result = await db
      .select()
      .from(replies)
      .where(eq(replies.messageId, messageId))
      .orderBy(desc(replies.createdAt));
    return result;
  }

  async getMessagesByRecipient(recipient: string): Promise<MessageWithReplies[]> {
    const result = await db.query.messages.findMany({
      where: eq(messages.recipient, recipient),
      orderBy: desc(messages.createdAt),
      with: {
        replies: {
          orderBy: desc(replies.createdAt),
        },
      },
    });
    return result;
  }

  async getRecipients(): Promise<string[]> {
    // For now, return a predefined list of recipients
    // In a real app, this might come from a users table
    return ["Admin", "Moderator", "Support", "Community Manager"];
  }
}

export const storage = new DatabaseStorage();
