import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Update existing pill
export const updatePill = mutation({
    args: {
        id: v.id("pills"),
        name: v.string(),
        target_value: v.number(),
        frequency_per_week: v.number(),
        category: v.optional(v.string()), // Optional category update
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const pill = await ctx.db.get(args.id);
        if (!pill) throw new Error("Pill not found");
        if (pill.user_id !== identity.subject) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, {
            name: args.name,
            target_value: args.target_value,
            frequency_per_week: args.frequency_per_week,
            category: args.category,
        });

        return { success: true };
    },
});

// Archive pill (Soft delete)
export const archivePill = mutation({
    args: {
        id: v.id("pills"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const pill = await ctx.db.get(args.id);
        if (!pill) throw new Error("Pill not found");
        if (pill.user_id !== identity.subject) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, {
            is_active: false,
            deleted_at: Date.now(),
        });

        return { success: true };
    },
});
