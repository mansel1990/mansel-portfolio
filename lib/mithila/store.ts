"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { lands } from "./data";

export type Phase = "gate" | "world" | "trial" | "gallery" | "finale";

// stage of life: 1 girl · 2 wife · 3 mom · 4 birthday queen
export function stageForFrontier(frontier: number): number {
  if (frontier >= 10) return 4;
  if (frontier >= 6) return 3;
  if (frontier >= 3) return 2;
  return 1;
}

type MithilaState = {
  // persisted
  unlocked: boolean; // entry password passed
  frontier: number; // how many lands are accessible (1..10)
  sparks: string[]; // collected spark ids
  lastLand: number; // where she was standing (land index)
  finaleSeen: boolean;
  muted: boolean;
  shownStage: number; // highest stage whose transformation moment has played
  // ephemeral
  phase: Phase;
  activeLand: number | null;
  celebrateUntil: number; // ms timestamp — character plays celebrate anim
  toast: string | null;
  travelTo: number | null; // land index for fast travel, consumed by World
  // actions
  unlock: () => void;
  setPhase: (p: Phase) => void;
  openTrial: (landIndex: number) => void;
  solveTrial: (landIndex: number) => void;
  openGallery: (landIndex: number) => void;
  closeOverlay: () => void;
  collectSpark: (id: string) => void;
  setLastLand: (i: number) => void;
  markStageShown: (s: number) => void;
  setToast: (t: string | null) => void;
  fastTravel: (landIndex: number) => void;
  consumeTravel: () => void;
  toggleMute: () => void;
  setFinaleSeen: () => void;
  restart: () => void;
};

export const useMithila = create<MithilaState>()(
  persist(
    (set, get) => ({
      unlocked: false,
      frontier: 1,
      sparks: [],
      lastLand: 0,
      finaleSeen: false,
      muted: false,
      shownStage: 1,
      phase: "gate",
      activeLand: null,
      celebrateUntil: 0,
      toast: null,
      travelTo: null,
      unlock: () => set({ unlocked: true, phase: "world" }),
      setPhase: (p) => set({ phase: p }),
      openTrial: (landIndex) => set({ activeLand: landIndex, phase: "trial" }),
      solveTrial: (landIndex) => {
        const f = Math.max(get().frontier, landIndex + 1);
        set({ frontier: f, phase: "world", activeLand: null, celebrateUntil: Date.now() + 2200 });
      },
      openGallery: (landIndex) => set({ activeLand: landIndex, phase: "gallery" }),
      closeOverlay: () => set({ phase: "world", activeLand: null }),
      collectSpark: (id) => {
        const s = get().sparks;
        if (!s.includes(id)) set({ sparks: [...s, id] });
      },
      setLastLand: (i) => set({ lastLand: i }),
      markStageShown: (s) => set({ shownStage: Math.max(get().shownStage, s) }),
      setToast: (t) => set({ toast: t }),
      fastTravel: (landIndex) => {
        if (landIndex < get().frontier) set({ travelTo: landIndex });
      },
      consumeTravel: () => set({ travelTo: null }),
      toggleMute: () => set({ muted: !get().muted }),
      setFinaleSeen: () => set({ finaleSeen: true, phase: "world" }),
      restart: () =>
        set({
          frontier: 1,
          sparks: [],
          lastLand: 0,
          finaleSeen: false,
          shownStage: 1,
          phase: "world",
          activeLand: null,
          celebrateUntil: 0,
          travelTo: 0,
        }),
    }),
    {
      name: "mithila:v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        unlocked: s.unlocked,
        frontier: s.frontier,
        sparks: s.sparks,
        lastLand: s.lastLand,
        finaleSeen: s.finaleSeen,
        muted: s.muted,
        shownStage: s.shownStage,
      }),
    }
  )
);

export const landCount = lands.length;
