import { query } from "../_generated/server";

/**
 * Get all friends with their tasks and today's completion status.
 * Returns each friend's active pills + whether each was completed today.
 */
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const userId = identity.subject;

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

        const todayStr = new Date().toISOString().split("T")[0];

        const friends = await Promise.all(
            uniqueIds.map(async (friendClerkId) => {
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", friendClerkId))
                    .first();
                if (!user) return null;

                // Get active pills
                const pills = await ctx.db
                    .query("pills")
                    .withIndex("by_user_active", (q) =>
                        q.eq("user_id", friendClerkId).eq("is_active", true)
                    )
                    .collect();

                // Get today's entries
                const todayEntries = await ctx.db
                    .query("pill_entries")
                    .withIndex("by_user_date", (q) =>
                        q.eq("user_id", friendClerkId).eq("date", todayStr)
                    )
                    .collect();

                const tasks = pills.map((pill) => {
                    const entry = todayEntries.find((e) => e.pill_id === pill._id);
                    const completed = entry
                        ? pill.measurement_type === "boolean"
                            ? entry.value === 1
                            : entry.value >= pill.target_value
                        : false;
                    const value = entry?.value ?? 0;

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
                    clerkId: friendClerkId,
                    name: user.name,
                    handle: user.handle ? `@${user.handle}` : `@${user.name.toLowerCase()}`,
                    tasks,
                    completedCount,
                    totalCount: tasks.length,
                    completionPct: tasks.length > 0
                        ? Math.round((completedCount / tasks.length) * 100)
                        : 0,
                };
            })
        );

        return friends.filter(Boolean);
    },
});
