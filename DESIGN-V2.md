# VINA Dashboard V2 · design direction

V1 (artifact D7aGmC8NoWabXewcBPtH5u) proved the brief: all 49 screens work, roles and view-only rules hold, every action is logged. V2 keeps every behaviour and fixes how it looks, reads and feels.

## 1. What each person needs from a glance (strategy)

| Person | Their moment | The one question the first screen must answer | V1 problem |
|---|---|---|---|
| Manager (Khalid) | Between meetings, 30 seconds, often on a phone | "Is anyone waiting, and is VINA doing its job?" | M1 opens with 9 equal number tiles; the waiting banner competes with them |
| Call centre (Reem) | A queue, headset on, one hand on the mouse | "Who do I call next, and what do they want?" | Callbacks is good on desktop; on a phone the day strip pushes the list off screen |
| Sales (Majed) | Between showroom visits | "Which of my leads need me today?" | My leads opens on a 9-column table with 8 filter boxes |
| VINA team (Lina) | Setting up and fixing clients | "Is this client healthy, and what do I change?" | 13 flat menu items; control panel not grouped |

Guiding principles: **the next action first**, **teal means VINA did it**, **calm until something needs you**, **motion explains change, never decorates**.

## 2. What works (keep)
- Role menus, view-only enforcement, agents-only-their-work, history on every action.
- Status chips with words and the LD5 colours; channel icons; Arabic shown right-to-left.
- Empty / loading / error versions on every screen; undo on send-to-sales and pipeline moves.
- The test loop in the control panel (scenarios block saving and go-live).

## 3. What doesn't (fix)
1. **Card soup.** Every block is a white box with the same 1px border and 14px radius, so nothing leads. Fix: two surface levels, borders only where needed, one hero per page.
2. **No motion at all.** State changes snap. No feedback when a lead moves, a number changes, a dialog opens or closes. And V1 replays the entry animation of a dialog on every click inside it. Fix: motion system below, animations only on first appearance.
3. **Header clutter.** Search, presence, bell, theme and language all get equal weight; the language button only shows a message (a dead end). A menu button showed on desktop. Fix: search becomes a command palette (Ctrl/⌘ K), theme and language move into a profile menu.
4. **Type has no voice.** Inter at one scale everywhere; big numbers look like body text. Brand is Gotham: use Montserrat (closest free stand-in) for headings and numbers, Inter for UI.
5. **Prototype pill covers the signed-in person** at the bottom of the menu. Fix: person moves to the header profile button.
6. **Leads list is heavy.** 8 filter selects always open; 9 columns squeeze the VINA summary. Fix: search + "Filters" button with active filter chips; summary column gets room.
7. **Pipeline wastes space.** Empty columns take full width; "Move to…" select on every card. Fix: compact empty columns; "Move to" becomes a small menu button on the card.
8. **Funnel (M4) reads as a bar list**; numbers glued to percentages. Fix: a real funnel with aligned counts and step-to-step %.
9. **Inbox chat header wraps** at 1440 ("Close lead" on its own line) and duplicates the customer panel's buttons. Fix: header keeps Take over / Hand back + Call; panel keeps Send to sales, Book test drive, Close lead.
10. **Assignment rule cards** carry 5 controls each. Fix: order number + name + switch visible; Edit, Move and Delete in a row menu; drag handle stays.
11. **Conversations (M3)** spends a 190 px column on 4 folders and 3 rows on filters. Fix: folders as tabs over the list, filters in a popover.

## 4. Information architecture
- Manager: Overview · Channels · Conversations · Leads · Call centre and sales · Customer ratings (unchanged, brief section 2).
- Agents: unchanged (Inbox · Callbacks · My leads / Inbox · My leads · Test drives).
- VINA team: **Reports** (6 as manager) · **Agent** (Agents, Actions, Test scenarios) · **Leads routing** (Assignment rules: tabs When a lead is qualified · Rules · Unassigned) · **Workspace** (Connections, Users, Settings incl. Plan and usage tab).
- Unassigned leads live in one place (Leads routing for VINA, a saved view in Leads for managers). The Overview banner links there.
- Command palette finds people (name or mobile), pages and quick actions for the signed-in role only.

## 5. Visual system
- **Surfaces:** page `--bg`, card `--card` (raised by shadow `--e1`, border only in dark mode or tables), inset `--sub`.
- **Radius:** 8 (controls) · 12 (cards inner) · 16 (cards) · 20 (dialogs).
- **Type:** `--f-display` Montserrat 600/700 for page titles, card titles, big numbers; `--f` Inter for everything else; IBM Plex Sans Arabic for Arabic. Scale 12/13/14/16/20/24/32/40.
- **Colour:** brand navy #202253, horizon #5E97CE, aqua #6EBEB9; LD5 status colours unchanged; red only for overdue and errors; amber for waiting.
- **Signature:** the VINA thread — anything VINA did carries the teal mark (bubble gradient avatar, teal summary block, teal event pills). Live counts that need people (waiting now, overdue) get a soft pulsing dot.

## 6. Motion system (all honour prefers-reduced-motion)
| Token | Value | Use |
|---|---|---|
| `--ease` | cubic-bezier(.2,.8,.2,1) | most movement |
| `--spring` | cubic-bezier(.34,1.4,.64,1) | switches, pops, dialogs in |
| `--d1/--d2/--d3/--d4` | 120 / 200 / 320 / 520 ms | hover / press, toggles / dialogs / page entry |

Choreography:
- **Page entry** (route change only, never on re-render): sections fade up 8 px, staggered 40 ms. Big numbers count up (600 ms). Bars grow from their baseline, lines draw.
- **Dialogs:** scale .96 → 1 with fade in; fade + scale out 140 ms (exit is kept even though the page re-renders). Drawers slide.
- **Toasts** slide up with a thin bar that runs down the undo window. **Alerts** slide in from the right with a spring; the bell rings once.
- **Lists:** a lead that just changed flashes its row softly (`flash(id)`); a sent chat message rises in.
- **Buttons** press to .97; cards that open something lift 2 px on hover; switches spring.

## 7. State inventory (fortify)
| State | Rule |
|---|---|
| Empty | Says what will appear and the one thing to do next; never a blank card |
| Loading | Skeleton that matches the layout; content fades in |
| Partial | Each card loads and fails on its own; a failed card shows its own Try again |
| Error | What happened + how to fix + Try again; input is never cleared |
| Offline | Global bar: "You're offline. We'll send your changes when you're back." Actions queue (prototype shows the bar) |
| Stale | Report pages show "Updated 2 min ago" and a refresh button |
| Overflow | Names ellipsis with full name on hover; 1,000+ leads paged; badges cap at 99+ |
| Arabic | Arabic text always in dir="rtl" spans; layouts leave 40% room for longer labels |
| Disabled | Every disabled button says why (title + visible reason near it) |

## 8. Research to validate (investigate)
Nothing here is tested with real users yet. Before final designs:
1. **Usability test, 5 per role (20 sessions)** on the clickable V2: manager "who is waiting longest and who has it?", call centre "call the next overdue customer and send them to sales", sales "book a test drive for Lama on Sunday 10 AM", VINA team "fix the failing financing scenario and save".
2. **Contextual inquiry, 2 half-days** at the Madinah Road showroom and the call centre: how leads are worked today (WhatsApp on personal phones? spreadsheets?), what is on screen during a call.
3. **Tree test (30+)** for the VINA team's control panel groups.
4. **Arabic pass** with 3 Arabic-first agents once the developer's RTL build exists.

## 9. Builder rules for V2 modules
- Keep every route, action, modal and behaviour from V1; flows.mjs must still pass.
- Use the new core helpers: `kpi()`, `sectionHead()`, `verdict()`, `flash(id)`, `pulse()`, `countAttr(n)`, `menuBtn()`; motion classes are automatic on route entry (`.enter` on `main`).
- Never add `animation` to elements that re-render on every click unless gated by a one-time class.
- Colours only from tokens. No new borders on cards; use `.card` (raised) or `.card.flat` (inset).

## 10. Builder workflow (for the parallel area passes)
- Project: `~/Downloads/Koraspond/VINA/Design/experience-v2`. One page built from `src/core.css`, `src/core.js`, `src/views/*.js` (one IIFE per area, concatenated into one script), `src/zz-boot.js`.
- Read first: this file, `src/core.js` (top comment = the module contract: `R()`, `A`, `MODALS`, `DRAWERS`, `AFTER`, `bind()`; the V2 helpers block after `const vo =`), `src/core.css` (class names and tokens), then your module(s).
- Edit ONLY your module file(s). Do not edit core, boot, check.mjs, flows.mjs or other modules. If core is missing something, put it in your module (prefixed CSS inside your existing `<style>`; prefixed functions inside your IIFE) and say so in your reply.
- Keep every route name, action name, modal/drawer name, `AFTER` key and behaviour that other modules or `flows.mjs` use.
- Animations: page entry is automatic. Use `.grow-y` (vertical bars), `.grow-x` (horizontal bars), `.draw` with `style="--len:N"` (SVG lines, N ≈ path length), `data-count` via `countAttr()` or `kpi()` for big numbers, `flash(id)` + `flashCls(id)` on a row/card after an action changes it, `pulse()` for live/needs-attention dots, `.lift` on clickable cards. Never put a CSS animation on something that re-renders on every click unless a one-time class gates it.
- Build + check: `python3 -I build.py && PORT=<your port> node check.mjs` (sweep of all 49 screens × states × 4 widths + flows; must print ALL PASS).
- Look at your screens: `PORT=<your port> SHOTDIR=<a folder in /private/tmp/claude-501/-Users-ghazaly/c8d75d70-b626-47b2-a30a-453337b92e00/scratchpad/> SHOT="M1:1440:light,M1:390:dark" node check.mjs` writes PNGs (`<screenId>-<width>-<theme>.png`) you can open with the Read tool. Screen IDs are the brief's (M1, AG1, LD4, S7, C3 …). Look at light and dark, 1440 and 390, fix what looks wrong, look once more.
- Reply with: what you changed per screen (one line each), anything you put in your module that belongs in core, anything you could not do.
