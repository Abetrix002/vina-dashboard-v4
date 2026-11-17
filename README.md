# VINA Dashboard V4

V3 plus the 17 Nov 2026 iCAUR changes:
- New VINA logo (gradient speech bubble, from `VINA/New Logo/Vina - Logos/Vina- Logo.svg`) across the dashboard.
- Instagram removed: channel, filters, sample leads, assignment rule, setup and Connections. C5 is now Facebook Messenger only.
- Sales agents have no call option (web chat and WhatsApp only). Call centre still calls. Sales next steps read "Follow up", not "Call".
- Calmer layout: body 15px and nothing under 12px, more space between and inside cards, and explanatory sub-lines removed from the Manager reports (for example the step descriptions in From conversation to sale).
- `flows.mjs` checks that Sales has no call button and Instagram appears on no screen.


Clickable prototype of all 49 screens in the VINA Dashboard Screen Brief v1.2: login, Manager dashboard, Agent dashboard, leads, lead assignment and the control panel, in light and dark. Sample data only (iCaur Alghanim, Jeddah; "now" is Sat 7 Nov 2026, 4:50 PM).

## Build and check

```
python3 -I build.py        # dist/index.html (artifact page) + site/index.html (standalone, deployed)
node check.mjs             # headless Chrome: every screen × state × 4 widths, plus flows.mjs
```

`check.mjs` takes `PORT=` (parallel runs) and `SHOT="M1:1440:light,AG1:390:dark" SHOTDIR=…` for screenshots.

## Layout

- `src/core.css`, `src/core.js` — tokens, components, motion, router, sample data, shell and menus per role
- `src/views/*.js` — one module per area (login, manager, agent, leads, assignment, setup, agents, control panel)
- `src/zz-boot.js` — screen index and start-up
- `DESIGN-V2.md` — design direction, IA, motion and state rules

## Deploy

Static site from `site/` (see `vercel.json`, noindex). `npx vercel deploy --prod --yes` from this folder.
