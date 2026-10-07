import { query } from "../_generated/server";

/**
 * Get pending incoming friend requests for the current user.
 */
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const userId = identity.subject;

        const pending = await ctx.db
            .query("friends")
            .withIndex("by_friend_status", (q) => q.eq("friend_id", userId).eq("status", "pending"))
            .collect();

        const results = await Promise.all(
            pending.map(async (req) => {
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", req.user_id))
                    .first();
                return {
                    clerkId: req.user_id,
                    name: user?.name ?? "Unknown",
                    handle: user?.handle ? `@${user.handle}` : "",
                    createdAt: req.created_at,
                };
            })
        );

        return results;
    },
});
