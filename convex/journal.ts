import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get a journal entry for a specific period and date
export const getEntry = query({
    args: {
        period_type: v.string(), // 'weekly' for now
        date: v.string(), // YYYY-MM-DD
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null; // Handle unauthorized in UI usually, or throw
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) return null;

        const entry = await ctx.db
            .query("journal_entries")
            .withIndex("by_user_type_date", (q) =>
                q.eq("user_id", user.clerk_id)
                    .eq("period_type", args.period_type)
                    .eq("date", args.date)
            )
            .first();

        return entry;
    },
});

// Save (upsert) a journal entry
export const saveEntry = mutation({
    args: {
        period_type: v.string(),
        date: v.string(),
        content: v.string(),
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        const existing = await ctx.db
            .query("journal_entries")
            .withIndex("by_user_type_date", (q) =>
                q.eq("user_id", user.clerk_id)
                    .eq("period_type", args.period_type)
                    .eq("date", args.date)
            )
            .first();

        // Match schema: only user_id, period_type, date are needed keys.
        // The current schema does NOT have a 'period_id' field or a 'periods' table definition,
        // so we omit the period lookup logic and storage to match actual schema.ts.

        if (existing) {
            await ctx.db.patch(existing._id, {
                content: args.content,
                title: args.title,
                updated_at: Date.now(),
            });
        } else {
            await ctx.db.insert("journal_entries", {
                user_id: user.clerk_id,
                period_type: args.period_type,
                date: args.date,
                content: args.content,
                title: args.title,
                created_at: Date.now(),
                updated_at: Date.now(),
            });
        }
    },
});

export const listEntries = query({
    args: {
        period_type: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) return [];

        const entries = await ctx.db
            .query("journal_entries")
            .withIndex("by_user_type_date", (q) =>
                q.eq("user_id", user.clerk_id)
                    .eq("period_type", args.period_type)
            )
            .order("desc") // Order by date descending
            .collect();

        return entries;
    },
});

export const deleteEntry = mutation({
    args: {
        id: v.id("journal_entries"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        const entry = await ctx.db.get(args.id);
        if (!entry) throw new Error("Entry not found");

        if (entry.user_id !== user.clerk_id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});
