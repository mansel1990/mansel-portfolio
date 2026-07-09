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
  const { unlocked, phase, setPhase, activeLand, muted } = useMithila();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // async callback avoids a sync setState in the effect body
    const id = requestAnimationFrame(() => {
      setWebgl(hasWebGL());
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // restore phase after hydration
  useEffect(() => {
    if (!hydrated) return;
    if (unlocked && phase === "gate") setPhase("world");
  }, [hydrated, unlocked, phase, setPhase]);

  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  // when the finale hands back control, bring the medley home
  useEffect(() => {
    if (phase === "world" && unlocked && useMithila.getState().finaleSeen) {
      audio.playMusic(medleySrc, { loop: true, volume: 0.75 });
    }
  }, [phase, unlocked]);

  useEffect(() => () => audio.stopAll(), []);

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
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ---------- graceful non-WebGL fallback: the road as a list ----------
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
