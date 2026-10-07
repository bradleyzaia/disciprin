import { query } from "../_generated/server";

/**
 * Get aggregate crew stats: average completion, top streak, total entries, active count.
 */
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const userId = identity.subject;

        // Get accepted friend IDs
        const sentFriends = await ctx.db
            .query("friends")
            .withIndex("by_user_status", (q) => q.eq("user_id", userId).eq("status", "accepted"))
            .collect();

        const receivedFriends = await ctx.db
            .query("friends")
            .withIndex("by_friend_status", (q) => q.eq("friend_id", userId).eq("status", "accepted"))
            .collect();

        const friendIds = [
            ...new Set([
                ...sentFriends.map((f) => f.friend_id),
                ...receivedFriends.map((f) => f.user_id),
                userId,
            ]),
        ];

        if (friendIds.length === 0) {
            return { crewAvg: 0, topStreak: 0, totalEntries: 0, activeCount: 0, totalCount: 0 };
        }

        // Current week
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        const weekStart = new Date(now);
        weekStart.setUTCDate(now.getUTCDate() - dayOfWeek);
        weekStart.setUTCHours(0, 0, 0, 0);
        const weekStartStr = weekStart.toISOString().split("T")[0];
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        const weekEndStr = weekEnd.toISOString().split("T")[0];

        let totalCompletionPct = 0;
        let topStreak = 0;
        let totalEntries = 0;
        let activeCount = 0;

        for (const memberId of friendIds) {
            const pills = await ctx.db
                .query("pills")
                .withIndex("by_user_active", (q) =>
                    q.eq("user_id", memberId).eq("is_active", true)
                )
                .collect();

            const entries = await ctx.db
                .query("pill_entries")
                .withIndex("by_user_date", (q) =>
                    q.eq("user_id", memberId).gte("date", weekStartStr).lte("date", weekEndStr)
                )
                .collect();

            // All-time entries count
            const allEntries = await ctx.db
                .query("pill_entries")
                .withIndex("by_user_date", (q) => q.eq("user_id", memberId))
                .collect();
            totalEntries += allEntries.length;

            // Completion
            const totalGoal = pills.reduce((s, p) => s + p.frequency_per_week, 0);
            const totalDone = pills.reduce((s, pill) => {
                const pe = entries.filter((e) => e.pill_id === pill._id);
                const completed = pe.filter((e) =>
                    pill.measurement_type === "boolean" ? e.value === 1 : e.value >= pill.target_value
                );
                return s + completed.length;
            }, 0);

            const pct = totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;
            totalCompletionPct += pct;

            if (pct > 0) activeCount++;

            // Streak
            const maxStreak = pills.reduce((m, p) => Math.max(m, p.current_streak), 0);
            if (maxStreak > topStreak) topStreak = maxStreak;
        }

        const crewAvg = Math.round(totalCompletionPct / friendIds.length);

        return {
            crewAvg,
            topStreak,
            totalEntries,
            activeCount,
            totalCount: friendIds.length,
        };
    },
});
