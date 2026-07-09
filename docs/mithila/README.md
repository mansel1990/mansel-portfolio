# `/mithila` docs

A private birthday experience for Mithila's 36th — a 3D adventure game at `mansel.in/mithila`.

Read in this order:

1. **`prd/01-prd-v1-constellations.md`** — the original concept ("Written in the Stars", constellation sky). Built, then replaced. Kept for history and because several of its systems survived.
2. **`prd/02-prd-v2-long-walk-home.md`** — the current design ("The Long Walk Home", walkable world, aging character, gated lands).
3. **`implementation/03-implementation-source-of-truth.md`** — ★ start here for any code change: architecture, file map, state machine, pipelines, gotchas, and upgrade recipes.

Quick facts: content lives in `lib/mithila/data.ts` · progress in `localStorage["mithila:v2"]` · photos/audio in `public/mithila/` · originals in git-ignored `photo-dump/` · route is noindexed and unlinked.
