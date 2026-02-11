import { query } from "../_generated/server";

/**
 * Get a live feed of friend activity — recent pill entries from accepted friends.
 * Returns the latest 20 events sorted by recency.
 */
export default query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const userId = identity.subject;

        // Get accepted friend IDs (both directions)
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
                userId, // Include self
            ]),
        ];

        // Get recent entries from all friends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString().split("T")[0];

        const allEntries: Array<{
            userId: string;
            pillName: string;
            value: number;
            targetValue: number;
            measurementType: string;
            date: string;
            createdAt: number;
        }> = [];

        for (const friendId of friendIds) {
            const entries = await ctx.db
                .query("pill_entries")
                .withIndex("by_user_date", (q) =>
                    q.eq("user_id", friendId).gte("date", cutoffDate)
                )
                .collect();

            for (const entry of entries) {
                const pill = await ctx.db.get(entry.pill_id);
                if (!pill) continue;

                allEntries.push({
                    userId: friendId,
                    pillName: pill.name,
                    value: entry.value,
                    targetValue: pill.target_value,
                    measurementType: pill.measurement_type,
                    date: entry.date,
                    createdAt: entry.created_at,
                });
            }
        }

        // Sort by most recent first
        allEntries.sort((a, b) => b.createdAt - a.createdAt);

        // Build feed items with user names
        const feed = await Promise.all(
            allEntries.slice(0, 20).map(async (entry) => {
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", entry.userId))
                    .first();

                const isCompleted =
                    entry.measurementType === "boolean"
                        ? entry.value === 1
                        : entry.value >= entry.targetValue;

                const name = entry.userId === userId ? "You" : (user?.name ?? "Unknown");

                // Time ago
                const msAgo = Date.now() - entry.createdAt;
                const hoursAgo = Math.floor(msAgo / (1000 * 60 * 60));
                const daysAgo = Math.floor(hoursAgo / 24);
                const timeAgo =
                    daysAgo > 0
                        ? `${daysAgo}d ago`
                        : hoursAgo > 0
                            ? `${hoursAgo}h ago`
                            : "just now";

                return {
                    id: `${entry.userId}-${entry.date}-${entry.pillName}`,
                    name,
                    action: isCompleted ? `completed ${entry.pillName}` : `logged ${entry.pillName}`,
                    highlight: isCompleted ? "✓" : `${entry.value}/${entry.targetValue}`,
                    highlightColor: isCompleted
                        ? ("green" as const)
                        : entry.value > 0
                            ? ("yellow" as const)
                            : ("pink" as const),
                    timeAgo,
                };
            })
        );

        return feed;
    },
});
