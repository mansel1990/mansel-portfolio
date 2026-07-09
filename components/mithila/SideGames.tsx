"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { lands } from "@/lib/mithila/data";
import type { SideGameId } from "@/lib/mithila/collectibles";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "./audio";

const P = "/mithila/photos/";
const A = "/mithila/audio/";

export default function SideGames({ game }: { game: SideGameId }) {
  const close = useMithila((s) => s.closeOverlay);
  const setToast = useMithila((s) => s.setToast);
  const onWin = () => {
    sfx.solve();
    setToast("Secret cleared ✦");
    setTimeout(close, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(4,5,16,0.6)", backdropFilter: "blur(5px)" }}
    >
      <div className="mithila-card relative w-full max-w-md max-h-[86vh] overflow-y-auto mithila-noscrollbar px-6 py-8">
        <button
          aria-label="close"
          onClick={close}
          className="absolute top-4 right-4 rounded-full p-2"
          style={{ background: "rgba(245,240,232,0.07)" }}
        >
          <X size={16} style={{ opacity: 0.7 }} />
        </button>
        {game === "song-to-photo" && <SongToPhoto onSolve={onWin} />}
        {game === "lyric-pick" && <LyricPick onSolve={onWin} />}
        {game === "speed-round" && <SpeedRound onSolve={onWin} />}
        {game === "mute-odd-one" && <MuteOddOne onSolve={onWin} />}
        {game === "cover-guess" && <CoverGuess onSolve={onWin} />}
        {game === "spot-the-diff" && <SpotTheDiff onSolve={onWin} />}
        {game === "era-order" && <EraOrder onSolve={onWin} />}
      </div>
    </motion.div>
  );
}

function SongToPhoto({ onSolve }: { onSolve: () => void }) {
  const opts = [
    { src: P + "mithila-chennai-20160530.webp", label: "Wedding" },
    { src: P + "IMG_20240823_163822911.webp", label: "Travel" },
    { src: P + "IMG_20221016_100520.webp", label: "Family" },
  ];
  const correct = 1;
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const el = new Audio(A + "ch08.mp3");
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = "";
    };
  }, []);
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">song → photo</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Play the clip. Which memory does it belong to?
      </p>
      <button
        className="mithila-btn mb-5"
        onClick={() => {
          const el = audioRef.current;
          if (!el) return;
          el.currentTime = 0;
          el.play().catch(() => {});
          setTimeout(() => el.pause(), 4000);
        }}
      >
        <Play size={16} className="inline mr-2" /> play
      </button>
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o, i) => (
          <button
            key={i}
            type="button"
            disabled={wrong.includes(i)}
            onClick={() => (i === correct ? onSolve() : setWrong((w) => [...w, i]))}
            className="rounded-lg overflow-hidden"
            style={{ opacity: wrong.includes(i) ? 0.35 : 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.src} alt={o.label} className="aspect-square object-cover w-full" />
            <div className="text-[10px] py-1" style={{ opacity: 0.6 }}>
              {o.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LyricPick({ onSolve }: { onSolve: () => void }) {
  const options = ["Someday — Flipside", "Numb — Linkin Park", "Lonely — Akon"];
  const correct = 0;
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const el = new Audio(A + "ch05.mp3");
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = "";
    };
  }, []);
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">title pick</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        The fence radio is playing… which title?
      </p>
      <button
        className="mithila-btn mb-5"
        onClick={() => {
          const el = audioRef.current;
          if (!el) return;
          el.currentTime = 0;
          el.play().catch(() => {});
          setTimeout(() => el.pause(), 3500);
        }}
      >
        play snippet
      </button>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            disabled={wrong.includes(i)}
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid rgba(245,240,232,0.14)",
              opacity: wrong.includes(i) ? 0.4 : 1,
            }}
            onClick={() => (i === correct ? onSolve() : setWrong((w) => [...w, i]))}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SpeedRound({ onSolve }: { onSolve: () => void }) {
  const rounds = [
    { src: A + "ch01.mp3", options: ["Hey There Delilah", "Aicha", "Numb"], correct: 0 },
    { src: A + "ch07.mp3", options: ["Someday", "Numb — Linkin Park", "Lonely"], correct: 1 },
    { src: A + "ch02.mp3", options: ["Smack That", "Lonely — Akon", "Good Riddance"], correct: 1 },
  ];
  const [i, setI] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const r = rounds[i];
  useEffect(() => {
    const el = new Audio(r.src);
    audioRef.current = el;
    el.currentTime = 0;
    el.play().catch(() => {});
    const t = setTimeout(() => el.pause(), 2500);
    return () => {
      clearTimeout(t);
      el.pause();
      el.src = "";
    };
  }, [i, r.src]);
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">speed round {i + 1}/3</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Quick — name that tune!
      </p>
      <div className="grid gap-2">
        {r.options.map((o, k) => (
          <button
            key={k}
            type="button"
            disabled={wrong.includes(k)}
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid rgba(245,240,232,0.14)",
              opacity: wrong.includes(k) ? 0.4 : 1,
            }}
            onClick={() => {
              if (k === r.correct) {
                if (i >= rounds.length - 1) onSolve();
                else {
                  setI((x) => x + 1);
                  setWrong([]);
                }
              } else setWrong((w) => [...w, k]);
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MuteOddOne({ onSolve }: { onSolve: () => void }) {
  // play 3 clips; #2 is wrong era
  const clips = [A + "ch09.mp3", A + "ch03.mp3", A + "ch09.mp3"];
  const odd = 1;
  const [wrong, setWrong] = useState<number[]>([]);
  const play = (src: string) => {
    const el = new Audio(src);
    el.play().catch(() => {});
    setTimeout(() => {
      el.pause();
      el.src = "";
    }, 2800);
  };
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">mute the odd one</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Play each clip. Tap the song that doesn&apos;t belong to this lane.
      </p>
      <div className="grid gap-3">
        {clips.map((src, i) => (
          <div key={i} className="flex gap-2">
            <button className="mithila-btn-ghost flex-1" onClick={() => play(src)}>
              play {i + 1}
            </button>
            <button
              className="mithila-btn flex-1"
              disabled={wrong.includes(i)}
              style={{ opacity: wrong.includes(i) ? 0.4 : 1 }}
              onClick={() => (i === odd ? onSolve() : setWrong((w) => [...w, i]))}
            >
              odd one
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverGuess({ onSolve }: { onSolve: () => void }) {
  const cover = P + "mithila-chennai-20160530.webp";
  const options = ["Nothing Else Matters", "Hey There Delilah", "Someday — Flipside"];
  const correct = 0;
  const [revealed, setRevealed] = useState(false);
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(A + "ch03.mp3");
    return () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.src = "";
    };
  }, []);
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">cover guess</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Guess the song from the cover — then hear the reveal.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cover} alt="" className="mx-auto mb-4 rounded-xl w-40 h-40 object-cover" />
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            disabled={wrong.includes(i)}
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid rgba(245,240,232,0.14)",
              opacity: wrong.includes(i) ? 0.4 : 1,
            }}
            onClick={() => {
              if (i === correct) {
                setRevealed(true);
                audioRef.current?.play().catch(() => {});
                setTimeout(onSolve, 1200);
              } else setWrong((w) => [...w, i]);
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {revealed && (
        <p className="mt-3 italic text-sm" style={{ color: "#f0b866" }}>
          Temple morning. ✦
        </p>
      )}
    </div>
  );
}

function SpotTheDiff({ onSolve }: { onSolve: () => void }) {
  const photo = P + "IMG_20170416_095126.webp";
  // three tap targets (normalized %)
  const diffs = [
    { x: 28, y: 35 },
    { x: 62, y: 55 },
    { x: 45, y: 72 },
  ];
  const [found, setFound] = useState<number[]>([]);
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">spot the diff</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Tap the three glowing spots hiding in the house photo. ({found.length}/3)
      </p>
      <div className="relative mx-auto rounded-xl overflow-hidden" style={{ width: "min(78vw, 320px)", aspectRatio: "1" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" className="w-full h-full object-cover" />
        {diffs.map((d, i) =>
          found.includes(i) ? null : (
            <button
              key={i}
              type="button"
              aria-label="difference"
              className="absolute rounded-full"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: 36,
                height: 36,
                transform: "translate(-50%, -50%)",
                background: "rgba(240,184,102,0.35)",
                border: "2px solid #f0b866",
                boxShadow: "0 0 16px rgba(240,184,102,0.6)",
              }}
              onClick={() => {
                const next = [...found, i];
                setFound(next);
                sfx.tap();
                if (next.length >= 3) setTimeout(onSolve, 500);
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}

function EraOrder({ onSolve }: { onSolve: () => void }) {
  const photos = useMemo(
    () => [
      { src: P + "IMG_20250105_210640278.webp", order: 0 },
      { src: P + "IMG_20250725_215537525.webp", order: 1 },
      { src: P + "IMG20251206204057.webp", order: 2 },
    ],
    [],
  );
  const [order, setOrder] = useState(() => {
    const a = [0, 1, 2];
    [a[0], a[2]] = [a[2], a[0]];
    return a;
  });
  const [sel, setSel] = useState<number | null>(null);
  const tap = (i: number) => {
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    const next = [...order];
    [next[sel], next[i]] = [next[i], next[sel]];
    setOrder(next);
    setSel(null);
    if (next.every((v, k) => photos[v].order === k)) setTimeout(onSolve, 600);
  };
  return (
    <div className="text-center">
      <span className="mithila-badge mb-3">era order</span>
      <p className="italic text-sm my-4" style={{ opacity: 0.8 }}>
        Put 2025 in order — earliest to latest. Tap two to swap.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {order.map((pi, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            className="rounded-lg overflow-hidden"
            style={{ outline: sel === i ? "3px solid #f0b866" : "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[pi].src} alt="" className="aspect-square object-cover w-full" />
          </button>
        ))}
      </div>
      <p className="text-[10px] mt-2" style={{ opacity: 0.45 }}>
        {lands[8].title}
      </p>
    </div>
  );
}
