# Feature Spec: Friend Progress Feed

**Author:** Disciprin Bot  
**Date:** 2026-02-11  
**Status:** Draft  
**Origin:** @kl suggestion in group chat

---

## Problem

Disciprin is currently a solo experience. Users track pills and streaks in isolation. There's no social layer — no way to see how friends are doing, no shared accountability, and no positive peer pressure to stay consistent.

## Proposal

Add a **Friend Progress** view where users can see their friends' activity — streaks, completion rates, and recent check-ins. Think "fitness app activity feed" but for pills.

---

## Core Concepts

### Friends
- Users can add friends via invite link or username search
- Friend requests require mutual acceptance (no one-way follows)
- Users control what's visible to friends (opt-in per pill)

### Progress Feed
A feed showing friends' recent activity:
- **Streak updates** — "Kyle hit a 12-week streak on Meditation 🔥"
- **Weekly completion** — "Bradley completed 6/7 pills this week"
- **Milestones** — "Anna reached 100 total entries"

No granular daily data exposed by default — just aggregates and milestones.

### Leaderboard (Optional)
- Weekly completion % ranked among friends
- Streak leaderboards per category (Physical, Mental, etc.)
- Opt-in only — not everyone wants to compete

---

## Data Model Changes

```
// User table change
users: {
  + handle: v.optional(v.string()),  // Unique @handle, e.g. "bradley"
  + .index("by_handle", ["handle"])
}

// New tables

friends: defineTable({
  user_id: v.string(),          // Clerk ID of requester
  friend_id: v.string(),       // Clerk ID of target
  status: v.string(),          // 'pending' | 'accepted' | 'blocked'
  created_at: v.number(),
  accepted_at: v.optional(v.number()),
})
  .index("by_user_status", ["user_id", "status"])
  .index("by_friend_status", ["friend_id", "status"])
  .index("by_pair", ["user_id", "friend_id"])

// Shared progress — precomputed for the feed
friend_progress_events: defineTable({
  user_id: v.string(),          // Who achieved this
  event_type: v.string(),       // 'streak_milestone' | 'weekly_complete' | 'entry_milestone'
  pill_id: v.optional(v.id("pills")),
  pill_name: v.optional(v.string()),   // Denormalized
  value: v.number(),            // Streak count, completion %, entry count
  period_start: v.optional(v.string()),
  created_at: v.number(),
})
  .index("by_user_created", ["user_id", "created_at"])

// Privacy controls
pill_visibility: defineTable({
  pill_id: v.id("pills"),
  user_id: v.string(),
  visible_to_friends: v.boolean(),  // Default: true for new pills
})
  .index("by_pill", ["pill_id"])
  .index("by_user", ["user_id"])
```

---

## Privacy & Controls

| Setting | Default | Description |
|---------|---------|-------------|
| Profile visible to friends | ✅ On | Friends can see your name & overall stats |
| Per-pill visibility | ✅ On | Toggle individual pills from friend view |
| Show on leaderboard | ❌ Off | Opt-in to ranked comparisons |
| Show streaks | ✅ On | Friends see your streak milestones |

Users can hide everything and still have friends (for future features like group challenges).

---

## UX Flow

### Adding Friends
1. Go to Settings → Friends
2. Search by @handle
3. Other user accepts → mutual connection

*Note: Users need a unique @handle. Added during onboarding or in settings.*

### Viewing Progress
1. New tab in bottom nav: **Friends** (or icon in header)
2. Feed of recent friend activity, newest first
3. Tap a friend → see their public profile (visible pills, streaks, weekly stats)

### Notifications (Future)
- Push/email when a friend hits a milestone
- Weekly digest: "Here's how your crew did this week"

---

## MVP Scope (v1)

**Include:**
- [ ] Friend requests (add/accept/remove)
- [ ] Basic progress feed (streaks + weekly completion)
- [ ] Per-pill visibility toggle
- [ ] Friend profile view

**Exclude (v2+):**
- Leaderboards
- Group challenges
- Notifications/digests
- Chat/comments on progress

---

## Decisions

1. **Invite mechanism** — Username search via @handles. Introduce handles as a new user field.
2. **Friend limit** — No limit.
3. **Feed order** — Chronological for now. Can revisit ranking later.
4. **Anonymous mode** — Deferred / not in scope.

---

## Why This Matters

Solo accountability works for some people. But most of us are wired for social reinforcement. Seeing a friend's 8-week streak makes you not want to break yours. That's the whole point of Disciprin — discipline — and friends make it stick.
