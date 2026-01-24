import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get current user profile
export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();
    },
});

// Update user profile
export const updateUser = mutation({
    args: {
        name: v.string(),
        timezone: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            name: args.name,
            timezone: args.timezone,
        });

        return { success: true };
    },
});

// Delete account (Hard delete for now, or soft delete if preferred - following plan for cascade)
export const deleteAccount = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        // Delete all user's pills
        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active")
            .filter(q => q.eq(q.field("user_id"), user.clerk_id))
            .collect();

        for (const pill of pills) {
            await ctx.db.delete(pill._id);
        }

        // Delete all pill entries (this might be large, ideally scheduled, but ok for valid use cases)
        const entries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date")
            .filter(q => q.eq(q.field("user_id"), user.clerk_id))
            .collect();

        for (const entry of entries) {
            await ctx.db.delete(entry._id);
        }

        // Delete user
        await ctx.db.delete(user._id);

        return { success: true };
    },
});
