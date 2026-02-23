import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function getMe(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const me = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();

  if (!me) throw new Error("User not found in DB");
  return me;
}

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const me = await getMe(ctx);
    const convo = await ctx.db.get(conversationId);
    if (!convo) throw new Error("Conversation not found");

    // basic security: only participants can read
    if (convo.userOne !== me._id && convo.userTwo !== me._id) {
      throw new Error("Not allowed");
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation_createdAt", (q) =>
        q.eq("conversationId", conversationId),
      )
      .collect();
  },
});

export const send = mutation({
  args: { conversationId: v.id("conversations"), text: v.string() },
  handler: async (ctx, { conversationId, text }) => {
    const me = await getMe(ctx);
    const convo = await ctx.db.get(conversationId);
    if (!convo) throw new Error("Conversation not found");
    if (convo.userOne !== me._id && convo.userTwo !== me._id) {
      throw new Error("Not allowed");
    }

    await ctx.db.insert("messages", {
      conversationId,
      senderId: me._id,
      text,
      createdAt: Date.now(),
    });
  },
});
