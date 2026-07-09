"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { lands } from "./data";
import type { SideGameId } from "./collectibles";
import { coinDoorCost, coinsTowardDoor } from "./collectibles";

export type Phase = "gate" | "world" | "trial" | "gallery" | "finale" | "side-game" | "sequence";

export type SequenceId = "bridge-dash" | "lantern-chase";

// stage of life: 1 girl · 2 wife · 3 mom · 4 birthday queen
export function stageForFrontier(frontier: number): number {
  if (frontier >= 10) return 4;
  if (frontier >= 6) return 3;
  if (frontier >= 3) return 2;
  return 1;
}

type MithilaState = {
  unlocked: boolean;
  frontier: number;
  sparks: string[];
  coins: string[];
  doorsOpen: number[]; // land indices whose coin-door is paid
  actionFlags: { bridgeDash: boolean; lanternChase: boolean };
  lastLand: number;
  finaleSeen: boolean;
  muted: boolean;
  shownStage: number;
  phase: Phase;
  activeLand: number | null;
  activeSideGame: SideGameId | null;
  activeSequence: SequenceId | null;
  celebrateUntil: number;
  toast: string | null;
  /** brief photo flash after picking a coin */
  coinPhoto: string | null;
  travelTo: number | null;
  unlock: () => void;
  setPhase: (p: Phase) => void;
  openTrial: (landIndex: number) => void;
  solveTrial: (landIndex: number) => void;
  openGallery: (landIndex: number) => void;
  closeOverlay: () => void;
  collectSpark: (id: string) => void;
  collectCoin: (id: string) => void;
  clearCoinPhoto: () => void;
  tryOpenCoinDoor: (landIndex: number) => boolean;
  isCoinDoorReady: (landIndex: number) => boolean;
  openSideGame: (game: SideGameId) => void;
  startSequence: (id: SequenceId) => void;
  completeSequence: (id: SequenceId) => void;
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
      coins: [],
      doorsOpen: [],
      actionFlags: { bridgeDash: false, lanternChase: false },
      lastLand: 0,
      finaleSeen: false,
      muted: false,
      shownStage: 1,
      phase: "gate",
      activeLand: null,
      activeSideGame: null,
      activeSequence: null,
      celebrateUntil: 0,
      toast: null,
      coinPhoto: null,
      travelTo: null,
      unlock: () => set({ unlocked: true, phase: "world" }),
      setPhase: (p) => set({ phase: p }),
      isCoinDoorReady: (landIndex) => {
        const cost = coinDoorCost[landIndex];
        if (cost == null) return true;
        if (get().doorsOpen.includes(landIndex)) return true;
        return coinsTowardDoor(landIndex, get().coins) >= cost;
      },
      tryOpenCoinDoor: (landIndex) => {
        const cost = coinDoorCost[landIndex];
        if (cost == null) return true;
        if (get().doorsOpen.includes(landIndex)) return true;
        const have = coinsTowardDoor(landIndex, get().coins);
        if (have < cost) {
          set({ toast: `Need ${cost} coins from the last biome (${have}/${cost})` });
          return false;
        }
        set({
          doorsOpen: [...get().doorsOpen, landIndex],
          toast: `Door unlocked with ${cost} coins ✦`,
          celebrateUntil: Date.now() + 1600,
        });
        return true;
      },
      openTrial: (landIndex) => {
        if (!get().isCoinDoorReady(landIndex)) {
          get().tryOpenCoinDoor(landIndex);
          return;
        }
        if (!get().doorsOpen.includes(landIndex) && coinDoorCost[landIndex] != null) {
          get().tryOpenCoinDoor(landIndex);
        }
        set({ activeLand: landIndex, phase: "trial" });
      },
      solveTrial: (landIndex) => {
        const f = Math.max(get().frontier, landIndex + 1);
        set({ frontier: f, phase: "world", activeLand: null, celebrateUntil: Date.now() + 2200 });
      },
      openGallery: (landIndex) => set({ activeLand: landIndex, phase: "gallery" }),
      closeOverlay: () =>
        set({ phase: "world", activeLand: null, activeSideGame: null, activeSequence: null }),
      collectSpark: (id) => {
        const s = get().sparks;
        if (!s.includes(id)) set({ sparks: [...s, id] });
      },
      collectCoin: (id) => {
        const c = get().coins;
        if (c.includes(id)) return;
        // random photo from the whole journey
        const pool = lands.flatMap((l) => l.photos.map((p) => p.src));
        const photo = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
        set({ coins: [...c, id], coinPhoto: photo });
      },
      clearCoinPhoto: () => set({ coinPhoto: null }),
      openSideGame: (game) => set({ activeSideGame: game, phase: "side-game" }),
      startSequence: (id) => set({ activeSequence: id, phase: "sequence" }),
      completeSequence: (id) => {
        const flags = { ...get().actionFlags };
        if (id === "bridge-dash") flags.bridgeDash = true;
        if (id === "lantern-chase") flags.lanternChase = true;
        set({
          actionFlags: flags,
          phase: "world",
          activeSequence: null,
          celebrateUntil: Date.now() + 1800,
          toast: id === "bridge-dash" ? "Bridge crossed ✦" : "Lanterns gathered ✦",
        });
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
          coins: [],
          doorsOpen: [],
          actionFlags: { bridgeDash: false, lanternChase: false },
          lastLand: 0,
          finaleSeen: false,
          shownStage: 1,
          phase: "world",
          activeLand: null,
          activeSideGame: null,
          activeSequence: null,
          celebrateUntil: 0,
          coinPhoto: null,
          travelTo: 0,
        }),
    }),
    {
      name: "mithila:v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        unlocked: s.unlocked,
        frontier: s.frontier,
        sparks: s.sparks,
        coins: s.coins,
        doorsOpen: s.doorsOpen,
        actionFlags: s.actionFlags,
        lastLand: s.lastLand,
        finaleSeen: s.finaleSeen,
        muted: s.muted,
        shownStage: s.shownStage,
      }),
    }
  )
);

export const landCount = lands.length;
