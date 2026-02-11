import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get a friend's profile with visible pills, streaks, week dots, and overall stats.
 * Only works if the viewer and target are accepted friends.
 */
export default query({
    args: {
        friendClerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const userId = identity.subject;

        // Verify friendship exists and is accepted
        const sent = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", userId).eq("friend_id", args.friendClerkId))
            .first();

        const received = await ctx.db
            .query("friends")
            .withIndex("by_pair", (q) => q.eq("user_id", args.friendClerkId).eq("friend_id", userId))
            .first();

        const friendship = sent || received;
        if (!friendship || friendship.status !== "accepted") return null;

        // Get friend user data
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.friendClerkId))
            .first();

        if (!user) return null;

        // Get active pills
        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active", (q) =>
                q.eq("user_id", args.friendClerkId).eq("is_active", true)
            )
            .collect();

        // Current week boundaries
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        const weekStart = new Date(now);
        weekStart.setUTCDate(now.getUTCDate() - dayOfWeek);
        weekStart.setUTCHours(0, 0, 0, 0);
        const weekStartStr = weekStart.toISOString().split("T")[0];
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        const weekEndStr = weekEnd.toISOString().split("T")[0];

        // This week's entries
        const weekEntries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", (q) =>
                q.eq("user_id", args.friendClerkId).gte("date", weekStartStr).lte("date", weekEndStr)
            )
            .collect();

        // All entries for total count
        const allEntries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", (q) => q.eq("user_id", args.friendClerkId))
            .collect();

        // Build pill details with streaks and completion
        const pillDetails = pills.map((pill) => {
            const thisWeekEntries = weekEntries.filter((e) => e.pill_id === pill._id);
            const completedCount = thisWeekEntries.filter((e) =>
                pill.measurement_type === "boolean" ? e.value === 1 : e.value >= pill.target_value
            ).length;
            const completionPct =
                pill.frequency_per_week > 0
                    ? Math.round((completedCount / pill.frequency_per_week) * 100)
                    : 0;

            return {
                name: pill.name,
                category: pill.category ?? "OTHER",
                currentStreak: pill.current_streak,
                longestStreak: pill.longest_streak,
                completionPct: Math.min(completionPct, 100),
                frequencyPerWeek: pill.frequency_per_week,
                completedThisWeek: completedCount,
            };
        });

        // Week dots (Sun-Sat)
        const weekDots: ("done" | "miss" | "pending")[] = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(weekStart);
            date.setUTCDate(weekStart.getUTCDate() + d);
            const dateStr = date.toISOString().split("T")[0];

            if (date > now) {
                weekDots.push("pending");
            } else {
                const dayEntries = weekEntries.filter((e) => e.date === dateStr);
                const anyCompleted = dayEntries.some((e) => {
                    const pill = pills.find((p) => p._id === e.pill_id);
                    if (!pill) return false;
                    return pill.measurement_type === "boolean"
                        ? e.value === 1
                        : e.value >= pill.target_value;
                });
                weekDots.push(anyCompleted ? "done" : "miss");
            }
        }

        // Overall stats
        const longestStreak = pills.reduce((max, p) => Math.max(max, p.longest_streak), 0);
        const currentStreak = pills.reduce((max, p) => Math.max(max, p.current_streak), 0);

        // Weekly completion %
        const totalGoal = pills.reduce((s, p) => s + p.frequency_per_week, 0);
        const totalDone = pills.reduce((s, pill) => {
            const pe = weekEntries.filter((e) => e.pill_id === pill._id);
            return (
                s +
                pe.filter((e) =>
                    pill.measurement_type === "boolean" ? e.value === 1 : e.value >= pill.target_value
                ).length
            );
        }, 0);
        const weeklyCompletionPct = totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;

        return {
            clerkId: args.friendClerkId,
            name: user.name,
            handle: user.handle ? `@${user.handle}` : `@${user.name.toLowerCase()}`,
            pills: pillDetails,
            weekDots,
            stats: {
                totalEntries: allEntries.length,
                longestStreak,
                currentStreak,
                weeklyCompletionPct,
                activePills: pills.length,
            },
            friendSince: friendship.accepted_at ?? friendship.created_at,
        };
    },
});
