import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all friends with their tasks and completion status for a given date.
 * Returns each friend's active pills + whether each was completed on that date.
 */
export default query({
    args: {
        date: v.optional(v.string()), // YYYY-MM-DD, defaults to today
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const userId = identity.subject;

        const dateStr = args.date ?? new Date().toISOString().split("T")[0];

        // Helper to build a user's task data for a given date
        async function buildUserTasks(clerkId: string) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
                .first();
            if (!user) return null;

            const pills = await ctx.db
                .query("pills")
                .withIndex("by_user_active", (q) =>
                    q.eq("user_id", clerkId).eq("is_active", true)
                )
                .collect();

            const dayEntries = await ctx.db
                .query("pill_entries")
                .withIndex("by_user_date", (q) =>
                    q.eq("user_id", clerkId).eq("date", dateStr)
                )
                .collect();

            const tasks = pills.map((pill) => {
                const entry = dayEntries.find((e) => e.pill_id === pill._id);
                const value = entry?.value ?? 0;
                const completed = entry
                    ? pill.measurement_type === "boolean"
                        ? entry.value === 1
                        : entry.value >= pill.target_value
                    : false;

                return {
                    id: pill._id,
                    name: pill.name,
                    category: pill.category ?? "OTHER",
                    measurementType: pill.measurement_type,
                    targetValue: pill.target_value,
                    unit: pill.unit ?? null,
                    value,
                    completed,
                    currentStreak: pill.current_streak,
                };
            });

            const completedCount = tasks.filter((t) => t.completed).length;

            return {
                clerkId,
                name: user.name,
                handle: user.handle ? `@${user.handle}` : `@${user.name.toLowerCase()}`,
                tasks,
                completedCount,
                totalCount: tasks.length,
                completionPct: tasks.length > 0
                    ? Math.round((completedCount / tasks.length) * 100)
                    : 0,
                isMe: clerkId === userId,
            };
        }

        // Build current user's data first
        const me = await buildUserTasks(userId);

        // Get all accepted friendships (both directions)
        const sentFriends = await ctx.db
            .query("friends")
            .withIndex("by_user_status", (q) => q.eq("user_id", userId).eq("status", "accepted"))
            .collect();

        const receivedFriends = await ctx.db
            .query("friends")
            .withIndex("by_friend_status", (q) => q.eq("friend_id", userId).eq("status", "accepted"))
            .collect();

        const friendClerkIds = [
            ...sentFriends.map((f) => f.friend_id),
            ...receivedFriends.map((f) => f.user_id),
        ];
        const uniqueIds = [...new Set(friendClerkIds)];

        const friends = await Promise.all(
            uniqueIds.map((friendClerkId) => buildUserTasks(friendClerkId))
        );

        const result = [me, ...friends].filter(Boolean);
        return result;
    },
});
