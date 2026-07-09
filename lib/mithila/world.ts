import * as THREE from "three";
import { lands } from "./data";

// ---------- the road ----------
export const LAND_COUNT = lands.length;
const LAND_LEN = 26;

const controlPoints: THREE.Vector3[] = [];
for (let i = 0; i <= LAND_COUNT; i++) {
  controlPoints.push(new THREE.Vector3(Math.sin(i * 1.35) * 11, 0, -i * LAND_LEN));
}
export const road = new THREE.CatmullRomCurve3(controlPoints, false, "catmullrom", 0.35);

export const ROAD_SAMPLES = 600;
export const samples: THREE.Vector3[] = road.getSpacedPoints(ROAD_SAMPLES);

export function pointAt(t: number): THREE.Vector3 {
  return road.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
}

export function tangentAt(t: number): THREE.Vector3 {
  return road.getTangentAt(THREE.MathUtils.clamp(t, 0.0005, 0.9995));
}

const UP = new THREE.Vector3(0, 1, 0);

/** position offset sideways from the road at t (side>0 = left of travel) */
export function sideAt(t: number, side: number, forward = 0): THREE.Vector3 {
  const p = pointAt(t).clone();
  const tan = tangentAt(t);
  const normal = new THREE.Vector3().crossVectors(UP, tan).normalize();
  p.addScaledVector(normal, side);
  p.addScaledVector(tan, forward);
  return p;
}

/** yaw so an object faces travel direction at t */
export function yawAt(t: number): number {
  const tan = tangentAt(t);
  return Math.atan2(tan.x, tan.z);
}

/** nearest curve t to a world point (within maxDist laterally), else null */
export function nearestT(p: THREE.Vector3, maxDist = 9): number | null {
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i <= ROAD_SAMPLES; i++) {
    const d = (samples[i].x - p.x) ** 2 + (samples[i].z - p.z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  if (Math.sqrt(bestD) > maxDist) return null;
  return best / ROAD_SAMPLES;
}

// land <-> t mapping
export const landT = {
  start: (i: number) => i / LAND_COUNT,
  center: (i: number) => (i + 0.5) / LAND_COUNT,
  end: (i: number) => (i + 1) / LAND_COUNT,
};

export function landOf(t: number): number {
  return Math.min(LAND_COUNT - 1, Math.max(0, Math.floor(t * LAND_COUNT)));
}

/** max walkable t for a given frontier (stop just before the next locked gate) */
export function maxT(frontier: number): number {
  if (frontier >= LAND_COUNT) return 0.999;
  return frontier / LAND_COUNT - 0.008;
}

// ---------- road ribbon geometry ----------
export function buildRoadGeometry(width = 1.4): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const n = 400;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = pointAt(t);
    const tan = tangentAt(t);
    const normal = new THREE.Vector3().crossVectors(UP, tan).normalize();
    pos.push(p.x + normal.x * width, 0.03, p.z + normal.z * width);
    pos.push(p.x - normal.x * width, 0.03, p.z - normal.z * width);
    if (i < n) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// ---------- sparks (36 collectibles) ----------
export type SparkDef = { id: string; pos: THREE.Vector3; land: number };

export function buildSparks(): SparkDef[] {
  const counts = [3, 3, 4, 3, 3, 4, 4, 4, 4, 4]; // = 36
  const out: SparkDef[] = [];
  counts.forEach((count, land) => {
    for (let k = 0; k < count; k++) {
      const t = landT.start(land) + ((k + 0.6) / (count + 0.8)) / LAND_COUNT;
      const side = (k % 2 === 0 ? 1 : -1) * (2.5 + ((land * 7 + k * 13) % 40) / 12);
      const p = sideAt(t, side);
      p.y = 0.9 + ((land + k) % 3) * 0.5;
      out.push({ id: `s${land}-${k}`, pos: p, land });
    }
  });
  return out;
}
