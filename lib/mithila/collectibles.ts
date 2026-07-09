import * as THREE from "three";
import { landT, sideAt, LAND_COUNT } from "./world";

export type CoinDef = { id: string; land: number; pos: THREE.Vector3 };
export type TunnelDef = {
  id: string;
  land: number;
  /** mouth position */
  pos: THREE.Vector3;
  yaw: number;
  /** which side-game to open */
  game: SideGameId;
  label: string;
};

export type SideGameId =
  | "song-to-photo"
  | "lyric-pick"
  | "speed-round"
  | "mute-odd-one"
  | "cover-guess"
  | "spot-the-diff"
  | "era-order";

/** Coins needed before the gate trial can open (null = no coin door). */
export const coinDoorCost: Record<number, number | null> = {
  0: null,
  1: 5, // Bridge — Beat Tap
  2: null, // Wedding jigsaw free
  3: 6, // Little House
  4: null,
  5: 5, // Quiet Valley
  6: 8, // Bloom
  7: null,
  8: 6, // Yesterday
  9: 8, // Birthday City
};

/**
 * Coins that count toward opening gate at `landIndex`.
 * Uses the biome you just walked (landIndex - 1), so First City coins open the Bridge gate.
 */
export function coinsTowardDoor(landIndex: number, coinIds: string[]): number {
  const from = Math.max(0, landIndex - 1);
  return coinIds.filter((id) => id.startsWith(`c${from}-`)).length;
}

export function buildCoins(): CoinDef[] {
  const out: CoinDef[] = [];
  for (let land = 0; land < LAND_COUNT; land++) {
    const count = land === 0 ? 8 : 8;
    for (let k = 0; k < count; k++) {
      const t = landT.start(land) + ((k + 0.4) / (count + 0.2)) / LAND_COUNT;
      // keep coins near the path so stick/walk picks them up easily
      const side = (k % 2 === 0 ? 1 : -1) * (1.6 + (k % 4) * 0.55);
      const p = sideAt(t, side, (k % 3) * 0.4 - 0.4);
      p.y = 0.7;
      out.push({ id: `c${land}-${k}`, land, pos: p });
    }
  }
  return out;
}

export function buildTunnels(): TunnelDef[] {
  const specs: { land: number; side: number; game: SideGameId; label: string }[] = [
    { land: 2, side: -6.5, game: "cover-guess", label: "Quiet pavilion" },
    { land: 3, side: 6.8, game: "spot-the-diff", label: "Cracked wall" },
    { land: 4, side: -6.2, game: "lyric-pick", label: "Radio nook" },
    { land: 6, side: 7, game: "speed-round", label: "Hedge tunnel" },
    { land: 7, side: -6.5, game: "song-to-photo", label: "Baggage tunnel" },
    { land: 8, side: 6.5, game: "mute-odd-one", label: "Photo alley" },
    { land: 8, side: -7, game: "era-order", label: "Clock passage" },
  ];
  return specs.map((s, i) => {
    const t = landT.center(s.land);
    const pos = sideAt(t, s.side);
    pos.y = 0;
    const tan = sideAt(t, 0);
    const yaw = Math.atan2(pos.x - tan.x, pos.z - tan.z);
    return { id: `tun-${i}`, land: s.land, pos, yaw, game: s.game, label: s.label };
  });
}

export const TOTAL_COINS = buildCoins().length;
