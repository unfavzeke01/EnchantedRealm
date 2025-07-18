import { messages, replies, admins, type Message, type Reply, type Admin, type InsertMessage, type InsertReply, type InsertAdmin, type MessageWithReplies } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getPublicMessages(): Promise<MessageWithReplies[]>;
  getPrivateMessages(): Promise<MessageWithReplies[]>;
  getMessagesByCategory(category: string): Promise<MessageWithReplies[]>;
  getMessagesByRecipient(recipient: string): Promise<MessageWithReplies[]>;
  updateMessageVisibility(messageId: number, isPublic: boolean): Promise<Message>;
  
  // Reply operations
  createReply(reply: InsertReply): Promise<Reply>;
  getRepliesByMessageId(messageId: number): Promise<Reply[]>;
  
  // Admin operations
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAllAdmins(): Promise<Admin[]>;
  updateAdminStatus(adminId: number, isActive: boolean): Promise<Admin>;
  
  // Recipients operations - now returns admin nicknames
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

  async updateMessageVisibility(messageId: number, isPublic: boolean): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set({ isPublic })
      .where(eq(messages.id, messageId))
      .returning();
    return message;
  }

  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(adminData)
      .returning();
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);
    return admin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    const result = await db
      .select()
      .from(admins)
      .orderBy(desc(admins.createdAt));
    return result;
  }

  async updateAdminStatus(adminId: number, isActive: boolean): Promise<Admin> {
    const [admin] = await db
      .update(admins)
      .set({ isActive })
      .where(eq(admins.id, adminId))
      .returning();
    return admin;
  }

  async getRecipients(): Promise<string[]> {
    // Return active admin nicknames as recipients
    const activeAdmins = await db
      .select({ nickname: admins.nickname })
      .from(admins)
      .where(eq(admins.isActive, true));
    
    if (activeAdmins.length === 0) {
      // Fallback to default recipients if no admins exist
      return ["Admin", "Moderator", "Support", "Community Manager"];
    }
    
    return activeAdmins.map(admin => admin.nickname);
  }
}

export const storage = new DatabaseStorage();
