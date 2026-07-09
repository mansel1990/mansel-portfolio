"use client";

import { motion } from "framer-motion";
import type { Land } from "@/lib/mithila/data";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "./audio";
import { X } from "lucide-react";
import SongGuess from "./minigames/SongGuess";
import Jigsaw from "./minigames/Jigsaw";
import ZoomPlace from "./minigames/ZoomPlace";
import BeatTap from "./minigames/BeatTap";
import MemoryFlip from "./minigames/MemoryFlip";
import WhichEra from "./minigames/WhichEra";
import StripShuffle from "./minigames/StripShuffle";
import OddOneOut from "./minigames/OddOneOut";
import MedleyScrub from "./minigames/MedleyScrub";

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
    case "song-guess":
      return <SongGuess puzzle={p} song={land.song} onSolve={onSolve} />;
    case "jigsaw":
      return <Jigsaw photo={p.photo} onSolve={onSolve} />;
    case "zoom-place":
      return <ZoomPlace puzzle={p} onSolve={onSolve} />;
    case "beat-tap":
      return <BeatTap puzzle={p} song={land.song} onSolve={onSolve} />;
    case "memory-flip":
      return <MemoryFlip puzzle={p} onSolve={onSolve} />;
    case "which-era":
      return <WhichEra puzzle={p} song={land.song} onSolve={onSolve} />;
    case "strip-shuffle":
      return <StripShuffle puzzle={p} onSolve={onSolve} />;
    case "odd-one-out":
      return <OddOneOut puzzle={p} onSolve={onSolve} />;
    case "medley-scrub":
      return <MedleyScrub puzzle={p} onSolve={onSolve} />;
  }
}
