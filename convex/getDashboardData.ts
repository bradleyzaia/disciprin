import { query } from "./_generated/server";
import { v } from "convex/values";

export default query({
    args: {
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { pills: [], entries: [] };
        }
        const userId = identity.subject;

        // Fetch all active pills
        const pills = await ctx.db
            .query("pills")
            .withIndex("by_user_active", q => q.eq("user_id", userId).eq("is_active", true))
            .collect();

        // Fetch entries within range
        const entries = await ctx.db
            .query("pill_entries")
            .withIndex("by_user_date", q => q
                .eq("user_id", userId)
                .gte("date", args.startDate)
                .lte("date", args.endDate)
            )
            .collect();

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
            entries: enrichedEntries
        };
    },
});
