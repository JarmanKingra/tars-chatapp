import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreate = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find "me" in your users table
    const me = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!me) throw new Error("User not found in DB");
    if (me._id === otherUserId) throw new Error("Can't DM yourself");

    // Check existing conversation (both directions)
    const mineAsOne = await ctx.db
      .query("conversations")
      .withIndex("by_userOne", (q) => q.eq("userOne", me._id))
      .collect();

    const existing =
      mineAsOne.find((c) => c.userTwo === otherUserId) ??
      (await ctx.db
        .query("conversations")
        .withIndex("by_userTwo", (q) => q.eq("userTwo", me._id))
        .collect()
      ).find((c) => c.userOne === otherUserId);

    if (existing) return existing._id;

    // Create new conversation
    return await ctx.db.insert("conversations", {
      userOne: me._id,
      userTwo: otherUserId,
      createdAt: Date.now(),
    });
  },
});