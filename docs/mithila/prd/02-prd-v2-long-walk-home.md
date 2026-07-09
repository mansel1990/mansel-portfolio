# PRD v2: `/mithila` — "The Long Walk Home"

**A proper 3D adventure game.** A girl walks a winding road through 10 gated lands — one per chapter of your life together, 2012 → 2026 — **and grows older as she goes**. Every land is sealed by a gate; a game opens it. Inside: photos, memories, and a world full of things to tap and play with. One continuous soundtrack — all your songs mixed into a single medley — plays throughout. She can walk back anywhere she's unlocked; the character never de-ages. The road ends at a Birthday City with 36 lights.

**Kept from v1:** hyd entry riddle, all photos, all riddles/mini-games, the 36-candle finale, the letter, progress saving. **Replaced:** constellations → walkable world; per-chapter song clips → one background medley.

---

## 1. The Character — "Mithi"

The heart of the redesign. A stylized low-poly girl who **ages through four life stages** as gates open. The stage is a ratchet: it advances at story moments and **never reverses** — walk back to Land 1 at age 36 and the woman she is now revisits the streets where it began (that's the point).

### 1.1 The four stages

| Stage | Active | Look | Personality in animation |
|-------|--------|------|--------------------------|
| **I · The Girl** | Lands 1–2 (2012–15) | Early 20s. Kurti + jeans, ponytail, sling bag, bright colors | Quick bouncy walk; idle: rocks on heels, checks phone |
| **II · The Bride → Wife** | After Land 3's gate (2016+) | Wedding sari at the transformation moment, then elegant everyday wear, flower in hair | Graceful walk; idle: adjusts dupatta, smiles at nothing |
| **III · The Mom** | After Land 6's gate (2021+) | Comfortable warm outfit, hair in a bun, slight softness | Steadier walk; **a toddler (Rudra) appears and follows her**, holding her hand on idle |
| **IV · The Birthday Queen** | Entering Land 10 (2026) | Party dress, tiny golden crown, subtle sparkle trail | Confident walk; idle: little dance move |

### 1.2 Stage transitions are *moments*, not swaps

- **I→II** happens inside Wedding Ghat: screen blooms white-gold, oil lamps flare, she emerges in the sari, celebrate animation, confetti of marigold petals. (The single biggest "aww" of the game.)
- **II→III** happens in the Quiet Valley: the cradle glows, lullaby sting over the medley, and when the light fades the toddler is standing next to her.
- **III→IV** happens at Birthday City's doors: the doors crack open, golden light pours out, crown appears.

### 1.3 Technical definition

- Base: **Quaternius Ultimate Modular Women Pack** — CC0 (free commercial use, no attribution), 10 characters × 4 swappable body parts on one shared humanoid rig, **24 animations included**, glTF format. The four stages are four part-combinations + material palette changes on the same rig, so all animations work for every stage and swaps are instant (toggle mesh visibility — no re-load).
- Animations used: idle, walk, run (fast-travel), celebrate/dance (gate opens), wave (tap her!), sit (benches). All from the pack's 24.
- Rudra: smallest modular character scaled to toddler proportions with oversized head bone scaling (standard low-poly trick), simple follow-the-leader logic 1.2m behind, teleports closer if left behind. Own idle: spins in place.
- Tapping Mithi herself: she waves, or at random does the celebrate dance. Tapping Rudra: giggle SFX + jump.
- Blob shadow under characters (cheap, mobile-safe). ~6k triangles for both characters combined.

## 2. The World — detailed definition

A floating low-poly diorama world (Monument Valley palette meets a candy board-game path). One winding road, 10 lands, each ~25m of road with its own color story, props, and **time of day — the world moves from dawn to night as she progresses**, so Land 1 is sunrise pink and Land 10 is deep night ready for candlelight. Locked lands ahead are visible but desaturated/grey ("the future is unwritten"); they saturate into full color when their gate opens.

Assets: Quaternius nature/building packs + Kenney city/props packs (all CC0, GLB-ready). Total budget < 80k triangles, flat-shaded, no textures except photos.

| # | Land | Era | Time of day | Set dressing (key props) | Gate |
|---|------|-----|-------------|--------------------------|------|
| 1 | **The First City** | 2012–14 | Dawn, pink-gold | Bus stop, streetlights, chai stall, two bicycles leaning together, movie poster wall | City arch (open — tutorial) |
| 2 | **The Bridge of Two** | 2015 | Morning | River, wooden drawbridge, paper boats floating, lanterns on ropes, a bench for two | Drawbridge (raised) |
| 3 | **Wedding Ghat** | 2016 · Chennai | Late morning | Mandap with marigold garlands, oil lamp rows, dhol drums, banana-leaf feast table, temple steps | Carved temple doors |
| 4 | **The Little House** | 2017 | Noon | Cozy house w/ warm windows, clothesline (sways when tapped), potted plants, cat on the wall, TV glow inside | Garden gate |
| 5 | **Golden Fields** | 2018 | Golden hour | Wheat swaying in shader wind, fireflies, an old radio on a fence post, kite stuck in a tree | Wooden stile |
| 6 | **The Quiet Valley** | 2019–22 | Dusk, soft blue | Moonflowers, a glowing cradle, tiny shoes on a doorstep, string of star-lights, calendar showing 11·11 | Soft-lit nursery door |
| 7 | **Bloom Gardens** | 2023 | Early night | Flower beds that bloom when tapped, fountain, hedge archways, garden swing (rideable!) | **Stone puzzle-vault door** |
| 8 | **The Airport of Us** | 2024 | Night, runway lights | Tiny planes taxiing, spinning luggage carousel, departure board flipping city names, postcard stand | Departure gate w/ boarding scanner |
| 9 | **Yesterday Lane** | 2025 | Late night | A street of giant glowing photo frames, café with two cups steaming, wall clock running backwards | Photo-booth curtain |
| 10 | **Birthday City** | 2026 | Deepest night → lit | Dark plaza, 36 unlit lanterns, giant gift boxes, stage with mic, fireworks mortars (visible, waiting) | Grand golden doors |

## 3. Interactivity — a world that answers back

**Rule: everything that looks tappable, is.** Every land ships with 5–8 interactive props. Reaction types:

1. **Wiggle + SFX** — signs wobble, lamps flicker, the cat stretches, drums play a beat.
2. **Particles** — flowers bloom, fireflies scatter, paper boats ripple, fireworks (Land 10, post-finale, infinite).
3. **Plaque toasts** — small text cards with universal-cute lines ("This bench has heard a thousand conversations"). Sanjay can edit all lines in `data.ts` and sneak personal ones in.
4. **Photo frames / pavilions** — glow on approach; tap → fullscreen gallery for that land's era (v1 viewer reused).
5. **Rideables/toys** — garden swing she actually sits on, paper boat she can send down the river, the departure board she can flip through your travel places.
6. **Collectible: 36 hidden sparks** ✨ scattered across all lands (tap to collect, counter in menu). Collecting all 36 unlocks a bonus plaque in Birthday City with a secret message from you. Gives the whole world replay value after the finale.

Interaction tech: raycast on tap, `onPointerOver` glow outline for hover (desktop), floating "!" bubbles over key items until first tapped, haptics on mobile.

## 4. Controls

- **Tap the road → she walks there** (movement locked to the road spline; tap maps to nearest point along it). Tap-and-hold: keeps walking. Desktop: WASD/arrows too.
- Camera: third-person follow, slight drag-to-orbit, auto-frames gates and story moments.
- Locked gate blocks the road physically — she bumps, gate rattles, "Solve to open" prompt.
- Backtracking through unlocked lands: always free, stage never reverses.

## 5. Gate Challenges

Walk to a locked gate → pedestal glows → challenge modal (v1 components reskinned as "gate trials"). Same forgiving hint ladder (nudge → hint → bigger hint, never blocked).

| Gate | Challenge |
|------|-----------|
| 1 | Open — tutorial: learn walking, tapping, photo frames |
| 2 | Riddle (wife): the blanket |
| 3 | **Photo jigsaw** — restore the wedding "mural" |
| 4 | Riddle (wife): the husband is always ___ |
| 5 | **Guess the song** — the radio on the fence hums 3 seconds (medley ducks) |
| 6 | Riddle (mom): the alarm clock with no snooze |
| 7 | **⭐ Block-puzzle vault** — free the golden key; 27-move minimum; mercy skip after 40 moves (hidden long-press) |
| 8 | **Zoom-out place reveal** — the departure board "shows a vision" |
| 9 | **Two truths & a star** (llama stays) |
| 10 | Final riddle: fire on my head, 36 reasons → *birthday* |

Solving: gate opens with light burst, land saturates to color, Mithi celebrates, haptic, +1 spark.

## 6. Audio

- **The Medley**: all 10 songs crossfaded into one ~9-minute continuous mix (45–55s each, 2s crossfades, chronological order), looping from the moment she enters the world. Built with ffmpeg → `/public/mithila/audio/medley.mp3`.
- Ducks to 20% for the song-guess gate and fully hands over to Good Riddance (full version) for the finale.
- Layered SFX: footsteps, gate creaks/opens, prop reactions, spark collect chime, celebrate sting. Tiny generated/CC0 sounds.
- Mute always visible.

## 7. Free Roam, Map, Menu

- **Mini-map button**: top-down ribbon of the road, lands lit/dark; tap an unlocked land → fast-travel (she runs, camera pulls back — fun to watch).
- **Pause menu**: Resume · Map · Sparks counter (x/36) · Mute · **Restart the journey** (double-confirm: "All gates close. The whole road resets. Sure?" → then a typed "YES") · (post-finale) Replay the finale.
- Progress + position + stage + sparks in `localStorage`; she resumes exactly where she left off.

## 8. Entry & Finale

- **Entry unchanged**: dark screen, city-of-the-first-lie riddle (contains *hyd*), shooting star → fade into dawn at Land 1, medley begins.
- **Finale**: Birthday City is pitch dark on entry → 36 lanterns ignite one by one around her (stage III→IV transformation, crown) → "MITHILA · 36" in fireworks overhead → she blows out the candles (tap / mic-blow optional) → the letter, line by line, over Good Riddance → the city stays lit forever; fireworks become a tappable toy; free roam continues.

## 9. Tech Approach

Same stack (R3F + drei + three + framer-motion + zustand). New systems:

- **Road**: `CatmullRomCurve3` spline; movement = tween along t; locked-gate frontier clamps max t.
- **Character**: `useGLTF` + AnimationMixer; 4 stage variants = mesh-visibility toggles on one rig (Quaternius modular parts); Rudra = scaled follower.
- **World**: lands as prefab groups along the spline; per-land ambient color + fog lerp for time-of-day; distance culling beyond next locked gate.
- **Interactables**: registry per land `{ mesh, reaction, plaque?, sparkId? }`; raycast dispatcher.
- **Performance** (mid-range phone target 60fps): <80k tris, flat materials, no realtime shadows (blob shadows), dpr [1,2], photos loaded per-pavilion and disposed.
- **Fallback**: no WebGL → v1's 2D chapter-list path (already built) survives.
- All story content stays editable in `lib/mithila/data.ts` (+ new: plaque lines, spark positions, land themes).

## 10. Asset Sourcing (all CC0 / free commercial, no attribution required)

- Character + animations: [Quaternius Ultimate Modular Women Pack](https://quaternius.com/packs/ultimatemodularwomen.html) (10 chars × 4 swappable parts, 24 animations, glTF).
- Extra outfits if needed: [Quaternius Modular Character Outfits](https://quaternius.com/packs/modularcharacteroutfitsfantasy.html).
- Nature/props: [Quaternius nature & building packs](https://quaternius.com/), [150+ LowPoly Nature Models](https://quaternius.itch.io/150-lowpoly-nature-models).
- City/roads/props: [Kenney](https://kenney.nl/) (40k+ CC0 assets), GLB-ready road kits also on [poly.pizza](https://poly.pizza/bundle/Ultimate-Modular-Women-Pack-aCBDXDdTNN).
- SFX: Kenney audio packs (CC0).

## 11. Build Milestones

1. **World skeleton** — medley build; road spline; 10 blocked-out lands; capsule character; tap-to-walk; camera follow; gate frontier.
2. **Mithi & stages** — modular character import, 4 stage variants, animations, Rudra follower, transformation moments.
3. **Gates & challenges** — gate meshes + animations, all 10 trials wired, land color-up, celebrate flow.
4. **Interactivity pass** — per-land props with reactions, plaques, photo pavilions, sparks collectible, SFX.
5. **Map, menu, finale** — mini-map + fast travel, pause menu + restart, Birthday City finale sequence.
6. **Polish** — time-of-day lerp, mobile perf, save/resume position, real-device test on her phone model.

Effort: ~3–4× v1. Tight but doable before July 25 if content decisions come fast.

## 12. Decisions needed from Sanjay

1. Rudra follows as a toddler from Land 6 onward — confirmed? (Tapping her makes her giggle-jump.)
2. Medley order chronological — confirmed?
3. Delete v1 (constellations) or keep at a hidden route?
4. **Your letter** — still the placeholder. This is now the longest lead item.
5. Two real "truths" for the two-truths gate.
6. Any props/places you want in specific lands (e.g., the actual bus route, a real café) — plaque lines are editable, tell me the inside jokes.

---

*Sources: [Quaternius](https://quaternius.com/) · [Ultimate Modular Women Pack](https://quaternius.com/packs/ultimatemodularwomen.html) · [GameFromScratch on Quaternius licensing](https://gamefromscratch.com/quaternius-free-3d-assets/) · [Kenney](https://kenney.nl/) · [poly.pizza](https://poly.pizza/bundle/Ultimate-Modular-Women-Pack-aCBDXDdTNN)*
