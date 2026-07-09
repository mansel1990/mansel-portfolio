"use client";

/* eslint-disable react-hooks/immutability -- R3F game loop: mutating refs/materials in useFrame/handlers is the intended pattern */
import { useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import { lands } from "@/lib/mithila/data";
import { landT, sideAt, yawAt, buildSparks } from "@/lib/mithila/world";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "./audio";

const flat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, ...extra });

// ============ Poke: makes any prop tappable (wiggle + sfx + plaque) ============
function Poke({
  children,
  plaque,
  position,
  rotation,
  scale,
}: {
  children: React.ReactNode;
  plaque?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const g = useRef<THREE.Group>(null);
  const impulse = useRef(0);
  const setToast = useMithila((s) => s.setToast);

  useFrame((_, delta) => {
    if (!g.current) return;
    if (impulse.current > 0.01) {
      impulse.current *= Math.pow(0.02, delta); // decay
      const w = Math.sin(Date.now() * 0.045) * impulse.current;
      g.current.rotation.z = w * 0.22;
      const s = (scale ?? 1) * (1 + impulse.current * 0.08);
      g.current.scale.setScalar(s);
    } else {
      g.current.rotation.z = 0;
      g.current.scale.setScalar(scale ?? 1);
    }
  });

  return (
    <group
      ref={g}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        impulse.current = 1;
        sfx.wiggle();
        if (plaque) setToast(plaque);
        if (navigator.vibrate) navigator.vibrate(15);
      }}
    >
      {children}
    </group>
  );
}

// ============ prop kit (all primitives, flat shaded) ============
function Tree({ color = "#4a8a4f", trunk = "#6b4a33" }: { color?: string; trunk?: string }) {
  const mats = useMemo(() => ({ leaf: flat(color), trunk: flat(trunk) }), [color, trunk]);
  return (
    <group>
      <mesh material={mats.trunk} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 1, 6]} />
      </mesh>
      <mesh material={mats.leaf} position={[0, 1.35, 0]}>
        <icosahedronGeometry args={[0.62, 0]} />
      </mesh>
    </group>
  );
}

function Lamp({ accent = "#f0b866", lit = true }: { accent?: string; lit?: boolean }) {
  const mats = useMemo(
    () => ({
      post: flat("#3a3f52"),
      glow: flat(accent, lit ? { emissive: accent, emissiveIntensity: 1.4 } : {}),
    }),
    [accent, lit]
  );
  return (
    <group>
      <mesh material={mats.post} position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.8, 6]} />
      </mesh>
      <mesh material={mats.glow} position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
      </mesh>
    </group>
  );
}

function House({ wall = "#e8d8b8", roof = "#c65c50" }: { wall?: string; roof?: string }) {
  const mats = useMemo(() => ({ wall: flat(wall), roof: flat(roof), win: flat("#ffd98a", { emissive: "#ffb84d", emissiveIntensity: 0.9 }) }), [wall, roof]);
  return (
    <group>
      <mesh material={mats.wall} position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 1.6, 1.6]} />
      </mesh>
      <mesh material={mats.roof} position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.7, 0.9, 4]} />
      </mesh>
      <mesh material={mats.win} position={[0.5, 0.85, 0.81]}>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
      </mesh>
      <mesh material={mats.win} position={[-0.5, 0.85, 0.81]}>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
      </mesh>
    </group>
  );
}

function Bench() {
  const m = useMemo(() => flat("#8a6b4a"), []);
  return (
    <group>
      <mesh material={m} position={[0, 0.42, 0]}>
        <boxGeometry args={[1.3, 0.08, 0.4]} />
      </mesh>
      <mesh material={m} position={[0, 0.7, -0.18]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.3, 0.5, 0.06]} />
      </mesh>
      <mesh material={m} position={[0.55, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.42, 0.36]} />
      </mesh>
      <mesh material={m} position={[-0.55, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.42, 0.36]} />
      </mesh>
    </group>
  );
}

// spinning / floating specials
function Spinner({ children, speed = 1, axis = "y" }: { children: React.ReactNode; speed?: number; axis?: "y" | "x" }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation[axis] += d * speed;
  });
  return <group ref={g}>{children}</group>;
}

function Bobber({ children, amp = 0.2, speed = 1.4, phase = 0 }: { children: React.ReactNode; amp?: number; speed?: number; phase?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * speed + phase) * amp;
  });
  return <group ref={g}>{children}</group>;
}

// ============ the photo pavilion (glowing frame; tap -> gallery) ============
function PavilionInner({ landIndex }: { landIndex: number }) {
  const land = lands[landIndex];
  const tex = useTexture(land.photos[0].src);
  const openGallery = useMithila((s) => s.openGallery);
  const frame = useMemo(() => flat("#f0b866", { emissive: "#f0b866", emissiveIntensity: 0.25 }), []);
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        sfx.tap();
        openGallery(landIndex);
      }}
    >
      <mesh material={frame} position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 2, 0.12]} />
      </mesh>
      <mesh position={[0, 1.5, 0.08]}>
        <planeGeometry args={[2.2, 1.7]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh material={frame} position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.09, 0.13, 0.5, 6]} />
      </mesh>
      <Html position={[0, 2.8, 0]} center distanceFactor={11} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="mithila-serif italic text-center" style={{ color: "#f0b866", fontSize: 20, width: 200, textShadow: "0 2px 12px #000" }}>
          {land.title} ✦ photos
        </div>
      </Html>
    </group>
  );
}

function Pavilion({ landIndex }: { landIndex: number }) {
  return (
    <Suspense fallback={null}>
      <PavilionInner landIndex={landIndex} />
    </Suspense>
  );
}

// ============ the gates ============
export function Gate({ landIndex }: { landIndex: number }) {
  const land = lands[landIndex];
  const frontier = useMithila((s) => s.frontier);
  const open = frontier > landIndex;
  const lDoor = useRef<THREE.Mesh>(null);
  const rDoor = useRef<THREE.Mesh>(null);
  const openAmt = useRef(open ? 1 : 0);

  const t = landT.start(landIndex);
  const pos = sideAt(t, 0);
  const yaw = yawAt(t);

  const mats = useMemo(
    () => ({
      pillar: flat(landIndex === 9 ? "#8a7440" : "#5c5468"),
      door: flat(land.accent, landIndex === 9 ? { emissive: land.accent, emissiveIntensity: 0.5 } : {}),
      beam: flat("#3f3a4f"),
    }),
    [land, landIndex]
  );

  useFrame((_, d) => {
    const target = open ? 1 : 0;
    openAmt.current += (target - openAmt.current) * Math.min(1, d * 2.2);
    const a = openAmt.current * 1.9; // door swing angle
    if (lDoor.current) lDoor.current.rotation.y = a;
    if (rDoor.current) rDoor.current.rotation.y = -a;
  });

  const W = 2.1; // half width
  const H = landIndex === 9 ? 4.4 : 3.4;

  return (
    <group position={[pos.x, 0, pos.z]} rotation={[0, yaw, 0]}>
      {/* pillars + beam */}
      <mesh material={mats.pillar} position={[W, H / 2, 0]}>
        <boxGeometry args={[0.5, H, 0.6]} />
      </mesh>
      <mesh material={mats.pillar} position={[-W, H / 2, 0]}>
        <boxGeometry args={[0.5, H, 0.6]} />
      </mesh>
      <mesh material={mats.beam} position={[0, H, 0]}>
        <boxGeometry args={[W * 2 + 0.8, 0.55, 0.7]} />
      </mesh>
      {/* doors (skip for land 0 — the open tutorial arch) */}
      {landIndex > 0 && (
        <>
          <group position={[-W + 0.28, 0, 0]}>
            <mesh ref={lDoor} material={mats.door} position={[0, (H - 0.6) / 2, 0]}>
              <boxGeometry args={[W - 0.25, H - 0.6, 0.16]} />
            </mesh>
          </group>
          <group position={[W - 0.28, 0, 0]}>
            <mesh ref={rDoor} material={mats.door} position={[0, (H - 0.6) / 2, 0]}>
              <boxGeometry args={[W - 0.25, H - 0.6, 0.16]} />
            </mesh>
          </group>
        </>
      )}
      {/* gate name */}
      <Html position={[0, H + 0.8, 0]} center distanceFactor={12} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="mithila-serif text-center" style={{ width: 240 }}>
          <div className="italic" style={{ fontSize: 20, color: open ? "#f0b866" : "#f5f0e8", opacity: open ? 1 : 0.75, textShadow: "0 2px 10px #000" }}>
            {land.gateName}
          </div>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", opacity: 0.6, color: "#f5f0e8" }}>
            {open ? land.years : "locked"}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ============ per-land set dressing ============
function LandProps({ landIndex }: { landIndex: number }) {
  const land = lands[landIndex];
  const frontier = useMithila((s) => s.frontier);
  const unlockedHere = frontier > landIndex;
  const c = landT.center(landIndex);
  const s = landT.start(landIndex);
  const p = (dt: number, side: number) => {
    const v = sideAt(s + dt / 10, side);
    return [v.x, 0, v.z] as [number, number, number];
  };
  const plq = land.plaques;

  // shared, per-land themed props — kept intentionally simple & cute
  return (
    <group>
      {/* every land: trees + lamps flanking the road */}
      <Poke position={p(0.25, 4)} plaque={plq[0]}>
        <Tree color={land.ground === "#c9a44f" ? "#c9a44f" : "#4a8a4f"} />
      </Poke>
      <Poke position={p(0.55, -4.5)}>
        <Tree color="#5c9a5c" />
      </Poke>
      <Poke position={p(0.42, 2.6)}>
        <Lamp accent={land.accent} lit={unlockedHere} />
      </Poke>
      <Poke position={p(0.72, -2.6)}>
        <Lamp accent={land.accent} lit={unlockedHere} />
      </Poke>

      {/* land-specific hero props */}
      {landIndex === 0 && (
        <>
          <Poke position={p(0.35, -5.5)} plaque={plq[2]}>
            <House wall="#e8c8a8" roof="#b85c50" />
          </Poke>
          <Poke position={p(0.6, 5)} plaque={plq[1]}>
            <Bench />
          </Poke>
        </>
      )}
      {landIndex === 1 && (
        <>
          <Poke position={p(0.5, 3.8)} plaque={plq[1]}>
            <Bench />
          </Poke>
          {/* paper boats bobbing */}
          {[0, 1, 2].map((k) => (
            <group key={k} position={p(0.3 + k * 0.18, -5 - k)}>
              <Bobber amp={0.12} speed={1.2 + k * 0.3} phase={k}>
                <Poke plaque={k === 0 ? plq[0] : undefined}>
                  <mesh material={flat("#f5f0e8")} rotation={[0, k, 0]}>
                    <coneGeometry args={[0.25, 0.3, 4]} />
                  </mesh>
                </Poke>
              </Bobber>
            </group>
          ))}
        </>
      )}
      {landIndex === 2 && (
        <>
          {/* mandap: 4 pillars + roof + marigold */}
          <Poke position={p(0.5, -5)} plaque={plq[0]}>
            <group>
              {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], k) => (
                <mesh key={k} material={flat("#c62f35")} position={[x, 1, z]}>
                  <cylinderGeometry args={[0.09, 0.09, 2, 6]} />
                </mesh>
              ))}
              <mesh material={flat("#f0b866", { emissive: "#f0b866", emissiveIntensity: 0.2 })} position={[0, 2.15, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[1.8, 0.7, 4]} />
              </mesh>
              {[0, 1, 2, 3].map((k) => (
                <mesh key={"g" + k} material={flat("#ff9a3f")} position={[Math.sin(k * 1.57) * 1, 1.7, Math.cos(k * 1.57) * 1]}>
                  <torusGeometry args={[0.18, 0.05, 6, 10]} />
                </mesh>
              ))}
            </group>
          </Poke>
          <Poke position={p(0.68, 4.2)} plaque={plq[1]}>
            <group>
              <mesh material={flat("#8a5c3f")} position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.34, 0.5, 8]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 3 && (
        <>
          <Poke position={p(0.5, -5.5)} plaque={plq[2]}>
            <House wall="#f5e8c8" roof="#5c8aa8" />
          </Poke>
          {/* clothesline */}
          <Poke position={p(0.65, 4.5)} plaque={plq[0]}>
            <group>
              <mesh material={flat("#6b4a33")} position={[-1, 0.8, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.6, 5]} />
              </mesh>
              <mesh material={flat("#6b4a33")} position={[1, 0.8, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.6, 5]} />
              </mesh>
              {["#e8788a", "#5cb8a8", "#f0b866"].map((cc, k) => (
                <mesh key={k} material={flat(cc)} position={[-0.6 + k * 0.6, 1.25, 0]}>
                  <boxGeometry args={[0.4, 0.5, 0.02]} />
                </mesh>
              ))}
            </group>
          </Poke>
          {/* the cat */}
          <Poke position={p(0.38, 3)} plaque={plq[1]}>
            <group>
              <mesh material={flat("#3a3a3a")} position={[0, 0.22, 0]}>
                <capsuleGeometry args={[0.14, 0.25, 4, 6]} />
              </mesh>
              <mesh material={flat("#3a3a3a")} position={[0, 0.48, 0.12]}>
                <sphereGeometry args={[0.12, 8, 8]} />
              </mesh>
              <mesh material={flat("#3a3a3a")} position={[0.07, 0.6, 0.12]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.05, 0.1, 4]} />
              </mesh>
              <mesh material={flat("#3a3a3a")} position={[-0.07, 0.6, 0.12]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.05, 0.1, 4]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 4 && (
        <>
          {/* wheat tufts */}
          {[0, 1, 2, 3, 4].map((k) => (
            <Poke key={k} position={p(0.25 + k * 0.12, k % 2 ? 3.4 + k : -3.4 - k)} plaque={k === 2 ? plq[2] : undefined}>
              <mesh material={flat("#d8b85c")} position={[0, 0.4, 0]}>
                <coneGeometry args={[0.3, 0.85, 5]} />
              </mesh>
            </Poke>
          ))}
          {/* radio on fence */}
          <Poke position={p(0.55, 4.6)} plaque={plq[0]}>
            <group>
              <mesh material={flat("#8a6b4a")} position={[0, 0.5, 0]}>
                <boxGeometry args={[1.4, 0.1, 0.1]} />
              </mesh>
              <mesh material={flat("#c65c50")} position={[0, 0.75, 0]}>
                <boxGeometry args={[0.45, 0.3, 0.2]} />
              </mesh>
            </group>
          </Poke>
          {/* kite in tree */}
          <Poke position={p(0.8, -4)} plaque={plq[1]}>
            <group>
              <Tree color="#6b9a4a" />
              <mesh material={flat("#e8788a")} position={[0.4, 1.7, 0.3]} rotation={[0.3, 0.5, 0.78]}>
                <planeGeometry args={[0.5, 0.5]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 5 && (
        <>
          {/* the cradle */}
          <Poke position={p(0.5, -3.6)} plaque={plq[1]}>
            <group>
              <mesh material={flat("#d8c8a8", { emissive: "#ffd98a", emissiveIntensity: 0.35 })} position={[0, 0.4, 0]}>
                <boxGeometry args={[0.8, 0.4, 0.5]} />
              </mesh>
              <mesh material={flat("#8a6b4a")} position={[0, 0.12, 0]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.9, 0.08, 0.55]} />
              </mesh>
            </group>
          </Poke>
          {/* calendar */}
          <Poke position={p(0.62, 3.4)} plaque={plq[0]}>
            <group>
              <mesh material={flat("#f5f0e8")} position={[0, 1, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.06]} />
              </mesh>
              <Html position={[0, 1, 0.06]} center distanceFactor={7} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div className="mithila-serif" style={{ color: "#c62f35", fontSize: 26, fontStyle: "italic" }}>
                  11·11
                </div>
              </Html>
            </group>
          </Poke>
          {/* tiny shoes */}
          <Poke position={p(0.42, 2.8)} plaque={plq[2]}>
            <group>
              <mesh material={flat("#e8788a")} position={[-0.1, 0.06, 0]}>
                <capsuleGeometry args={[0.06, 0.1, 3, 6]} />
              </mesh>
              <mesh material={flat("#e8788a")} position={[0.1, 0.06, 0]}>
                <capsuleGeometry args={[0.06, 0.1, 3, 6]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 6 && (
        <>
          {/* blooming flowers */}
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <Poke key={k} position={p(0.22 + k * 0.11, k % 2 ? 2.8 + (k % 3) : -2.8 - (k % 3))} plaque={k === 0 ? plq[0] : undefined}>
              <group>
                <mesh material={flat("#4a8a4f")} position={[0, 0.25, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.5, 5]} />
                </mesh>
                <mesh material={flat(["#e8788a", "#f0b866", "#b88ae8"][k % 3])} position={[0, 0.55, 0]}>
                  <icosahedronGeometry args={[0.14, 0]} />
                </mesh>
              </group>
            </Poke>
          ))}
          {/* fountain */}
          <Poke position={p(0.5, -4.8)} plaque={plq[2]}>
            <group>
              <mesh material={flat("#7a8ea8")} position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.9, 1, 0.5, 10]} />
              </mesh>
              <Spinner speed={2}>
                <mesh material={flat("#b8d8f0", { emissive: "#b8d8f0", emissiveIntensity: 0.3 })} position={[0, 0.8, 0]}>
                  <torusGeometry args={[0.4, 0.08, 6, 12]} />
                </mesh>
              </Spinner>
            </group>
          </Poke>
          {/* garden swing */}
          <Poke position={p(0.72, 4.4)} plaque={plq[1]}>
            <group>
              <mesh material={flat("#8a6b4a")} position={[0.7, 1, 0]} rotation={[0, 0, -0.25]}>
                <cylinderGeometry args={[0.05, 0.05, 2.2, 5]} />
              </mesh>
              <mesh material={flat("#8a6b4a")} position={[-0.7, 1, 0]} rotation={[0, 0, 0.25]}>
                <cylinderGeometry args={[0.05, 0.05, 2.2, 5]} />
              </mesh>
              <mesh material={flat("#8a6b4a")} position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 1.5, 5]} />
              </mesh>
              <Bobber amp={0.08} speed={2}>
                <mesh material={flat("#c65c50")} position={[0, 0.9, 0]}>
                  <boxGeometry args={[0.6, 0.06, 0.3]} />
                </mesh>
              </Bobber>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 7 && (
        <>
          {/* little plane circling */}
          <group position={p(0.5, 0)}>
            <Spinner speed={0.5}>
              <group position={[5, 3.2, 0]}>
                <Poke plaque={plq[0]}>
                  <group rotation={[0, 0, 0.1]}>
                    <mesh material={flat("#f5f0e8")}>
                      <capsuleGeometry args={[0.16, 0.7, 4, 6]} />
                    </mesh>
                    <mesh material={flat("#66c8f0")} rotation={[0, 0, Math.PI / 2]}>
                      <boxGeometry args={[0.08, 1.3, 0.25]} />
                    </mesh>
                  </group>
                </Poke>
              </group>
            </Spinner>
          </group>
          {/* luggage carousel */}
          <Poke position={p(0.42, -4.6)} plaque={plq[1]}>
            <group>
              <mesh material={flat("#4a4f6b")} position={[0, 0.3, 0]}>
                <cylinderGeometry args={[1.1, 1.1, 0.25, 12]} />
              </mesh>
              <Spinner speed={0.8}>
                {[0, 1, 2].map((k) => (
                  <mesh key={k} material={flat(["#c65c50", "#f0b866", "#5cb8a8"][k])} position={[Math.sin(k * 2.1) * 0.7, 0.55, Math.cos(k * 2.1) * 0.7]}>
                    <boxGeometry args={[0.35, 0.25, 0.2]} />
                  </mesh>
                ))}
              </Spinner>
            </group>
          </Poke>
          {/* postcard stand */}
          <Poke position={p(0.66, 4)} plaque={plq[2]}>
            <group>
              <mesh material={flat("#8a6b4a")} position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.06, 0.08, 1.4, 6]} />
              </mesh>
              {[0, 1, 2, 3].map((k) => (
                <mesh key={k} material={flat("#f5f0e8")} position={[Math.sin(k * 1.57) * 0.25, 1 + (k % 2) * 0.3, Math.cos(k * 1.57) * 0.25]} rotation={[0, k, 0]}>
                  <planeGeometry args={[0.28, 0.2]} />
                </mesh>
              ))}
            </group>
          </Poke>
        </>
      )}
      {landIndex === 8 && (
        <>
          {/* street of glowing frames */}
          {[0, 1, 2].map((k) => (
            <Poke key={k} position={p(0.3 + k * 0.2, k % 2 ? 3.6 : -3.6)} plaque={plq[k]}>
              <group>
                <mesh material={flat("#f0b866", { emissive: "#f0b866", emissiveIntensity: 0.4 })} position={[0, 1.2, 0]}>
                  <boxGeometry args={[1, 1.3, 0.1]} />
                </mesh>
                <mesh material={flat("#2a3163")} position={[0, 1.2, 0.06]}>
                  <planeGeometry args={[0.8, 1.1]} />
                </mesh>
              </group>
            </Poke>
          ))}
          {/* café with two cups */}
          <Poke position={p(0.75, -4.6)} plaque={plq[0]}>
            <group>
              <mesh material={flat("#5c4a6b")} position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.5, 0.55, 1, 8]} />
              </mesh>
              <mesh material={flat("#f5f0e8")} position={[0.15, 1.08, 0]}>
                <cylinderGeometry args={[0.07, 0.05, 0.12, 8]} />
              </mesh>
              <mesh material={flat("#f5f0e8")} position={[-0.15, 1.08, 0]}>
                <cylinderGeometry args={[0.07, 0.05, 0.12, 8]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}
      {landIndex === 9 && (
        <>
          {/* 36 lanterns in rings around the plaza — lit after finale */}
          <FinaleLanterns center={p(0.55, 0)} accent={land.accent} />
          {/* gift boxes */}
          {[0, 1, 2].map((k) => (
            <Poke key={k} position={p(0.32 + k * 0.09, k % 2 ? 3.2 : -3.4)} plaque={k === 1 ? plq[1] : undefined}>
              <group>
                <mesh material={flat(["#c65c50", "#5cb8a8", "#b88ae8"][k])} position={[0, 0.3, 0]}>
                  <boxGeometry args={[0.6, 0.6, 0.6]} />
                </mesh>
                <mesh material={flat("#f0b866")} position={[0, 0.63, 0]}>
                  <boxGeometry args={[0.66, 0.08, 0.15]} />
                </mesh>
              </group>
            </Poke>
          ))}
          {/* the stage with mic */}
          <Poke position={p(0.78, -4.2)} plaque={plq[2]}>
            <group>
              <mesh material={flat("#3f3a5c")} position={[0, 0.25, 0]}>
                <cylinderGeometry args={[1.3, 1.4, 0.5, 10]} />
              </mesh>
              <mesh material={flat("#8a8a9a")} position={[0, 1, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1, 5]} />
              </mesh>
              <mesh material={flat("#2a2a2a")} position={[0, 1.55, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
              </mesh>
            </group>
          </Poke>
        </>
      )}

      {/* photo pavilion — appears once the land is unlocked */}
      {unlockedHere && (
        <group position={p(0.88, landIndex % 2 ? -4.2 : 4.2)} rotation={[0, yawAt(c) + (landIndex % 2 ? 2.4 : -2.4), 0]}>
          <Pavilion landIndex={landIndex} />
        </group>
      )}
    </group>
  );
}

// 36 lanterns that ignite during/after the finale
function FinaleLanterns({ center, accent }: { center: [number, number, number]; accent: string }) {
  const finaleSeen = useMithila((s) => s.finaleSeen);
  const phase = useMithila((s) => s.phase);
  const lit = finaleSeen || phase === "finale";
  const mat = useMemo(
    () => flat(accent, lit ? { emissive: accent, emissiveIntensity: 1.6 } : { emissive: "#000" }),
    [accent, lit]
  );
  const post = useMemo(() => flat("#3a3f52"), []);
  return (
    <group position={center}>
      {Array.from({ length: 36 }, (_, k) => {
        const ring = k < 12 ? 0 : k < 24 ? 1 : 2;
        const idx = ring === 0 ? k : ring === 1 ? k - 12 : k - 24;
        const n = 12;
        const r = 4.5 + ring * 2.2;
        const a = (idx / n) * Math.PI * 2 + ring * 0.26;
        return (
          <group key={k} position={[Math.sin(a) * r, 0, Math.cos(a) * r]}>
            <mesh material={post} position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 1.1, 5]} />
            </mesh>
            <mesh material={mat} position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.12, 6, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ============ ground islands + everything assembled ============
export function AllLands() {
  const frontier = useMithila((s) => s.frontier);
  return (
    <group>
      {lands.map((land, i) => {
        const c = landT.center(i);
        const pos = sideAt(c, 0);
        const locked = frontier <= i;
        return (
          <group key={land.id}>
            {/* ground island */}
            <mesh position={[pos.x, -0.06, pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[17, 24]} />
              <meshStandardMaterial color={locked ? "#4a4a56" : land.ground} flatShading />
            </mesh>
            {/* dressing — desaturated lands still show silhouettes */}
            <group visible={Math.abs(frontier - i) <= 2 || !locked}>
              <LandProps landIndex={i} />
            </group>
            <Gate landIndex={i} />
          </group>
        );
      })}
    </group>
  );
}

// ============ sparks ============
export function Sparks() {
  const defs = useMemo(() => buildSparks(), []);
  const collected = useMithila((s) => s.sparks);
  const collect = useMithila((s) => s.collectSpark);
  const frontier = useMithila((s) => s.frontier);
  return (
    <group>
      {defs.map((d) =>
        collected.includes(d.id) || d.land >= frontier ? null : (
          <SparkGem key={d.id} def={d} onCollect={() => collect(d.id)} />
        )
      )}
    </group>
  );
}

function SparkGem({ def, onCollect }: { def: { id: string; pos: THREE.Vector3 }; onCollect: () => void }) {
  const g = useRef<THREE.Group>(null);
  const [dying, setDying] = useState(false);
  const mat = useMemo(() => flat("#ffd700", { emissive: "#ffd700", emissiveIntensity: 1.2 }), []);
  useFrame(({ clock }, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 2;
    g.current.position.y = def.pos.y + Math.sin(clock.elapsedTime * 2 + def.pos.x) * 0.15;
    if (dying) {
      g.current.scale.multiplyScalar(1 + delta * 9);
      (mat as THREE.MeshStandardMaterial).opacity = Math.max(0, (mat.opacity ?? 1) - delta * 4);
    }
  });
  return (
    <group
      ref={g}
      position={def.pos}
      onClick={(e) => {
        e.stopPropagation();
        if (dying) return;
        setDying(true);
        mat.transparent = true;
        sfx.spark();
        if (navigator.vibrate) navigator.vibrate([12, 30, 12]);
        setTimeout(onCollect, 280);
      }}
    >
      <mesh material={mat}>
        <octahedronGeometry args={[0.16, 0]} />
      </mesh>
    </group>
  );
}
