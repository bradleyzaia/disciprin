# HANDOFF.md — Friend Progress Feature

**Date:** 2026-02-11  
**Last session:** Full feature sprint with Bradley + Albert

---

## Current State

The **Friend Progress** feature is live on prod (disciprin.com/friends). Core functionality works:

- ✅ Friends page with v18 (Ticker/Motion-First) design
- ✅ Add/accept/reject/remove friends via @handle or name search
- ✅ Friend profile modal with stats
- ✅ @handle field on users (backfill ran, onboarding + settings wired)
- ✅ Schema deployed to Convex prod
- ✅ Frontend deployed to Cloudflare Pages

## What's Left

### Immediate
- **Test the full flow** — Bradley sent a friend request to @samuraii_senseii, waiting for acceptance
- **HFS-529** partially done — handle UI exists but validation edge cases may need testing

### Deferred (v2)
- **HFS-531** — Pill visibility / privacy controls (per-pill toggle for what friends can see)
- **HFS-532** — Progress events generation (streak milestones, weekly completions, entry milestones for the feed)
- Leaderboards, group challenges, notifications, chat/comments

## Key Files

| Path | What |
|------|------|
| `documentation/feature-friend-progress.md` | Feature spec |
| `convex/schema.ts` | Schema (users handle + friends table) |
| `convex/friends/` | All Convex queries + mutations |
| `src/pages/Friends.tsx` | Friends page |
| `src/components/friends/` | All friend components (atomic design) |
| `src/lib/mock-friends.ts` | Types + helpers (mock data no longer used) |
| `prototypes/friend-progress/` | 20 HTML prototypes + index |

## Deployment Commands

```bash
# Convex to prod
npx convex deploy --env-file .env.production -y

# Frontend to prod
npm run build && npx wrangler pages deploy dist --commit-dirty=true --branch=main
```

## FEA Pattern

To spawn a Front End Agent:
```
sessions_spawn with this system prompt prefix:
"You are a UI/UX designer and senior front end engineer with 30 years of experience in TypeScript, React, React Three Fiber, Tailwind, Framer Motion..."
```
See `memory/2026-02-11.md` for full details.

## People

- **Bradley** — makes decisions, reviews on prod
- **Albert** — interested in agent tooling, gives UI feedback
- **kl** (@samuraii_senseii) — originated the feature, hasn't reviewed prototypes yet

## Gotchas

- Convex dev deployment missing `CLERK_ISSUER_URL` — always use `--env-file .env.production` for deploys
- File permissions can break — `sudo chown -R $(whoami)` on node_modules/dist/.git/.wrangler as needed
- Preview deploys won't work because Clerk auth only allows prod domain
