"use client";

import { useRef, useState } from "react";
import { blockPuzzleConfig } from "@/lib/mithila/data";
import { Star } from "lucide-react";

type Piece = { r: number; c: number; l: number; o: "H" | "V" };
const SIZE = 6;

function buildGrid(pieces: Piece[]): number[][] {
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  pieces.forEach((p, i) => {
    for (let k = 0; k < p.l; k++) {
      const r = p.o === "V" ? p.r + k : p.r;
      const c = p.o === "H" ? p.c + k : p.c;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) g[r][c] = i;
    }
  });
  return g;
}

function canShift(pieces: Piece[], idx: number, dir: number): boolean {
  const p = pieces[idx];
  const g = buildGrid(pieces);
  if (p.o === "H") {
    const nc = dir > 0 ? p.c + p.l : p.c - 1;
    if (nc < 0) return false;
    if (nc >= SIZE) return idx === 0; // hero may exit right
    return g[p.r][nc] === -1;
  } else {
    const nr = dir > 0 ? p.r + p.l : p.r - 1;
    if (nr < 0 || nr >= SIZE) return false;
    return g[nr][p.c] === -1;
  }
}

export default function BlockPuzzleGame({ onSolve }: { onSolve: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>(() => blockPuzzleConfig.map((p) => ({ ...p })));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [showMercy, setShowMercy] = useState(false);
  const drag = useRef<{ idx: number; x: number; y: number; acc: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const mercyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cell = () => (boardRef.current ? boardRef.current.clientWidth / SIZE : 50);

  const shift = (idx: number, dir: number) => {
    setPieces((prev) => {
      if (!canShift(prev, idx, dir)) return prev;
      const next = prev.map((p) => ({ ...p }));
      if (next[idx].o === "H") next[idx].c += dir;
      else next[idx].r += dir;
      setMoves((m) => m + 1);
      // hero fully out?
      if (idx === 0 && next[0].c + next[0].l > SIZE) {
        setWon(true);
        setTimeout(onSolve, 1500);
      } else if (idx === 0 && next[0].c + next[0].l === SIZE) {
        // reached the exit edge — one more slide wins
      }
      return next;
    });
  };

  const onPointerDown = (idx: number) => (e: React.PointerEvent) => {
    if (won) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { idx, x: e.clientX, y: e.clientY, acc: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || won) return;
    const p = pieces[d.idx];
    const delta = p.o === "H" ? e.clientX - d.x : e.clientY - d.y;
    d.acc += delta;
    d.x = e.clientX;
    d.y = e.clientY;
    const step = cell() * 0.7;
    while (Math.abs(d.acc) >= step) {
      const dir = d.acc > 0 ? 1 : -1;
      shift(d.idx, dir);
      d.acc -= dir * step;
    }
  };

  const onPointerUp = () => (drag.current = null);

  // hero can win by sliding right at the edge
  const hero = pieces[0];
  const heroAtExit = hero.c + hero.l >= SIZE;

  return (
    <div className="text-center select-none">
      <span
        className="mithila-badge mb-4"
        onPointerDown={() => {
          if (moves >= 40) mercyTimer.current = setTimeout(() => setShowMercy(true), 2000);
        }}
        onPointerUp={() => mercyTimer.current && clearTimeout(mercyTimer.current)}
      >
        free the golden star
      </span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Slide the blocks. Get the ⭐ out the right side.
        <br />
        <span style={{ opacity: 0.6 }}>Yes, this one is meant to be annoying. He insisted.</span>
      </p>

      <div
        ref={boardRef}
        className="relative mx-auto rounded-xl"
        style={{
          width: "min(78vw, 320px)",
          height: "min(78vw, 320px)",
          background: "rgba(245,240,232,0.05)",
          border: "1px solid rgba(245,240,232,0.15)",
          touchAction: "none",
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* exit notch */}
        <div
          className="absolute"
          style={{
            right: -6,
            top: `${(2 / SIZE) * 100}%`,
            height: `${100 / SIZE}%`,
            width: 6,
            background: "linear-gradient(90deg, rgba(240,184,102,0.8), transparent)",
            borderRadius: 3,
          }}
        />
        {pieces.map((p, i) => {
          const pct = 100 / SIZE;
          const isHero = i === 0;
          return (
            <div
              key={i}
              onPointerDown={onPointerDown(i)}
              className="absolute flex items-center justify-center rounded-lg"
              style={{
                left: `${p.c * pct + 1}%`,
                top: `${p.r * pct + 1}%`,
                width: `${(p.o === "H" ? p.l : 1) * pct - 2}%`,
                height: `${(p.o === "V" ? p.l : 1) * pct - 2}%`,
                background: isHero
                  ? "linear-gradient(135deg,#f0b866,#e8935a)"
                  : "linear-gradient(160deg, rgba(90,98,160,0.9), rgba(58,64,116,0.9))",
                boxShadow: isHero ? "0 0 24px rgba(240,184,102,0.5)" : "0 4px 12px rgba(0,0,0,0.35)",
                transition: "left 0.12s, top 0.12s",
                cursor: "grab",
                opacity: won && isHero ? 0 : 1,
              }}
            >
              {isHero && <Star size={20} fill="#1a1206" color="#1a1206" />}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs tracking-widest" style={{ opacity: 0.5 }}>
        {moves} moves {heroAtExit && !won ? "· one more slide →" : ""}
      </div>

      {won && (
        <p className="mt-3 italic" style={{ color: "#f0b866" }}>
          FREEDOM. Was it worth it? (It was.)
        </p>
      )}
      {showMercy && !won && (
        <button className="mithila-btn-ghost mt-4" onClick={onSolve}>
          fine, the stars will do it for you ✦
        </button>
      )}
    </div>
  );
}
