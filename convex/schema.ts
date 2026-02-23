import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    isOnline: v.optional(v.boolean()),
    lastSeen: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
    userOne: v.id("users"),
    userTwo: v.id("users"),
    lastMessage: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userOne", ["userOne"])
    .index("by_userTwo", ["userTwo"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_conversation_createdAt", ["conversationId", "createdAt"]),
});
