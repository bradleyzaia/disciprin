# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

### Linear
- API Key: sourced from `/home/x/.env` as `LINEAR_API_KEY`
- Usage: `set -a && source /home/x/.env && set +a` then use `curl` with `Authorization: $LINEAR_API_KEY` against `https://api.linear.app/graphql`
- Use for: creating/updating issues, querying project status, reading comments

### GitHub
- CLI auth available via `gh` (user: bradleyzaia)

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
