import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Disciprin Data Schema
 * Based on documentation/prd.xml
 *
 * Core Concepts:
 * - Users: Synced from Clerk
 * - Periods: Weekly accountability units (Sunday-Saturday or Monday-Sunday)
 * - Pills: Habits/tasks to track
 * - Pill Entries: Daily logs
 * - Period Pill Summaries: Aggregated stats per pill per period
 * - Journal Entries: Reflections linked to periods
 */

export default defineSchema({
    // User Model
    // Synced from Clerk via webhooks
    users: defineTable({
        clerk_id: v.string(), // Clerk's user ID (sub)
        name: v.string(),
        email: v.string(),
        timezone: v.string(), // e.g., "America/New_York"
        pill_order: v.optional(v.array(v.string())), // Ordered array of pill IDs
        onboarding_completed: v.boolean(),
        created_at: v.number(), // UTC Timestamp
    })
        .index("by_clerk_id", ["clerk_id"])
        .index("by_email", ["email"]),

    // Pill Model
    // A trackable habit or task
    pills: defineTable({
        user_id: v.string(), // Reference to user (clerk_id)
        name: v.string(),
        measurement_type: v.string(), // 'quantity' | 'boolean'
        target_value: v.number(), // Goal value per entry
        unit: v.optional(v.string()), // e.g., 'minutes', 'glasses'
        frequency_per_week: v.number(), // 1-7
        category: v.optional(v.string()), // e.g., 'PHYSICAL', 'MENTAL'
        current_streak: v.number(),
        longest_streak: v.number(),

        is_active: v.boolean(), // Soft deletion flag
        created_at: v.number(), // UTC Timestamp
        deleted_at: v.optional(v.number()), // UTC Timestamp if deleted
    })
        .index("by_user_active", ["user_id", "is_active"])
        .index("by_user_name", ["user_id", "name"]),

    // Pill Entry Model
    // Single day's log for a pill
    pill_entries: defineTable({
        pill_id: v.id("pills"),
        user_id: v.string(), // Reference to user (clerk_id) - Denormalized for query efficiency
        date: v.string(), // YYYY-MM-DD
        value: v.number(), // Logged value
        created_at: v.number(), // UTC Timestamp
        updated_at: v.number(), // UTC Timestamp
    })
        // Unique: One entry per pill per day
        .index("by_pill_date", ["pill_id", "date"])
        .index("by_user_date", ["user_id", "date"]),

    // Period Pill Summary Model
    // Aggregated stats for a pill within a specific period (System Tempo: Sunday-Sunday)
    period_pill_summaries: defineTable({
        period_start_date: v.string(), // YYYY-MM-DD (Sunday)
        pill_id: v.id("pills"),
        user_id: v.string(), // Reference to user (clerk_id)
        entries_count: v.number(), // Number of days logged
        frequency_goal: v.number(), // Snapshot of goal at this time
        frequency_completion_pct: v.number(), // (entries_count / frequency_goal) * 100
        target_completion_pct: v.number(), // Average target completion
        goal_met: v.boolean(), // Whether frequency goal was met
        updated_at: v.number(), // UTC Timestamp
    })
        // Unique: One summary per pill per weekly period
        .index("by_period_start_pill", ["period_start_date", "pill_id"])
        .index("by_user_pill", ["user_id", "pill_id"]),

    // Journal Entry Model
    // Reflection entry associated with a time window
    journal_entries: defineTable({
        user_id: v.string(), // Reference to user (clerk_id)
        period_type: v.string(), // 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
        date: v.string(), // Specific date or start date of period
        title: v.optional(v.string()),
        content: v.string(), // Free-form text
        created_at: v.number(), // UTC Timestamp
        updated_at: v.number(), // UTC Timestamp
    })
        // Unique: One entry per period_type + date per user
        .index("by_user_type_date", ["user_id", "period_type", "date"]),
});
