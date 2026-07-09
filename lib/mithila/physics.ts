import * as THREE from "three";
import { lands } from "./data";
import { landT, sideAt, LAND_COUNT } from "./world";

export const BIOME_RADIUS = 15;

export type BiomePad = {
  index: number;
  center: THREE.Vector3;
  radius: number;
};

export function biomePads(): BiomePad[] {
  return lands.map((_, i) => {
    const c = sideAt(landT.center(i), 0);
    return { index: i, center: c, radius: BIOME_RADIUS };
  });
}

/** Clamp world XZ into the union of unlocked biome pads (frontier = accessible count). */
export function clampToBiomes(
  x: number,
  z: number,
  frontier: number,
  pads: BiomePad[],
): { x: number; z: number; land: number } {
  const maxLand = Math.min(frontier, LAND_COUNT) - 1;
  if (maxLand < 0) {
    const p = pads[0];
    return { x: p.center.x, z: p.center.z, land: 0 };
  }

  let best = pads[0];
  let bestD = Infinity;
  for (let i = 0; i <= maxLand; i++) {
    const p = pads[i];
    const dx = x - p.center.x;
    const dz = z - p.center.z;
    const d = Math.hypot(dx, dz);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }

  if (bestD <= best.radius) return { x, z, land: best.index };

  const dx = x - best.center.x;
  const dz = z - best.center.z;
  const scale = best.radius / (bestD || 1);
  return {
    x: best.center.x + dx * scale,
    z: best.center.z + dz * scale,
    land: best.index,
  };
}

/** Distance from player to the locked gate of `frontier` (gate sits at land start). */
export function distToFrontierGate(x: number, z: number, frontier: number): number {
  if (frontier >= LAND_COUNT) return Infinity;
  const g = sideAt(landT.start(frontier), 0);
  return Math.hypot(x - g.x, z - g.z);
}
