"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useMithila } from "@/lib/mithila/store";
import { lands, medleySrc } from "@/lib/mithila/data";
import { audio } from "./audio";
import Gate from "./Gate";
import World from "./World";
import ClueCard from "./ClueCard";
import MemoryBloom from "./MemoryBloom";
import Finale from "./Finale";
import SideGames from "./SideGames";
import BridgeDash from "./sequences/BridgeDash";
import LanternChase from "./sequences/LanternChase";
import { Toast, TopBar, MiniMap, PauseMenu } from "./hud";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function MithilaApp() {
  const unlocked = useMithila((s) => s.unlocked);
  const phase = useMithila((s) => s.phase);
  const setPhase = useMithila((s) => s.setPhase);
  const activeLand = useMithila((s) => s.activeLand);
  const activeSideGame = useMithila((s) => s.activeSideGame);
  const activeSequence = useMithila((s) => s.activeSequence);
  const muted = useMithila((s) => s.muted);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setWebgl(hasWebGL());
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (unlocked && phase === "gate") setPhase("world");
  }, [hydrated, unlocked, phase, setPhase]);

  // Returning from /mithila/gallery (or a refresh mid-overlay) should never re-open finale/trials
  useEffect(() => {
    if (!hydrated || !unlocked) return;
    const overlay =
      phase === "finale" ||
      phase === "trial" ||
      phase === "gallery" ||
      phase === "side-game" ||
      phase === "sequence";
    if (overlay) {
      // Visiting the photo gallery from the finale counts as finishing it
      if (phase === "finale") useMithila.getState().setFinaleSeen();
      else setPhase("world");
    }
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only settle

  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (phase === "world" && unlocked) {
      audio.playMusic(medleySrc, { loop: true, volume: 0.75 });
    }
  }, [phase, unlocked]);

  // Duck BGM only during interactive games — never while walking / gallery / finale
  useEffect(() => {
    const inGame = phase === "trial" || phase === "side-game" || phase === "sequence";
    audio.duckMusic(inGame);
    return () => {
      // Leaving a game (or unmount) always restores full walking volume
      if (inGame) audio.duckMusic(false);
    };
  }, [phase]);

  // Don't stopAll on unmount — navigating to /mithila/gallery should keep the medley.

  if (!hydrated || webgl === null) return null;

  const land = activeLand !== null ? lands[activeLand] : null;

  return (
    <div className="mithila-serif fixed inset-0 mithila-vignette mithila-grain" style={{ color: "#f5f0e8" }}>
      {!unlocked ? (
        <Gate />
      ) : !webgl ? (
        <Fallback2D />
      ) : (
        <>
          <World />
          <TopBar onMap={() => setShowMap(true)} onMenu={() => setShowMenu(true)} />
          <Toast />
          <MiniMap open={showMap} onClose={() => setShowMap(false)} />
          <PauseMenu open={showMenu} onClose={() => setShowMenu(false)} />

          <AnimatePresence>
            {phase === "trial" && land && <ClueCard key={"trial" + land.id} land={land} />}
            {phase === "gallery" && land && <MemoryBloom key={"gal" + land.id} land={land} />}
            {phase === "finale" && <Finale key="finale" />}
            {phase === "side-game" && activeSideGame && (
              <SideGames key={activeSideGame} game={activeSideGame} />
            )}
            {phase === "sequence" && activeSequence === "bridge-dash" && <BridgeDash key="bridge" />}
            {phase === "sequence" && activeSequence === "lantern-chase" && <LanternChase key="lantern" />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function Fallback2D() {
  const frontier = useMithila((s) => s.frontier);
  const openTrial = useMithila((s) => s.openTrial);
  const openGallery = useMithila((s) => s.openGallery);
  const phase = useMithila((s) => s.phase);
  const activeLand = useMithila((s) => s.activeLand);
  const setPhase = useMithila((s) => s.setPhase);
  const finaleSeen = useMithila((s) => s.finaleSeen);
  const land = activeLand !== null ? lands[activeLand] : null;

  return (
    <div className="absolute inset-0 overflow-y-auto mithila-noscrollbar px-6 py-16">
      <h1 className="text-center italic text-3xl mb-10" style={{ color: "#f0b866" }}>
        The Long Walk Home
      </h1>
      <div className="max-w-md mx-auto space-y-4">
        {lands.map((l, i) => {
          const open = i < frontier;
          const isNext = i === frontier;
          return (
            <button
              key={l.id}
              disabled={!open && !isNext}
              onClick={() => (open ? openGallery(i) : openTrial(i))}
              className="w-full text-left mithila-card px-6 py-5"
              style={{ opacity: open || isNext ? 1 : 0.35 }}
            >
              <div className="italic text-xl" style={{ color: open ? "#f0b866" : "#f5f0e8" }}>
                {open || isNext ? l.title : "· · ·"}
              </div>
              <div className="text-sm tracking-widest" style={{ opacity: 0.6 }}>
                {l.years} {isNext && "· tap to open the gate"}
              </div>
            </button>
          );
        })}
        {frontier >= lands.length && !finaleSeen && (
          <button className="mithila-btn w-full" onClick={() => setPhase("finale")}>
            enter Birthday City ✦
          </button>
        )}
      </div>
      <AnimatePresence>
        {phase === "trial" && land && <ClueCard key={"trial" + land.id} land={land} />}
        {phase === "gallery" && land && <MemoryBloom key={"gal" + land.id} land={land} />}
        {phase === "finale" && <Finale key="finale" />}
      </AnimatePresence>
    </div>
  );
}
