import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAnalyticsData = query({
    args: {
        startDate: v.string(),
        endDate: v.string(),
        timeRange: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const userId = identity.subject;

        // 1. Fetch all active pills for the user
        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active", (q) =>
                q.eq("user_id", userId).eq("is_active", true)
            )
            .collect();

        // 2. Fetch all entries for the user to calculate true weekly streaks
        // (Since daily streaks aren't being persisted/updated correctly, we calculate on the fly for accuracy)
        const allEntries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", (q) => q.eq("user_id", userId))
            .collect();

        const entriesInRange = allEntries.filter(e => e.date >= args.startDate && e.date <= args.endDate);
        const pillMap = new Map(pills.map((p) => [p._id, p]));
        const activeCount = pills.length;

        // Calculate Stats
        let totalCompletedEntries = 0;
        const streakValues: number[] = [];
        let bestStreak = 0;

        // Helper to check completion (returns ratio 0-1)
        const getCompletionValue = (entry: any, pill: any) => {
            if (pill.measurement_type === 'boolean') {
                return entry.value === 1 ? 1 : 0;
            } else {
                return Math.min(1, entry.value / pill.target_value);
            }
        };

        const isEntryCompleted = (entry: any, pill: any) => {
            return getCompletionValue(entry, pill) === 1;
        };

        // Helpers for logic
        const getWeekStart = (dateStr: string) => {
            const date = new Date(dateStr);
            const day = date.getDay();
            const diff = date.getDate() - day;
            const sunday = new Date(date.setDate(diff));
            return sunday.toISOString().split('T')[0];
        };

        const today = new Date().toISOString().split('T')[0];
        const currentWeekStart = getWeekStart(today);

        // Date-wise aggregation (using entriesInRange)
        const dateMap = new Map<string, { total: number; completed: number }>();

        // Pre-fill dateMap with all dates in range
        const [sYear, sMonth, sDay] = args.startDate.split('-').map(Number);
        const [eYear, eMonth, eDay] = args.endDate.split('-').map(Number);

        const iterDate = new Date(Date.UTC(sYear, sMonth - 1, sDay));
        const endDay = new Date(Date.UTC(eYear, eMonth - 1, eDay));

        while (iterDate <= endDay) {
            const dateStr = iterDate.toISOString().split('T')[0];
            dateMap.set(dateStr, { total: activeCount, completed: 0 });
            iterDate.setUTCDate(iterDate.getUTCDate() + 1);
        }


        entriesInRange.forEach((entry) => {
            const pill = pillMap.get(entry.pill_id);
            if (!pill) return;

            const completionValue = getCompletionValue(entry, pill);

            const dateStats = dateMap.get(entry.date);
            if (dateStats && completionValue > 0) {
                dateStats.completed += completionValue;
                totalCompletedEntries += completionValue;
            }
        });


        // Habit Performance & Weekly Streak Calculation
        const habitPerformance = pills.map((pill) => {
            const pillEntriesInRange = entriesInRange.filter((e) => e.pill_id === pill._id);
            const allPillEntries = allEntries.filter((e) => e.pill_id === pill._id);

            // Calculate Weeks Completed logic
            const weeksMap = new Map<string, number>();
            allPillEntries.forEach(e => {
                if (isEntryCompleted(e, pill)) {
                    const ws = getWeekStart(e.date);
                    weeksMap.set(ws, (weeksMap.get(ws) || 0) + 1);
                }
            });

            // Calculate current weekly streak
            let currentWeeklyStreak = 0;
            let checkDate = new Date(currentWeekStart);

            // Check if current week is met OR if we should start counting from last week
            const currentWeekCount = weeksMap.get(currentWeekStart) || 0;
            const currentWeekMet = currentWeekCount >= pill.frequency_per_week;

            if (currentWeekMet) {
                currentWeeklyStreak = 1;
            }

            // Go backwards from last week
            let backCheck = new Date(checkDate);
            backCheck.setDate(backCheck.getDate() - 7);

            while (true) {
                const ws = backCheck.toISOString().split('T')[0];
                const count = weeksMap.get(ws) || 0;
                if (count >= pill.frequency_per_week) {
                    currentWeeklyStreak++;
                    backCheck.setDate(backCheck.getDate() - 7);
                } else {
                    break;
                }
            }

            // Calculate Longest Weekly Streak
            let longestWeeklyStreak = 0;
            let runningStreak = 0;
            const sortedWeeks = Array.from(weeksMap.keys()).sort();
            if (sortedWeeks.length > 0) {
                let firstWeek = new Date(sortedWeeks[0]);
                let lastWeek = new Date(sortedWeeks[sortedWeeks.length - 1]);
                let iter = new Date(firstWeek);
                while (iter <= lastWeek) {
                    const ws = iter.toISOString().split('T')[0];
                    const count = weeksMap.get(ws) || 0;
                    if (count >= pill.frequency_per_week) {
                        runningStreak++;
                        if (runningStreak > longestWeeklyStreak) longestWeeklyStreak = runningStreak;
                    } else {
                        runningStreak = 0;
                    }
                    iter.setDate(iter.getDate() + 7);
                }
            }

            const completedWeight = pillEntriesInRange.reduce((acc, e) => acc + getCompletionValue(e, pill), 0);

            // Calculate goal based on frequency_per_week
            const totalDaysInRange = dateMap.size || 1;
            const pillGoal = (pill.frequency_per_week / 7) * totalDaysInRange;

            // Rate is (actual weight / goal), capped at 100%
            const rate = pillGoal > 0
                ? Math.min(100, (completedWeight / pillGoal) * 100)
                : 0;

            streakValues.push(currentWeeklyStreak);
            if (longestWeeklyStreak > bestStreak) {
                bestStreak = longestWeeklyStreak;
            }

            return {
                id: pill._id,
                name: pill.name,
                completionRate: rate,
                currentStreak: currentWeeklyStreak,
                status: rate > 90 ? 'Good' : rate > 70 ? 'Rack Disciprin' : 'Dishonor',
                lifetimeStats: {
                    totalCompleted: allPillEntries.filter(e => isEntryCompleted(e, pill)).length,
                    completionRate: (() => {
                        const daysSinceCreation = Math.max(1, (Date.now() - pill.created_at) / (1000 * 60 * 60 * 24));
                        const expected = daysSinceCreation * (pill.frequency_per_week / 7);
                        if (expected <= 0) return 0;
                        const actual = allPillEntries.reduce((acc, e) => acc + getCompletionValue(e, pill), 0);
                        return Math.min(100, (actual / expected) * 100);
                    })(),
                    // Added for global aggregation
                    expected: (() => {
                        const daysSinceCreation = Math.max(1, (Date.now() - pill.created_at) / (1000 * 60 * 60 * 24));
                        return daysSinceCreation * (pill.frequency_per_week / 7);
                    })(),
                    actual: allPillEntries.reduce((acc, e) => acc + getCompletionValue(e, pill), 0)
                }
            };
        });

        // Overall Completion Rate calculation
        // Calculate average of all individual pill completion rates
        const overallCompletionRate = habitPerformance.length > 0
            ? habitPerformance.reduce((acc, curr) => acc + curr.completionRate, 0) / habitPerformance.length
            : 0;


        // Chart Data formatting - Group by week if range is 'M' or 'Y'
        let chartData;
        if (args.timeRange === 'W' || !args.timeRange) {
            chartData = Array.from(dateMap.entries())
                .map(([date, stats]) => ({
                    date,
                    completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                }))
                .sort((a, b) => a.date.localeCompare(b.date));
        } else {
            // Group by week
            const weekStatsMap = new Map<string, { total: number; completed: number }>();
            Array.from(dateMap.entries()).forEach(([date, stats]) => {
                const ws = getWeekStart(date);
                const current = weekStatsMap.get(ws) || { total: 0, completed: 0 };
                weekStatsMap.set(ws, {
                    total: current.total + stats.total,
                    completed: current.completed + stats.completed
                });
            });

            chartData = Array.from(weekStatsMap.entries())
                .map(([date, stats]) => ({
                    date,
                    completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                }))
                .sort((a, b) => a.date.localeCompare(b.date));
        }

        const currentStreak = streakValues.length > 0 ? Math.max(...streakValues) : 0;

        return {
            overallCompletionRate,
            totalHabitsCompleted: totalCompletedEntries,
            activeHabitsCount: pills.length,
            currentStreak,
            bestStreak,
            chartData,
            streakDistribution: streakValues,
            habitPerformance
        };
    },
});
