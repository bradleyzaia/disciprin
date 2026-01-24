import { mutation } from "./_generated/server";
import { v } from "convex/values";


export default mutation({
    args: {
        name: v.string(),
        timezone: v.string(),
        week_start_day: v.string(),
        pills: v.array(
            v.object({
                name: v.string(),
                measurement_type: v.string(),
                target_value: v.number(),
                unit: v.optional(v.string()),
                frequency_per_week: v.number(),
                category: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called completeOnboarding without authentication present");
        }

        const userId = identity.subject;
        const email = identity.email || "";

        // 1. Upsert User
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", userId))
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                timezone: args.timezone,
                week_start_day: args.week_start_day,
                onboarding_completed: true,
            });
        } else {
            await ctx.db.insert("users", {
                clerk_id: userId,
                name: args.name,
                email: email,
                timezone: args.timezone,
                week_start_day: args.week_start_day,
                onboarding_completed: true,
                created_at: Date.now(),
            });

            // System Tempo: Periods are inferred from Date, no initialization needed key.
        }

        // 2. Create Pills (Habits)
        const pillPromises = args.pills.map((pill) => {
            return ctx.db.insert("pills", {
                user_id: userId,
                name: pill.name,
                measurement_type: pill.measurement_type,
                target_value: pill.target_value,
                unit: pill.unit,
                frequency_per_week: pill.frequency_per_week,
                category: pill.category,
                current_streak: 0,
                longest_streak: 0,
                is_active: true,
                created_at: Date.now(),
            });
        });

        await Promise.all(pillPromises);

        return { success: true };
    },
});
