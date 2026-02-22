import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const createUserIfNotExists = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email!,
        name: identity.name ?? "",
      });
    }
  },
})

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await ctx.auth.getUserIdentity();
    if (!currentUser) throw new Error("Not authenticated");

    const allUsers = await ctx.db
      .query("users")
      .withIndex("by_clerkId") 
      .collect();

    
    return allUsers.filter((user) => user.clerkId !== currentUser.id);
  },
});