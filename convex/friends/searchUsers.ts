import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Search users by name or @handle prefix. Returns up to 10 results, excluding self.
 */
export default query({
    args: {
        query: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const userId = identity.subject;

        const searchTerm = args.query.replace(/^@/, "").toLowerCase();
        if (searchTerm.length < 2) return [];

        // Convex doesn't have LIKE queries, so we fetch users and filter
        // For production, use a search index. This works for MVP scale.
        const allUsers = await ctx.db
            .query("users")
            .collect();

        const results = allUsers
            .filter((u) => {
                if (u.clerk_id === userId) return false;
                const handleMatch = u.handle?.toLowerCase().startsWith(searchTerm);
                const nameMatch = u.name?.toLowerCase().includes(searchTerm);
                return handleMatch || nameMatch;
            })
            .slice(0, 10);

        // Check existing friend status for each result
        const withStatus = await Promise.all(
            results.map(async (u) => {
                // Check both directions
                const sent = await ctx.db
                    .query("friends")
                    .withIndex("by_pair", (q) => q.eq("user_id", userId).eq("friend_id", u.clerk_id))
                    .first();

                const received = await ctx.db
                    .query("friends")
                    .withIndex("by_pair", (q) => q.eq("user_id", u.clerk_id).eq("friend_id", userId))
                    .first();

                const friendship = sent || received;
                const status = friendship?.status ?? null;

                return {
                    clerkId: u.clerk_id,
                    name: u.name,
                    handle: u.handle!,
                    friendStatus: status as "pending" | "accepted" | "blocked" | null,
                    isSender: sent ? true : false,
                };
            })
        );

        return withStatus;
    },
});
