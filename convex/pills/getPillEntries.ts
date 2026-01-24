import { query } from "../_generated/server";

// Get entries for the user
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const userId = identity.subject;

        const entries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", (q) => q.eq("user_id", userId))
            .collect();

        return entries.map(entry => ({
            pill_id: entry.pill_id,
            date: entry.date,
            value: entry.value,
            // Derived completion logic
            is_completed: entry.value > 0,
        }));
    },
});
