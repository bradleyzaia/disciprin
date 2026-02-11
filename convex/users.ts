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

export const updatePillOrder = mutation({
    args: {
        pillIds: v.array(v.string()),
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
            pill_order: args.pillIds,
        });

        return { success: true };
    },
});

// Check handle availability
export const checkHandleAvailability = query({
    args: { handle: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { available: false, reason: "Unauthenticated" };

        const handle = args.handle.toLowerCase();
        const regex = /^[a-z0-9][a-z0-9_]{1,18}[a-z0-9]$/;
        if (!regex.test(handle)) {
            return { available: false, reason: "3-20 chars, lowercase alphanumeric and underscores only" };
        }

        const existing = await ctx.db
            .query("users")
            .withIndex("by_handle", (q) => q.eq("handle", handle))
            .first();

        if (existing && existing.clerk_id !== identity.subject) {
            return { available: false, reason: "Handle already taken" };
        }

        return { available: true, reason: null };
    },
});

// Update user handle
export const updateHandle = mutation({
    args: { handle: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const handle = args.handle.toLowerCase();
        const regex = /^[a-z0-9][a-z0-9_]{1,18}[a-z0-9]$/;
        if (!regex.test(handle)) {
            throw new Error("Invalid handle format");
        }

        const existing = await ctx.db
            .query("users")
            .withIndex("by_handle", (q) => q.eq("handle", handle))
            .first();

        if (existing && existing.clerk_id !== identity.subject) {
            throw new Error("Handle already taken");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, { handle });
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
