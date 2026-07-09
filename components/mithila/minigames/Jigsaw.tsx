"use client";

import { useMemo, useState } from "react";

// 3x3 swap-tiles jigsaw: tap two tiles to swap them.
export default function Jigsaw({ photo, onSolve }: { photo: string; onSolve: () => void }) {
  const initial = useMemo(() => {
    // deterministic solvable shuffle (any permutation is solvable with swaps)
    const arr = [...Array(9).keys()];
    let seed = 36;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.every((v, i) => v === i)) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  }, []);

  const [tiles, setTiles] = useState<number[]>(initial);
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const tap = (i: number) => {
    if (done) return;
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    const next = [...tiles];
    [next[sel], next[i]] = [next[i], next[sel]];
    setTiles(next);
    setSel(null);
    if (next.every((v, k) => v === k)) {
      setDone(true);
      setTimeout(onSolve, 1200);
    }
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">piece it together</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Tap two tiles to swap them. A memory is hiding in here.
      </p>
      <div
        className="mx-auto grid grid-cols-3 gap-1 rounded-xl overflow-hidden"
        style={{ width: "min(78vw, 330px)", height: "min(78vw, 330px)" }}
      >
        {tiles.map((tile, pos) => {
          const r = Math.floor(tile / 3);
          const c = tile % 3;
          return (
            <button
              key={pos}
              onClick={() => tap(pos)}
              className="relative w-full h-full"
              style={{
                backgroundImage: `url("${encodeURI(photo)}")`,
                backgroundSize: "300% 300%",
                backgroundPosition: `${c * 50}% ${r * 50}%`,
                outline: sel === pos ? "3px solid #f0b866" : done ? "none" : "1px solid rgba(0,0,0,0.4)",
                outlineOffset: -3,
                borderRadius: done ? 0 : 4,
                transition: "outline 0.15s",
                filter: done ? "none" : "saturate(0.92)",
              }}
              aria-label={`tile ${pos + 1}`}
            />
          );
        })}
      </div>
      {done && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          There it is. ✦
        </p>
      )}
    </div>
  );
}
