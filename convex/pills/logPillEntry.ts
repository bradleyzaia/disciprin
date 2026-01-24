import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        pill_id: v.id("pills"),
        date: v.string(), // YYYY-MM-DD
        value: v.number(),
        is_completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;

        // Check if entry exists
        const existing = await ctx.db
            .query("pill_entries")
            .withIndex("by_pill_date", (q) => q.eq("pill_id", args.pill_id).eq("date", args.date))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                value: args.value,
                updated_at: Date.now(),
            });
        } else {
            // Decoupled Logic: Just Insert.
            // Period association is implicit via Date.
            await ctx.db.insert("pill_entries", {
                pill_id: args.pill_id,
                user_id: userId,
                date: args.date,
                value: args.value,
                created_at: Date.now(),
                updated_at: Date.now(),
            });
        }
    },
});
