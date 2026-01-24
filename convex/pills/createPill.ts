import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        name: v.string(),
        measurement_type: v.string(),
        target_value: v.number(),
        unit: v.optional(v.string()),
        frequency_per_week: v.number(),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;

        const pillId = await ctx.db.insert("pills", {
            user_id: userId,
            name: args.name,
            measurement_type: args.measurement_type,
            target_value: args.target_value,
            unit: args.unit,
            frequency_per_week: args.frequency_per_week,
            category: args.category,
            current_streak: 0,
            longest_streak: 0,
            is_active: true,
            created_at: Date.now(),
        });

        return pillId;
    },
});
