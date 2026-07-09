# PRD: `/mithila` — "Written in the Stars"

A private, 3D, game-like **birthday experience** for Mithila's 36th. She flies through a night sky where the journey from 2012 to 2026 unfolds as **10 named chapters** — eras, not strict years — each a constellation. Lighthearted riddles and mini-games ignite each constellation, which blooms into that year's photos and the song tied to it — anchored to the places where the memories happened. It ends with **36 candle-stars** assembling into her birthday finale.

**Tagline:** *"Thirty-six stars, one sky. Happy Birthday, Mithila."*

**Stack:** Already installed — Next.js 16, React 19, `@react-three/fiber`, `@react-three/drei`, `three`, `framer-motion`, `lenis`, Tailwind 4. Add: `zustand` (state), `howler` (audio). Nothing else needed.

---

## 1. Concept & Narrative

The framing device: the night sky is throwing her a birthday party, but someone forgot to light the candles. Only the birthday girl can light them. The years 2012–2026 are grouped into 10 chapter-constellations — each named like a storybook chapter, spanning whatever years it needs (so photo-sparse years merge invisibly into eras). Solving a fun clue ignites a chapter, then she explores its photos and song. Places (cities, trips, homes) appear as glowing labels beneath each constellation, weaving geography into the timeline.

**Important design rule — this is a party, not a quiz.** No puzzle ever tests whether she remembers something about the relationship. All riddles are universal and playful; the photos and songs are the reward, not the test.

**Emotional arc:**

1. **The Gate** (private entry) — intimate, dark, a single question.
2. **The Dark Sky** — vast, quiet, one constellation faintly pulsing: 2012.
3. **The Hunt** — 10 chapters of universal riddles and mini-games, the sky filling with light.
4. **The Birthday Finale** — 36 candle-stars, a cake of light, a letter, "her song."

## 2. Entry Gate (`/mithila`)

- Near-black screen, drifting star dust, one line fades in: *"This sky was made for one person. Prove it's you."*
- One simple personal question only she can answer (Sanjay picks — keep it easy, it's a lock not a puzzle). Fuzzy-matched, case-insensitive.
- Wrong answer: stars shiver and dim ("The stars don't recognize you… yet.").
- Correct: a shooting star streaks across, the title *Written in the Stars* assembles from particles, camera pulls back to reveal the sky.
- Gate pass stored in `localStorage` (`mithila:unlocked`).
- Route excluded from sitemap/robots, `noindex` meta, no links from the portfolio.

## 3. The Sky (hub world)

- **Scene:** R3F canvas. Deep-space gradient (indigo → black), 3 parallax layers of instanced star particles, faint nebula fog, slow ambient drift.
- **Layout:** 10 chapter-constellations along a gentle spiral through 3D space — chapter 1 nearest, chapter 10 deepest — connected by a thin luminous thread.
- **Navigation:** mobile-first. Vertical swipe/scroll moves the camera along a `CatmullRomCurve3` rail (Lenis-driven); horizontal drag peeks around. Tap a constellation to focus it. No free-fly — rails keep it cinematic and touch-friendly.
- **Constellation states:** *future* = grey dust · *next up* = gold pulse, tappable · *lit* = full brightness, revisitable.
- **Place anchoring:** each constellation carries floating labels — the chapter title large, its year-range and place(s) beneath (e.g., **The Vows** · *2016 · Chennai*). Lit places get a micro-constellation landmark glyph (beach, plane, house, temple…).
- **Progress:** a birthday-candle meter in the corner — one tiny flame lights per completed chapter, building toward 36 total flames by the finale (10 chapter flames + 26 bonus flames that rain in during the finale). Persisted in `localStorage` (`mithila:progress`).
- **Ambient audio:** soft pad + sparse piano loop; ducks under each chapter's song.

## 4. Chapter Flow

Tap the pulsing constellation →

1. **Clue card** rises (framer-motion glass panel): a riddle or mini-game, tagged with a playful badge — **"one for the wife"** or **"one for the mom"** — so she knows which hat to wear.
2. **Solve it** → stars ignite one by one with a chime, lines draw between them, camera dives through the constellation…
3. **Memory bloom:** the chapter's photos float as polaroid planes in a slow 3D orbital carousel; the chapter's song fades in. Swipe through; tap for fullscreen with a one-line caption. Place names glow on frame edges.
4. **Close** → camera pulls back, the thread extends, the next chapter begins to pulse.

Song handling: one song per chapter, 30–60s trimmed loops in `/public/mithila/audio/`, crossfaded via Howler.

## 5. Chapters & Puzzle Design — 10 chapters

Chapters are eras with storybook names, sized around where the photos actually are (rich: 2016–2018, 2023–2026; sparse years merge). Three puzzle ingredients, none of which test her memory of your history:

- **Universal riddles** — classic husband-wife and mom-daughter humor/warmth. Answers are common words, never personal facts. Wife-riddles dominate early chapters; mom-riddles take over later, so the shift itself tells the family story.
- **Nice games** — song finder, photo jigsaw, zoom-out place reveal, two-truths-and-a-star.
- **One deliberately irritating block puzzle** — a proper sliding-block puzzle ("Unblock Me" style: slide blocks to free the golden star from the grid). Placed mid-journey, guarding an extra-special chapter. Solvable in ~1–3 minutes, annoying in the fun way, with a mercy "skip after 10 moves past par" hidden behind a long-press so she never actually rage-quits.

Suggested mapping (Sanjay finalizes chapter names, year splits, and riddle text; mom-riddle placement adjusts to when your daughter arrived):

| # | Chapter (working title) | Years | Mechanic | Flavor / example |
|---|------------------------|-------|----------|------------------|
| 1 | *Once Upon a Sky* | 2012–2014 | Riddle (wife) | "I can turn 'I'm ready' into forty-five more minutes. What am I?" → *getting ready* |
| 2 | *New Orbits* | 2015 | Riddle (wife) | "I'm shared by two people but somehow one person gets 90% of me." → *the blanket* |
| 3 | *The Vows* | 2016 | **Photo Jigsaw** | A scrambled 9-tile photo she reassembles; solving reveals the memory. |
| 4 | *Building a Nest* | 2017 | Riddle (wife) | "The husband is always this, even when the map app disagrees." → *wrong* 😄 |
| 5 | *Golden Hours* | 2018 | **Guess the Song** | 3 seconds of a song from that era; pick from 4 or type it. Hints reveal more seconds. |
| 6 | *The Quiet Years* | 2019–2022 | Riddle (mom) | "I'm the only alarm clock that works before sunrise and can't be snoozed." → *the baby* |
| 7 | *Full Bloom* | 2023 | **⭐ THE BLOCK PUZZLE ⭐** | Sliding-block grid; free the golden star. The one that's supposed to make her groan before the reward. |
| 8 | *Everywhere Together* | 2024 | **Zoom-out Place Reveal** | Extreme close-up of a location photo slowly zooms out as she guesses. Pure fun. |
| 9 | *Almost Yesterday* | 2025 | **Two Truths & a Star** | Three sweet "memories" — tap the one that never happened; the fake is obviously silly ("we adopted a llama"), so it's comedy, not a memory test. |
| 10 | *This Year, Tonight* | 2026 | Final riddle | Answer is *birthday* or *thirty-six* — the key that starts the finale. |

**Answer handling (riddles):**

- Fuzzy matching: lowercase, strip punctuation, Levenshtein ≤ 2, alias lists per answer.
- Wrong answers never punish: attempt 1 → playful nudge; attempt 2 → real hint; attempt 3 → "Want a bigger hint?" Never hard-blocked.
- Every solve: particle burst, chime, haptic (`navigator.vibrate`) on mobile.

## 6. The Birthday Finale (after 2026)

1. Sky goes silent. Every lit star detaches and streams to the center.
2. Stars assemble into a **birthday cake of light with 36 candle-flames** — the 10 chapter flames plus 26 shooting stars raining in to complete 36. The cake then dissolves and reforms as **"MITHILA · 36"** in star-script with a heart.
3. *"Make a wish"* — she taps/blows (mic optional, tap fallback) and the candles flare out into a slow-motion firework of every photo from the journey as a shimmering mosaic.
4. A handwritten-style letter from Sanjay fades in line by line over "her song" playing in full. Final line + the date.
5. The sky stays fully lit forever; free-roam all constellations, plus a "replay the journey" button.

## 7. Content Model (all content in data files — zero code edits to update)

```ts
// lib/mithila/data.ts
type Chapter = {
  id: string;                    // "the-vows"
  title: string;                 // "The Vows"
  years: [number, number];       // [2016, 2016] or [2019, 2022]
  places: string[];              // ["Chennai", "Marina Beach"]
  puzzle:
    | { type: "riddle"; badge: "wife" | "mom" | "both"; prompt: string; answers: string[]; hints: [string, string] }
    | { type: "song-guess" | "jigsaw" | "zoom-place" | "block-puzzle" | "two-truths"; config: {...} };
  photos: { src: string; caption?: string }[];   // from /public/mithila/photos/
  song: { src: string; title: string; note?: string };
  constellation: [number, number][];  // unique star shape per chapter
};
```

### Photos — status: ✅ done

68 photos selected by Sanjay, optimized (381MB originals → 16.9MB of ≤1600px WebP) into `/public/mithila/photos/`. Originals preserved in git-ignored `/photo-dump/`. Any new photos added to `photo-dump/` get the same treatment. Photos are assigned to chapters in `data.ts` (filename dates give the default assignment; Sanjay can reshuffle).

**Privacy note:** `/public` assets are fetchable by URL. Fine for an unlinked, noindexed route; for stronger privacy later, serve assets through an API route that checks the gate cookie.

## 8. Architecture

```
app/mithila/
  page.tsx            // dynamic import, ssr:false, loading = star shimmer
  layout.tsx          // noindex metadata, fullscreen dark layout
components/mithila/
  Gate.tsx
  Sky.tsx             // R3F canvas: starfield, nebula, camera rail
  Constellation.tsx   // instanced stars, line-draw, states
  ClueCard.tsx        // riddle UI + fuzzy match + wife/mom badge
  minigames/          // SongGuess, Jigsaw, ZoomPlace, BlockPuzzle, TwoTruths
  MemoryBloom.tsx     // 3D photo carousel + captions
  Finale.tsx          // cake/candles particle assembly + letter
  AudioManager.tsx    // Howler crossfades, mute toggle
lib/mithila/
  data.ts  store.ts (zustand + localStorage persist)  fuzzy.ts  curve.ts
```

- Entire experience client-rendered (`ssr: false`); portfolio untouched.
- State: zustand — `unlocked`, `completedYears[]`, `currentChapter`, `muted` — persisted to `localStorage`.

## 9. Mobile & Performance (she'll open it on her phone)

- Target 60fps on mid-range phones: instanced star meshes, no realtime shadows, additive-sprite glow on mobile (postprocessing bloom desktop-only), `dpr` capped `[1, 2]`.
- Photos as compressed WebP textures, loaded per chapter and disposed after.
- All UI panels are DOM (framer-motion) over the canvas — crisp text, easy touch handling.
- Mute toggle always visible; audio starts only after the gate interaction (satisfies autoplay policies).
- WebGL fallback: graceful 2D version — same clues, CSS star background, photo carousel.

## 10. Visual Language

- **Palette:** deep indigo `#0b0e2a` → black, starlight white `#f5f0e8`, warm candle-gold `#f0b866`, rose accent `#e8788a`, birthday confetti accents used only in celebrations.
- **Type:** romantic serif for headings (Cormorant Garamond) + the portfolio's sans for UI. Riddles set like verses, centered.
- **Motion rules:** nothing snaps — 600–1200ms eases, slow cinematic camera; celebrations are the only fast motion.
- **Texture:** subtle film grain + vignette so photos and sky feel like one dream.

## 11. Build Plan (5 milestones)

1. **Skeleton** — route, gate, noindex, zustand store, data model with 2 placeholder chapters.
2. **Sky** — starfield, camera rail, constellation states, place labels, candle-progress meter.
3. **Chapters** — clue card + fuzzy riddles, memory bloom carousel, audio manager; all 10 chapters wired with the real photos.
4. **Mini-games + Finale** — the 5 mini-games (song guess, jigsaw, zoom-place, block puzzle, two truths), birthday-cake finale, letter.
5. **Content & polish** — songs, chapter names/photo assignments approved, riddle wording finalized, mobile perf pass, WebGL fallback, cross-device test.

**Sanjay's content homework** (parallel from milestone 1): pick one song per chapter, approve/tweak chapter names and riddle wordings, choose the gate question, write the finale letter.

## 12. Nice-to-haves (post-launch)

- A hidden 16th constellation appearing after the finale — the future, empty: "we'll light this one together."
- Downloadable image of the full lit sky as a keepsake.
- Birthday mode: on her actual birthday date each year, the sky rains shooting stars.
