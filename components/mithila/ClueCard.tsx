"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Land } from "@/lib/mithila/data";
import { matchAnswer } from "@/lib/mithila/fuzzy";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "./audio";
import { X } from "lucide-react";
import SongGuess from "./minigames/SongGuess";
import Jigsaw from "./minigames/Jigsaw";
import ZoomPlace from "./minigames/ZoomPlace";
import BlockPuzzleGame from "./minigames/BlockPuzzleGame";
import TwoTruths from "./minigames/TwoTruths";

const wrongLines = [
  "Not quite… the gate leans in closer.",
  "Hmm. Try once more — you're warmer.",
  "The door giggles. One more try?",
];

export default function ClueCard({ land }: { land: Land }) {
  const solveTrial = useMithila((s) => s.solveTrial);
  const closeOverlay = useMithila((s) => s.closeOverlay);
  const solve = () => {
    sfx.solve();
    setTimeout(() => sfx.gateOpen(), 500);
    if (navigator.vibrate) navigator.vibrate([30, 40, 90]);
    solveTrial(land.index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: "rgba(4,5,16,0.55)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mithila-card relative w-full max-w-md max-h-[86vh] overflow-y-auto mithila-noscrollbar px-6 py-8 md:px-10"
      >
        <button
          aria-label="close"
          onClick={closeOverlay}
          className="absolute top-4 right-4 rounded-full p-2"
          style={{ background: "rgba(245,240,232,0.07)" }}
        >
          <X size={16} style={{ opacity: 0.7 }} />
        </button>

        <div className="text-center mb-6">
          <div className="text-xs tracking-[0.35em] uppercase mb-2" style={{ opacity: 0.5 }}>
            {land.gateName} · {land.years}
          </div>
          <h2 className="italic text-3xl" style={{ color: "#f0b866" }}>
            {land.title}
          </h2>
          <p className="mt-3 text-sm italic" style={{ opacity: 0.65 }}>
            {land.intro}
          </p>
        </div>

        <PuzzleBody land={land} onSolve={solve} />
      </motion.div>
    </motion.div>
  );
}

function PuzzleBody({ land, onSolve }: { land: Land; onSolve: () => void }) {
  const p = land.puzzle;
  if (!p) return null;
  switch (p.type) {
    case "riddle":
      return <Riddle puzzle={p} onSolve={onSolve} />;
    case "song-guess":
      return <SongGuess puzzle={p} song={land.song} onSolve={onSolve} />;
    case "jigsaw":
      return <Jigsaw photo={p.photo} onSolve={onSolve} />;
    case "zoom-place":
      return <ZoomPlace puzzle={p} onSolve={onSolve} />;
    case "block-puzzle":
      return <BlockPuzzleGame onSolve={onSolve} />;
    case "two-truths":
      return <TwoTruths puzzle={p} onSolve={onSolve} />;
  }
}

function Riddle({
  puzzle,
  onSolve,
}: {
  puzzle: Extract<NonNullable<Land["puzzle"]>, { type: "riddle" }>;
  onSolve: () => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [shiver, setShiver] = useState(false);

  const badgeText =
    puzzle.badge === "wife" ? "one for the wife" : puzzle.badge === "mom" ? "one for the mom" : "for the wife & the mom";

  const submit = () => {
    if (matchAnswer(value, puzzle.answers)) onSolve();
    else {
      setWrong((w) => w + 1);
      setShiver(true);
      setTimeout(() => setShiver(false), 500);
    }
  };

  return (
    <div className={`text-center ${shiver ? "mithila-shiver" : ""}`}>
      <span className="mithila-badge mb-5">{badgeText}</span>
      <p className="whitespace-pre-line italic text-lg leading-relaxed my-6" style={{ opacity: 0.95 }}>
        {puzzle.prompt}
      </p>
      <input
        className="mithila-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="your answer…"
        autoComplete="off"
        autoCapitalize="off"
      />
      <button className="mithila-btn mt-5 w-full" onClick={submit}>
        open the gate
      </button>
      {wrong > 0 && (
        <p className="mt-5 text-sm italic" style={{ opacity: 0.7 }}>
          {wrong === 1 && wrongLines[0]}
          {wrong === 2 && `Hint: ${puzzle.hints[0]}`}
          {wrong >= 3 && `Bigger hint: ${puzzle.hints[1]}`}
        </p>
      )}
    </div>
  );
}
