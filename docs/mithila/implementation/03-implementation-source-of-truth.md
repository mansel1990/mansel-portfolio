# `/mithila` — Implementation Source of Truth

> The one document to read before changing anything. Covers how the project evolved (v1 → v2), how every system works today, and exactly where to make upgrades.
>
> Companion docs: `../prd/01-prd-v1-constellations.md` (original concept) · `../prd/02-prd-v2-long-walk-home.md` (current design).

---

## 1. History: how we got here

**v1 — "Written in the Stars" (built, then replaced).** A 3D night sky where each era was a constellation; solving a riddle ignited it and opened a photo carousel with a per-chapter song clip. Verdict from Sanjay: felt like a "menu in the sky", not a game.

**v2 — "The Long Walk Home" (current).** A walkable 3D adventure: the character Mithi walks a winding road through 10 gated lands (2012 → 2026), ages permanently through 4 life stages, solves a trial at each gate, and everything in the world is tappable. One continuous song medley replaces per-chapter clips.

**What survived v1 → v2 (reused, not rewritten):** the entry password gate (`Gate.tsx`), all 5 mini-games (`minigames/`), the photo gallery (`MemoryBloom.tsx`), the finale (`Finale.tsx`), the audio manager (`audio.ts`), fuzzy answer matching (`fuzzy.ts`), optimized photos and trimmed songs. **What was deleted:** `Sky.tsx` (constellation hub) and the per-chapter song playback.

Key decisions made along the way (with Sanjay's sign-off):

- Birthday framing, age 36 — never mention years-together.
- Riddles are universal husband-wife / mom-daughter humor, never memory tests.
- Chapters are named eras ("lands"), not strict years, sized to where photos exist.
- One deliberately irritating block puzzle (gate 7), with a hidden mercy skip.
- No Vercel Blob / no database: photos optimized into `/public`, progress in `localStorage`, answers in the data file.
- No external 3D asset downloads possible from the build environment → Mithi and the whole world are procedural three.js primitives. A Quaternius GLB can replace Mithi later (see §10).

---

## 2. File map (every file, one line of purpose)

```
app/mithila/
  layout.tsx        noindex metadata, Cormorant Garamond font, fixed dark shell, imports mithila.css
  page.tsx          dynamic import of MithilaApp (ssr:false) + loading shimmer
  mithila.css       all shared styles/keyframes (.mithila-* classes)

lib/mithila/
  data.ts           ★ ALL CONTENT: lands, riddles, photos, plaques, finale letter, gate password
  store.ts          zustand store: phase machine, frontier, stage ratchet, sparks, persistence
  world.ts          road spline math: curve, t-mapping, land positions, spark placement
  fuzzy.ts          answer matching (levenshtein + aliases) and gate "contains" check

components/mithila/
  MithilaApp.tsx    orchestrator: gate → world + overlay routing, 2D fallback, medley resume
  Gate.tsx          entry password screen (CSS starfield, shooting-star unlock)
  World.tsx         ★ 3D engine: Canvas, atmosphere lerp, character controller, camera,
                    tap-to-walk, gate proximity prompt, stage-transformation overlays, finale trigger
  Mithi.tsx         procedural characters: Mithi (4 stages) + Rudra follower, code-driven animations
  lands.tsx         ★ world content: prop kit, Poke interactivity, per-land dressing, gates,
                    photo pavilions, finale lanterns, sparks
  hud.tsx           Toast, TopBar, MiniMap (fast travel), PauseMenu (restart flow)
  ClueCard.tsx      trial modal: riddle UI + dispatch to mini-games; calls solveTrial
  MemoryBloom.tsx   photo gallery (3D-fan carousel, fullscreen viewer)
  Finale.tsx        birthday finale: particle text MITHILA→36, 36 candles, letter, Good Riddance
  audio.ts          music slots w/ crossfade + WebAudio synth SFX (no sound files)
  minigames/
    SongGuess.tsx   3s snippet (grows per replay), multiple choice
    Jigsaw.tsx      3×3 tap-two-to-swap photo puzzle
    ZoomPlace.tsx   extreme close-up slowly zooms out; free mode (answers:[]) = confirm button
    BlockPuzzleGame.tsx  6×6 unblock-style slider; config in data.ts; mercy skip
    TwoTruths.tsx   tap the fake memory

public/mithila/
  photos/*.webp     68 optimized photos (≤1600px, q82) — NO SPACES IN FILENAMES (breaks CSS url())
  audio/ch01..ch10.mp3   60s trimmed per-era clips (now only used by SongGuess)
  audio/medley.mp3  10-min background loop (concat of ch01..ch10)
  audio/finale.mp3  Good Riddance, full length
  audio/ambient.mp3 v1 leftover synth pad (unused, harmless)

photo-dump/         ORIGINALS (381MB) — git-ignored, never deployed. audio/ has source mp3s.
```

★ = the three files where 95% of future changes happen.

---

## 3. Content model — `lib/mithila/data.ts`

Everything player-facing is data, not code. The `Land` type:

```ts
{
  id, index, title, years, places, intro,
  gateName,                    // label on the locked gate
  sky, ground, accent, fog,    // palette; lands go dawn→night by design
  puzzle,                      // null = open gate (land 0 tutorial) | one of 6 puzzle types
  photos: [{ src, caption? }],
  song: { src, title },        // used only by SongGuess snippets + gallery label
  plaques: string[],           // tap-a-prop text lines — put inside jokes here
}
```

Also in data.ts: `gate` (entry password: any answer containing `"hyd"`), `blockPuzzleConfig` (BFS-verified, 27-move minimum — don't edit casually, see §11), `finale` (name/age/birthday/letter/sparkSecret), `medleySrc`, `TOTAL_SPARKS`.

**Puzzle types:** `riddle` (fuzzy-matched answers + 2-step hints), `song-guess`, `jigsaw`, `zoom-place` (empty `answers` = cinematic confirm), `block-puzzle`, `two-truths`. Dispatch lives in `ClueCard.tsx → PuzzleBody`.

---

## 4. State machine — `lib/mithila/store.ts`

- `phase`: `gate → world ⇄ (trial | gallery | finale)`. Overlays render on top of the world; the world keeps rendering underneath.
- `frontier` (1..10): how many lands are accessible. **The single progression variable.** Gate *i* opens when `solveTrial(i)` sets `frontier = i+1`.
- `stageForFrontier()`: 1 (girl) → 2 at frontier≥3 (wedding) → 3 at ≥6 (Rudra) → 4 at ≥10 (queen). The stage is *derived*, so it can never de-age; `shownStage` tracks which transformation cinematic already played (ratchet).
- `sparks: string[]` collected ids; `lastLand` for resume position; `travelTo` is a one-shot mailbox consumed by the Controller for fast travel.
- Persistence: `localStorage["mithila:v2"]` via zustand persist. Persisted: unlocked, frontier, sparks, lastLand, finaleSeen, muted, shownStage. Ephemeral: phase, activeLand, celebrateUntil, toast, travelTo.
- `restart()` resets everything except `unlocked` (she shouldn't re-answer the password).

**Dev reset:** `localStorage.removeItem("mithila:v2")` + refresh.

---

## 5. World engine — `lib/mithila/world.ts` + `components/mithila/World.tsx`

- **Road**: a `CatmullRomCurve3` through 11 control points `(sin(i*1.35)*11, 0, -i*26)`. All positions in the game are a scalar `t ∈ [0,1]` along this curve. Land *i* owns `t ∈ [i/10, (i+1)/10]`; gates sit at land starts.
- Helpers: `pointAt(t)`, `tangentAt(t)`, `sideAt(t, side, forward)` (place props relative to the road), `yawAt(t)` (face travel direction), `nearestT(point)` (tap → road position via 600 precomputed samples), `maxT(frontier)` (walkable limit: just before the next locked gate), `buildRoadGeometry()` (the visible ribbon).
- **Movement** (`Controller` in World.tsx): mutable `walk = {t, target, running}` ref; each frame moves `t` toward `target` (run = fast travel speed ×2.6). Frontier clamping happens on `target` every frame — locked gates are physically impassable.
- **Camera**: lerped chase cam 6.5 units behind, 4.2 up, looking ahead along the tangent. All smoothing is `lerp(min(1, delta*k))` — frame-rate independent.
- **Atmosphere**: per-frame lerp of `scene.background`, fog color, ambient/directional intensity between the current and next land's palette. Dawn→night is just the palettes in data.ts.
- **Tap-to-walk** (`TapGround`): raycast on the road mesh + a generous invisible plane; `nearestT` → clamp → walk. Tapping past the frontier rattles the gate + shows a toast.
- **Gate prompt**: a 250ms poll checks `maxT(frontier) - walk.t < 0.02` → shows the "open {gateName} ✦" button → `openTrial(frontier)`.
- **Stage transformations**: effect watches `frontier`; when derived stage > `shownStage`, plays SFX + full-screen overlay ("2016 — she said yes", etc.) and marks it shown.
- **Finale trigger**: `frontier ≥ 10 && !finaleSeen && t > start(land 9) + 0.02` → `setPhase("finale")`.

## 6. Characters — `components/mithila/Mithi.tsx`

Procedural primitives (capsules/spheres/cones), flat-shaded, ~6k triangles total. Animations are pure code in `useFrame`:

- **walk**: sin-driven leg/arm swing + bob (speed 8.5, run 13) · **idle**: breathing + head sway · **celebrate**: jump-spin with arms up while `Date.now() < celebrateUntil`.
- **Stages** change materials + accessory meshes: ponytail/bun/crown, sari pallu box, sling bag, skirt cone (stages 2–4). All driven by the `stage` prop from `stageForFrontier`.
- **Rudra** (stage ≥ 3): toddler proportions (big head), follows at `t - 0.0055` with positional lerp; own bounce. Tap either character → giggle SFX + reaction.
- The shared mutable `CharAnim` ref (`{moving, running, celebrateUntil}`) is written by the Controller and read by both characters — this is the hook point if you ever swap in a rigged GLB (map `moving/running/celebrate` to AnimationMixer clips).

## 7. Interactivity — `components/mithila/lands.tsx`

- **`Poke`** wraps any prop: tap → spring wiggle (decaying impulse in useFrame) + `sfx.wiggle` + optional plaque toast + haptic. To make anything tappable, wrap it in `<Poke plaque="...">`.
- **Prop kit**: `Tree, Lamp, House, Bench` + `Spinner`/`Bobber` motion wrappers. Land-specific props (mandap, cradle, carousel, plane, café…) are built inline in `LandProps` per `landIndex`.
- **Photo pavilions**: appear once a land is unlocked; golden frame textured with the land's first photo (`useTexture` inside `Suspense`); tap → `openGallery`.
- **Sparks**: positions generated deterministically in `world.ts::buildSparks()` (counts `[3,3,4,3,3,4,4,4,4,4]` = 36). Only spawn in unlocked lands; collect → grow+fade+chime. All 36 → `finale.sparkSecret` shows in the pause menu.
- **FinaleLanterns**: 3 rings × 12 lanterns in Birthday City; emissive when `finaleSeen || phase === "finale"`.

## 8. Audio — `components/mithila/audio.ts`

- Two HTMLAudio slots (music + ambient) with volume-lerp crossfade pump. The **medley** (`playMusic(medleySrc, {loop:true})`) starts on world entry; the **finale** replaces it (same slot), and `MithilaApp` restores the medley when the finale closes.
- **SFX are synthesized** (WebAudio oscillator envelopes) — zero files: tap, wiggle, spark, gateRattle, gateOpen, solve, giggle, transform.
- Autoplay policy: audio only starts after the password gate interaction (a user gesture), so browsers allow it.

### Audio pipeline (repeatable ffmpeg recipes)

```bash
# per-era 60s clip (start seconds chosen per song):
ffmpeg -ss <START> -t 60 -i src.mp3 \
  -af "loudnorm=I=-18,afade=t=in:d=1.5,afade=t=out:st=57:d=3" -b:a 112k chNN.mp3
# medley = concat of ch01..ch10 (baked fades make transitions smooth):
ffmpeg -f concat -safe 0 -i list.txt -c:a libmp3lame -b:a 112k medley.mp3
# finale (full length): loudnorm=I=-16, 128k
```

### Photo pipeline

Drop originals in `photo-dump/`, then (PIL): `exif_transpose → thumbnail(1600) → WebP q82` into `public/mithila/photos/`. **Never use spaces in output filenames** — they break CSS `url()` (this bit us once: the jigsaw showed purple).

---

## 9. Known quirks & gotchas (read before debugging)

1. **drei `<Html>` z-index**: defaults to astronomic z-index and will float above DOM modals. Every `<Html>` in the world must set `zIndexRange={[20, 0]}` (modals are z-40/50).
2. **eslint `react-hooks/immutability`**: World.tsx / Mithi.tsx / lands.tsx have file-level disables — the R3F game-loop pattern (mutating refs in `useFrame`) is intentional. Don't "fix" it by moving mutations into state; that would re-render 60×/sec.
3. **localStorage versioning**: the persist key is `mithila:v2`. If the persisted shape changes incompatibly, bump the key (old data is silently abandoned — acceptable for one user).
4. **Song-guess ducking**: the mini-game plays its own `<Audio>` clip on top of the medley. The medley isn't ducked automatically — acceptable, but see §11 for the upgrade.
5. **`travelTo` mailbox**: fast travel writes a land index; the Controller consumes it inside `useFrame`. Don't read it in React render.
6. **Locked-land dressing** renders only within 2 lands of the frontier (visibility gate in `AllLands`) — cheap culling; extend if you add heavy props.
7. **Build env**: `next build` can't fetch Google Fonts in the sandbox (irrelevant on a real machine/Vercel). The entire experience is `ssr:false`; the portfolio's other routes are untouched.

## 10. How to make common upgrades

- **Change any text/photo/riddle/plaque/letter** → `lib/mithila/data.ts` only. No code.
- **Add a photo to a land** → optimize it (see §8 pipeline), add to that land's `photos` array.
- **Add an 11th land** → add a `Land` to `data.ts` (index 10); the spline, sparks counts (`world.ts`), gate positions, and stage thresholds (`store.ts::stageForFrontier`) reference `LAND_COUNT`/hard values — update `counts[]` in `buildSparks`, check `transformLines`, and add a `landIndex === 10` branch in `LandProps` for dressing.
- **Add a new mini-game** → create `minigames/NewGame.tsx` with an `onSolve` prop; add its type to the `Puzzle` union in `data.ts`; add a case in `ClueCard.tsx::PuzzleBody`.
- **Add a tappable prop** → in `LandProps`, wrap primitives in `<Poke plaque="line">` positioned with `p(dtAlongLand, sideOffset)`.
- **Swap Mithi for a rigged GLB** → replace the primitive JSX in `Mithi.tsx` with `useGLTF` + `AnimationMixer`; drive clips from the same `CharAnim` ref (`moving`→walk, `running`→run, `celebrateUntil`→dance) and keep the stage→material/mesh mapping. Nothing outside `Mithi.tsx` changes.
- **Duck medley during song-guess** → export `audio.duck(bool)` (lower `music.target`), call it from `SongGuess` mount/unmount.
- **New block-puzzle layout** → generate + verify with BFS first (a random-search + solver script exists in the chat history; min-moves 15–28 is the fun zone). Never ship an unverified layout.

## 11. Test cheat sheet

Entry: anything containing `hyd`. Gates: 1 open · 2 `blanket` · 3 jigsaw (tap-two-swap) · 4 `wrong` · 5 Someday—Flipside · 6 `baby`/`rudra` · 7 slide gold star out right (mercy: after 40 moves, long-press the badge 2s) · 8 wait for zoom-out, confirm · 9 tap the llama · 10 `birthday`/`36`. Finale auto-triggers entering Birthday City.

Verify commands: `npx tsc --noEmit` · `npx eslint components/mithila lib/mithila app/mithila` · `npm run build`.

## 12. Outstanding content homework (Sanjay)

1. **The finale letter** — `finale.letter` in data.ts (still placeholder).
2. **`finale.sparkSecret`** — the all-36-sparks reward message (placeholder).
3. Two real truths for gate 9 (`two-truths` statements; llama stays).
4. Personalize `plaques` per land with real inside jokes.
5. Optional: pick a better `zoom-place` photo for gate 8 (current one chosen blind).
6. Real-device test on Mithila's actual phone before July 25, 2026.
