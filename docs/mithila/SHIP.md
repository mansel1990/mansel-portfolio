# Mithila Upgrade — Daily Pickup Doc

**Read this first every session.**

Architecture: [`implementation/03-implementation-source-of-truth.md`](implementation/03-implementation-source-of-truth.md).

---

## Vision

Mario-style exploration across **10 colored biomes**: free move, coins, hidden tunnels, jumps, two action beats. Gate trials are **photo + music only**. Start screen = same hyd question in game theme. End gallery at `/mithila/gallery`. Progress in `localStorage["mithila:v3"]`.

---

## How to resume

1. Open this file → **Current status** + last **Status Log** row.
2. Dev: `npm run dev` → `http://localhost:3000/mithila` (gallery: `/mithila/gallery`).
3. Reset: `localStorage.removeItem("mithila:v3")` (+ `mithila:v2` if present) then hard-refresh (Ctrl+Shift+R).

---

## Current status

**Ships A–D + polish shipped in code.** Build green. Ready to deploy.

| Area | Status |
|------|--------|
| A Theme + Games | DONE |
| B Move + Biomes + coins + BridgeDash | DONE |
| C Tunnels + side-games + HUD | DONE |
| D LanternChase + finale + docs | DONE |
| Gallery `/mithila/gallery` | DONE (scroll + medley) |
| Coin/spark proximity pickup | DONE |
| Optional | Phone QA · personalize `finale.letter` · push |

---

## Gate → game map

Land 0 = open tutorial.

| Gate | Biome | Game |
|------|-------|------|
| 1 | Bridge of Two | Beat Tap |
| 2 | Wedding Ghat | Jigsaw |
| 3 | Little House | Memory Flip |
| 4 | Golden Fields | Song Guess |
| 5 | Quiet Valley | Which Era? |
| 6 | Bloom Gardens | Strip Shuffle |
| 7 | Airport of Us | Zoom Place |
| 8 | Yesterday Lane | Odd One Out |
| 9 | Birthday City | Medley Scrub |

### Tunnel side-games

Cover Guess · Spot the Diff · Lyric Pick · Speed Round · Song→Photo · Mute Odd One · Era Order

### Coin doors

Coins from the **previous** biome open the next gate. Costs: Bridge 5 · Little House 6 · Quiet Valley 5 · Bloom 8 · Yesterday 6 · Birthday 8. Others trial-only.

### HUD

- 🪙 coins (Mario currency)
- **sparks** N/36 — optional purple gems (not required)
- frontier /10

### Sequences

- **BridgeDash** — enter Bridge of Two (skip after 2 fails)
- **LanternChase** — enter Birthday City (skip after 2 fails; finale waits)

### Gallery

- Route: `/mithila/gallery`
- Linked from finale + pause menu
- Medley continues; Lenis disabled on `/mithila*` so desktop scroll works

---

## Key files

```
docs/mithila/SHIP.md
lib/mithila/data.ts · store.ts · collectibles.ts · physics.ts · input.ts · world.ts
components/mithila/World.tsx · lands.tsx · collectibles.tsx · SideGames.tsx
components/mithila/sequences/ · minigames/ · Gate.tsx · Finale.tsx · hud.tsx
app/mithila/gallery/page.tsx
```

---

## Playtest script

1. Clear `mithila:v3`, hard refresh `/mithila`.
2. Hyd unlock → dawn Gate → First City colors.
3. Stick / WASD / jump; walk into gold coins → photo flash; HUD 🪙 climbs.
4. Bridge → BridgeDash → need 5 coins → Beat Tap.
5. Tunnel label → side-game.
6. Birthday City → LanternChase → letter → **view all our photos**.
7. Gallery: scroll (desktop wheel + scrollbar), music on, open a photo.
8. Phone: stick, audio, WebGL.

---

## Status Log

| Date | Done | Next |
|------|------|------|
| 2026-07-09 | Docs refreshed; production build green; ready to push | Deploy + phone QA |
| 2026-07-09 | Gallery scroll (Lenis off); medley on gallery | — |
| 2026-07-09 | Spark/coin proximity; photo flash; coin-door count fix | — |
| 2026-07-09 | Ships A–D: games, biomes, free move, coins, tunnels, sequences | — |
