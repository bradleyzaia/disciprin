import { query } from "../_generated/server";

/**
 * Get all accepted friends for the current user.
 * Returns friend data with completion stats for the current week.
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

        // Dedupe
        const uniqueIds = [...new Set(friendClerkIds)];

        // Get current week boundaries (Sunday-based)
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        const weekStart = new Date(now);
        weekStart.setUTCDate(now.getUTCDate() - dayOfWeek);
        weekStart.setUTCHours(0, 0, 0, 0);
        const weekStartStr = weekStart.toISOString().split("T")[0];

        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        const weekEndStr = weekEnd.toISOString().split("T")[0];

        // Build friend data
        const friends = await Promise.all(
            uniqueIds.map(async (friendClerkId) => {
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", friendClerkId))
                    .first();

                if (!user) return null;

                // Get their active pills
                const pills = await ctx.db
                    .query("pills")
                    .withIndex("by_user_active", (q) =>
                        q.eq("user_id", friendClerkId).eq("is_active", true)
                    )
                    .collect();

                // Get this week's entries
                const entries = await ctx.db
                    .query("pill_entries")
                    .withIndex("by_user_date", (q) =>
                        q
                            .eq("user_id", friendClerkId)
                            .gte("date", weekStartStr)
                            .lte("date", weekEndStr)
                    )
                    .collect();

                // Calculate completion %
                const totalGoal = pills.reduce((sum, p) => sum + p.frequency_per_week, 0);
                const totalDone = pills.reduce((sum, pill) => {
                    const pillEntries = entries.filter((e) => e.pill_id === pill._id);
                    const completed = pillEntries.filter((e) => {
                        if (pill.measurement_type === "boolean") return e.value === 1;
                        return e.value >= pill.target_value;
                    });
                    return sum + completed.length;
                }, 0);

                const completionPct = totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;

                // Build week dots (Sun-Sat for current week)
                const weekDots: ("done" | "miss" | "pending")[] = [];
                for (let d = 0; d < 7; d++) {
                    const date = new Date(weekStart);
                    date.setUTCDate(weekStart.getUTCDate() + d);
                    const dateStr = date.toISOString().split("T")[0];

                    if (date > now) {
                        weekDots.push("pending");
                    } else {
                        const dayEntries = entries.filter((e) => e.date === dateStr);
                        const anyCompleted = dayEntries.some((e) => {
                            const pill = pills.find((p) => p._id === e.pill_id);
                            if (!pill) return false;
                            if (pill.measurement_type === "boolean") return e.value === 1;
                            return e.value >= pill.target_value;
                        });
                        weekDots.push(anyCompleted ? "done" : "miss");
                    }
                }

                // Primary habit = pill with most entries or first active
                const primaryHabit = pills[0]?.name ?? "—";

                // Current streak (max across pills)
                const maxStreak = pills.reduce(
                    (max, p) => Math.max(max, p.current_streak),
                    0
                );

                return {
                    clerkId: friendClerkId,
                    name: user.name,
                    handle: user.handle ? `@${user.handle}` : `@${user.name.toLowerCase()}`,
                    completionPct,
                    streakWeeks: maxStreak,
                    primaryHabit,
                    weekDots,
                };
            })
        );

        return friends.filter(Boolean);
    },
});
