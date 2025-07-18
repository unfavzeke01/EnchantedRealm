import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  spotifyLink: text("spotify_link"),
  isPublic: boolean("is_public").default(true),
  recipient: text("recipient"), // Who the private message is sent to
  senderName: text("sender_name"), // Optional sender name
  createdAt: timestamp("created_at").defaultNow(),
});

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id).notNull(),
  content: text("content").notNull(),
  nickname: text("nickname").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin accounts table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nickname: text("nickname").notNull().unique(),
  role: text("role").notNull().default("admin"), // admin, moderator, support, community_manager
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const messagesRelations = relations(messages, ({ many }) => ({
  replies: many(replies),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  message: one(messages, {
    fields: [replies.messageId],
    references: [messages.id],
  }),
}));

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertReplySchema = createInsertSchema(replies).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertReply = z.infer<typeof insertReplySchema>;
export type Reply = typeof replies.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type MessageWithReplies = Message & {
  replies: Reply[];
};
