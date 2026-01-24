import { query } from "./_generated/server";
import { v } from "convex/values";
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";

export default query({
    args: {
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { pills: [], entries: [], globalStreak: 0 };
        }
        const userId = identity.subject;

        // Fetch all active pills
        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active", q => q.eq("user_id", userId).eq("is_active", true))
            .collect();

        // Fetch entries within range (for View)
        const entries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", q => q
                .eq("user_id", userId)
                .gte("date", args.startDate)
                .lte("date", args.endDate)
            )
            .collect();

        // --- Calculate Global Active Streak ---
        // Definition: Continuous streak of weeks where ALL active pills met their goals.
        // We assume "Active Streak" considers only currently active pills.

        // 1. Fetch history for streak (last ~1 year to be safe/performant)
        const streakHorizonDate = new Date();
        streakHorizonDate.setDate(streakHorizonDate.getDate() - 365);
        const streakStartDateStr = streakHorizonDate.toISOString().split('T')[0];

        const historyEntries = await ctx.db.query("pill_entries")
            .withIndex("by_user_date", q => q
                .eq("user_id", userId)
                .gte("date", streakStartDateStr)
            )
            .collect();

        // 2. Logic
        let globalStreak = 0;
        const today = new Date();

        // Helper to check if a specific week was "perfect"
        const isWeekPerfect = (dateInWeek: Date) => {
            const start = startOfWeek(dateInWeek, { weekStartsOn: 0 }); // Sunday
            const end = endOfWeek(dateInWeek, { weekStartsOn: 0 });

            // Check each active pill
            for (const pill of pills) {
                // Find relevant entries
                const relevantEntries = historyEntries.filter(e => {
                    if (e.pill_id !== pill._id) return false;
                    const entryDate = new Date(e.date);
                    return isWithinInterval(entryDate, { start, end });
                });

                const completedWeight = relevantEntries.reduce((acc, e) => {
                    if (pill.measurement_type === 'boolean') {
                        return acc + (e.value === 1 ? 1 : 0);
                    } else {
                        return acc + Math.min(1, e.value / pill.target_value);
                    }
                }, 0);

                if (completedWeight < pill.frequency_per_week) {
                    return false; // This pill failed
                }
            }
            return true; // All pills passed
        };

        // Check Current Week
        // If current week is perfect so far (met), we count it.
        // If not met yet, we don't count it, but we don't break the streak from previous weeks.
        if (pills.length > 0 && isWeekPerfect(today)) {
            globalStreak++;
        }

        // Check Past Weeks
        if (pills.length > 0) {
            for (let i = 1; i <= 52; i++) {
                const pastDate = subWeeks(today, i);
                if (isWeekPerfect(pastDate)) {
                    globalStreak++;
                } else {
                    break; // Streak broken
                }
            }
        }

        const pillMap = new Map(pills.map(p => [p._id, p]));

        const enrichedEntries = entries.map(e => {
            const pill = pillMap.get(e.pill_id);
            let is_completed = false;
            if (pill) {
                if (pill.measurement_type === 'boolean') {
                    is_completed = e.value === 1;
                } else {
                    is_completed = e.value >= pill.target_value;
                }
            }

            return {
                pill_id: e.pill_id,
                date: e.date,
                value: e.value,
                is_completed
            };
        });

        const mappedPills = pills.map(p => ({
            id: p._id,
            name: p.name,
            target_value: p.target_value,
            unit: p.unit,
            measurement_type: p.measurement_type as 'time' | 'quantity' | 'boolean',
            frequency_per_week: p.frequency_per_week,
            current_streak: p.current_streak
        }));

        return {
            pills: mappedPills,
            entries: enrichedEntries,
            globalStreak
        };
    },
});
