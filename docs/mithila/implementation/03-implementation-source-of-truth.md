# `/mithila` — Implementation Source of Truth

> **Daily pickup:** [`../SHIP.md`](../SHIP.md) — start there every session.  
> Companion PRDs: `../prd/01-prd-v1-constellations.md` · `../prd/02-prd-v2-long-walk-home.md` (historical).

---

## 1. History

| Version | What |
|---------|------|
| **v1** | Constellation sky + riddles ("Written in the Stars") — replaced |
| **v2** | Spline road walker + mixed riddles/minigames |
| **v3 (current)** | Mario biomes: free XZ + jump, coins/doors, tunnels, photo+music games only, BridgeDash + LanternChase, end gallery |

Persist: `localStorage["mithila:v3"]`. Reset: remove that key (+ old `mithila:v2` if present).

Key decisions:

- Birthday framing, age 36 — never mention years-together.
- Gate trials = **photo + music only** (no riddles). Map in SHIP.md.
- Coins from biome *N* open the gate into biome *N+1* (see `coinsTowardDoor`).
- Sparks = optional purple gems (36); coins = gold Mario currency.
- No DB: assets in `/public`, content in `data.ts`.
- Procedural three.js world. Lenis smooth-scroll is **disabled** on `/mithila*`.

---

## 2. Routes

| Path | Purpose |
|------|---------|
| `/mithila` | Game (Gate → World → trials / sequences / finale) |
| `/mithila/gallery` | Full photo gallery by biome; medley continues; normal page scroll |

Both noindex via `app/mithila/layout.tsx`.

---

## 3. File map

```
app/mithila/
  layout.tsx           Cormorant, warm shell, noindex
  page.tsx             dynamic MithilaApp (ssr:false)
  gallery/page.tsx     end-of-journey photo gallery + medley
  mithila.css          shared UI classes

lib/mithila/
  data.ts              ★ lands, puzzles, gate, finale, allGalleryPhotos()
  store.ts             ★ zustand mithila:v3 (coins, doors, sequences, phases)
  world.ts             road spline helpers + spark placement
  physics.ts           biome pad clamp
  input.ts             stick / jump / playerXZ for proximity pickup
  collectibles.ts      coins, tunnels, coinDoorCost, coinsTowardDoor
  fuzzy.ts             gate "hyd" match

components/mithila/
  MithilaApp.tsx       overlays: trial, gallery bloom, finale, side-game, sequences
  Gate.tsx             game-theme start (purple→dawn), same hyd question
  World.tsx            ★ free move, jump, camera, sequence triggers, biome chip
  lands.tsx            BiomePad, props, gates, Sparks (proximity pickup)
  collectibles.tsx     Coins, Tunnels, CoinDoorHints, CoinPhotoFlash
  SideGames.tsx        7 bonus tunnel games
  sequences/           BridgeDash.tsx, LanternChase.tsx
  hud.tsx              VirtualPad, TopBar (coins + sparks), map, pause (+ gallery link)
  ClueCard.tsx         main-path puzzle dispatch
  MemoryBloom.tsx      per-land photo carousel (in-world)
  Finale.tsx           candles + letter + link to /mithila/gallery
  audio.ts             medley / finale music (survives nav to gallery)
  minigames/           BeatTap, Jigsaw, MemoryFlip, SongGuess, WhichEra,
                       StripShuffle, ZoomPlace, OddOneOut, MedleyScrub
  Mithi.tsx            procedural character stages

components/providers/smooth-scroll-provider.tsx
  Lenis OFF when pathname starts with /mithila

public/mithila/photos|audio   deploy assets
photo-dump/                   gitignored originals
```

---

## 4. Content model — `data.ts`

`Land`: id, title, years, palette (`sky/ground/accent/fog`), `puzzle | null`, photos, song, plaques.

**Main-path puzzle types:** `beat-tap` · `jigsaw` · `memory-flip` · `song-guess` · `which-era` · `strip-shuffle` · `zoom-place` · `odd-one-out` · `medley-scrub`.

Also: `gate` (contains `"hyd"`), `finale` (letter, sparkSecret), `medleySrc`, `TOTAL_SPARKS`, `allGalleryPhotos()`.

---

## 5. State — `store.ts`

**Phases:** `gate | world | trial | gallery | finale | side-game | sequence`

**Persisted:** unlocked, frontier, sparks, coins, doorsOpen, actionFlags, lastLand, finaleSeen, muted, shownStage.

**Ephemeral:** phase, activeLand, activeSideGame, activeSequence, toast, coinPhoto, travelTo.

**Coin doors:** `coinsTowardDoor(gateLand, coins)` counts `c{gateLand-1}-*` IDs. Costs in `collectibles.ts`.

**Sequences:** `bridge-dash` (enter land 1), `lantern-chase` (enter Birthday City); finale waits until lantern chase done/skipped.

---

## 6. Movement — `World.tsx` + `physics.ts` + `input.ts`

- Free XZ + jump; VirtualPad + WASD/Space.
- Clamped to unlocked biome pads (`BIOME_RADIUS`).
- Tap-to-walk still works on ground.
- Coins & sparks: **proximity auto-pickup** via `mithilaInput.playerX/Z`.
- Coin collect → random photo flash (`CoinPhotoFlash`).

---

## 7. Gotchas

- Filenames in `public/mithila/photos`: **no spaces** (CSS `url()`).
- Reset progress: `localStorage.removeItem("mithila:v3")`.
- Gallery scroll: document scroll (not nested); Lenis must stay off on `/mithila*`.
- Do not `audio.stopAll()` on MithilaApp unmount — gallery reuses medley.
- Gate password is client-side only (gift, not security).

---

## 8. Edit recipes

| Change | Where |
|--------|--------|
| Letter / spark secret | `data.ts` → `finale` |
| Gate games / photos / plaques | `data.ts` → `lands` |
| Coin door costs | `collectibles.ts` → `coinDoorCost` |
| Tunnel side-games | `collectibles.ts` → `buildTunnels` + `SideGames.tsx` |
| Ship status / daily pickup | `SHIP.md` |
