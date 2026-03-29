# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

### Linear
- API Key: sourced from `/home/x/.env` as `LINEAR_API_KEY`
- Usage: `set -a && source /home/x/.env && set +a` then use `curl` with `Authorization: $LINEAR_API_KEY` against `https://api.linear.app/graphql`
- Use for: creating/updating issues, querying project status, reading comments

### GitHub
- CLI auth available via `gh` (user: bradleyzaia)

### Playwright (Headless Browser)
- Available on VPS for self-testing
- `const { chromium } = require('/home/x/.npm-global/lib/node_modules/playwright');`
- Full docs: `/home/x/shared/PLAYWRIGHT.md`
- Use for: verifying own work, screenshots, browser automation
