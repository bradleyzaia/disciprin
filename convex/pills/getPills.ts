import { query } from "../_generated/server";

// Get all active pills for the current user
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const userId = identity.subject;

        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active", (q) => q.eq("user_id", userId).eq("is_active", true))
            .collect();

        // Sort by created_at or another field if needed
        return pills.map(pill => ({
            ...pill,
            id: pill._id,
        }));
    },
});
