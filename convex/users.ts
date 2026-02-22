import { mutation } from "./_generated/server";

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
});