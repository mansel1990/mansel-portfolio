"use client";

import { useMemo, useState } from "react";
import type { MemoryFlipPuzzle } from "@/lib/mithila/data";

type Card = { id: number; src: string; faceUp: boolean; matched: boolean };

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryFlip({ puzzle, onSolve }: { puzzle: MemoryFlipPuzzle; onSolve: () => void }) {
  const initial = useMemo(() => {
    const pairs = puzzle.photos.flatMap((src, i) => [
      { id: i * 2, src, faceUp: false, matched: false },
      { id: i * 2 + 1, src, faceUp: false, matched: false },
    ]);
    return shuffle(pairs, 2017);
  }, [puzzle.photos]);

  const [cards, setCards] = useState<Card[]>(initial);
  const [open, setOpen] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  const tap = (idx: number) => {
    if (lock || done) return;
    const c = cards[idx];
    if (c.faceUp || c.matched) return;
    if (open.length >= 2) return;

    const nextOpen = [...open, idx];
    const next = cards.map((card, i) => (i === idx ? { ...card, faceUp: true } : card));
    setCards(next);
    setOpen(nextOpen);

    if (nextOpen.length < 2) return;

    setLock(true);
    const [a, b] = nextOpen;
    if (next[a].src === next[b].src) {
      const matched = next.map((card, i) =>
        i === a || i === b ? { ...card, matched: true } : card,
      );
      setTimeout(() => {
        setCards(matched);
        setOpen([]);
        setLock(false);
        if (matched.every((card) => card.matched)) {
          setDone(true);
          setTimeout(onSolve, 900);
        }
      }, 350);
    } else {
      setTimeout(() => {
        setCards((cur) =>
          cur.map((card, i) => (i === a || i === b ? { ...card, faceUp: false } : card)),
        );
        setOpen([]);
        setLock(false);
      }, 700);
    }
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">memory flip</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Find the matching pairs from the little house.
      </p>
      <div
        className="mx-auto grid grid-cols-3 gap-2"
        style={{ width: "min(84vw, 340px)" }}
      >
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => tap(i)}
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg"
            style={{
              background: card.faceUp || card.matched ? "transparent" : "rgba(240,184,102,0.18)",
              border: card.matched ? "2px solid #f0b866" : "1px solid rgba(245,240,232,0.15)",
            }}
            aria-label={card.faceUp || card.matched ? "photo" : "face down card"}
          >
            {card.faceUp || card.matched ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.src} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl" style={{ color: "#f0b866", opacity: 0.7 }}>
                ✦
              </span>
            )}
          </button>
        ))}
      </div>
      {done && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          Home remembers. ✦
        </p>
      )}
    </div>
  );
}
