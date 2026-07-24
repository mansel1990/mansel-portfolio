"use client";

/* eslint-disable react-hooks/immutability -- R3F game loop: mutating refs in useFrame/handlers is the intended pattern */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sfx } from "./audio";

// Procedural low-poly girl with 4 life stages.
// Stage 1: girl (kurti + ponytail) · 2: wife (sari + bun + flower)
// 3: mom (warm dress + bun) · 4: birthday queen (party dress + crown)

export type CharAnim = {
  moving: boolean;
  running: boolean;
  celebrateUntil: number;
};

const SKIN = "#c98a5e";
const HAIR = "#1f1410";

const stageColors: Record<number, { top: string; bottom: string; accentColor: string }> = {
  1: { top: "#3fa8a0", bottom: "#3a4a6b", accentColor: "#f0b866" }, // teal kurti + jeans
  2: { top: "#c62f35", bottom: "#8a1f28", accentColor: "#f0b866" }, // wedding red + gold
  3: { top: "#7a5ca8", bottom: "#5c4485", accentColor: "#e8788a" }, // warm violet
  4: { top: "#e8788a", bottom: "#c65c78", accentColor: "#ffd700" }, // party rose + gold
};

function useMats(stage: number) {
  return useMemo(() => {
    const c = stageColors[stage];
    return {
      skin: new THREE.MeshStandardMaterial({ color: SKIN, flatShading: true }),
      hair: new THREE.MeshStandardMaterial({ color: HAIR, flatShading: true }),
      top: new THREE.MeshStandardMaterial({ color: c.top, flatShading: true }),
      bottom: new THREE.MeshStandardMaterial({ color: c.bottom, flatShading: true }),
      accent: new THREE.MeshStandardMaterial({
        color: c.accentColor,
        flatShading: true,
        emissive: stage === 4 ? c.accentColor : "#000000",
        emissiveIntensity: stage === 4 ? 0.35 : 0,
      }),
    };
  }, [stage]);
}

export function Mithi({ anim, stage }: { anim: React.RefObject<CharAnim>; stage: number }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const lArm = useRef<THREE.Group>(null);
  const rArm = useRef<THREE.Group>(null);
  const lLeg = useRef<THREE.Group>(null);
  const rLeg = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const m = useMats(stage);

  useFrame(({ clock }) => {
    const a = anim.current;
    if (!a || !body.current) return;
    const t = clock.elapsedTime;
    const celebrating = Date.now() < a.celebrateUntil;
    const speed = a.running ? 13 : 8.5;

    if (celebrating) {
      // jump + gentle twirl + arms up
      const ph = (Date.now() % 700) / 700;
      body.current.position.y = Math.abs(Math.sin(ph * Math.PI)) * 0.35;
      body.current.rotation.y = t * 2.2;
      if (lArm.current) lArm.current.rotation.z = 2.6;
      if (rArm.current) rArm.current.rotation.z = -2.6;
      if (lLeg.current) lLeg.current.rotation.x = 0;
      if (rLeg.current) rLeg.current.rotation.x = 0;
    } else if (a.moving) {
      const s = Math.sin(t * speed);
      body.current.position.y = Math.abs(Math.sin(t * speed)) * 0.05;
      body.current.rotation.y = 0;
      if (lLeg.current) lLeg.current.rotation.x = s * 0.65;
      if (rLeg.current) rLeg.current.rotation.x = -s * 0.65;
      if (lArm.current) {
        lArm.current.rotation.x = -s * 0.5;
        lArm.current.rotation.z = 0.12;
      }
      if (rArm.current) {
        rArm.current.rotation.x = s * 0.5;
        rArm.current.rotation.z = -0.12;
      }
      if (head.current) head.current.rotation.z = s * 0.04;
    } else {
      // idle: breathe + tiny sway
      body.current.position.y = Math.sin(t * 2) * 0.015;
      body.current.rotation.y = 0;
      if (lLeg.current) lLeg.current.rotation.x = 0;
      if (rLeg.current) rLeg.current.rotation.x = 0;
      if (lArm.current) {
        lArm.current.rotation.x = Math.sin(t * 2) * 0.05;
        lArm.current.rotation.z = 0.12;
      }
      if (rArm.current) {
        rArm.current.rotation.x = -Math.sin(t * 2) * 0.05;
        rArm.current.rotation.z = -0.12;
      }
      if (head.current) head.current.rotation.z = Math.sin(t * 0.7) * 0.05;
    }
  });

  const isSkirt = stage !== 1; // stages 2-4 wear a skirt/sari cone

  return (
    <group ref={root}>
      <group
        ref={body}
        onClick={(e) => {
          e.stopPropagation();
          sfx.giggle();
          if (anim.current) anim.current.celebrateUntil = Date.now() + 1400;
        }}
      >
        {/* torso */}
        <mesh material={m.top} position={[0, 0.78, 0]} castShadow={false}>
          <capsuleGeometry args={[0.22, 0.34, 4, 8]} />
        </mesh>
        {/* skirt / sari drape */}
        {isSkirt && (
          <mesh material={m.bottom} position={[0, 0.45, 0]}>
            <coneGeometry args={[0.34, 0.62, 8, 1, true]} />
          </mesh>
        )}
        {/* sari pallu (stage 2) — diagonal drape */}
        {stage === 2 && (
          <mesh material={m.accent} position={[0.1, 0.85, 0.02]} rotation={[0, 0, -0.7]}>
            <boxGeometry args={[0.1, 0.62, 0.3]} />
          </mesh>
        )}
        {/* head */}
        <group ref={head} position={[0, 1.28, 0]}>
          <mesh material={m.skin}>
            <sphereGeometry args={[0.21, 12, 10]} />
          </mesh>
          {/* hair cap */}
          <mesh material={m.hair} position={[0, 0.06, -0.03]}>
            <sphereGeometry args={[0.215, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          </mesh>
          {/* ponytail (stage 1) or bun (2-4) */}
          {stage === 1 ? (
            <mesh material={m.hair} position={[0, -0.02, -0.24]} rotation={[0.6, 0, 0]}>
              <capsuleGeometry args={[0.06, 0.28, 4, 6]} />
            </mesh>
          ) : (
            <mesh material={m.hair} position={[0, 0.1, -0.2]}>
              <sphereGeometry args={[0.1, 8, 8]} />
            </mesh>
          )}
          {/* flower in hair (stage 2+) */}
          {stage >= 2 && stage < 4 && (
            <mesh material={m.accent} position={[0.16, 0.1, -0.1]}>
              <sphereGeometry args={[0.05, 6, 6]} />
            </mesh>
          )}
          {/* crown (stage 4) */}
          {stage === 4 && (
            <mesh material={m.accent} position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.13, 0.16, 0.12, 6, 1, true]} />
            </mesh>
          )}
        </group>
        {/* arms */}
        <group ref={lArm} position={[0.28, 1.0, 0]}>
          <mesh material={m.skin} position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.06, 0.32, 4, 6]} />
          </mesh>
        </group>
        <group ref={rArm} position={[-0.28, 1.0, 0]}>
          <mesh material={m.skin} position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.06, 0.32, 4, 6]} />
          </mesh>
        </group>
        {/* legs */}
        <group ref={lLeg} position={[0.11, 0.5, 0]}>
          <mesh material={stage === 1 ? m.bottom : m.skin} position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.075, 0.34, 4, 6]} />
          </mesh>
        </group>
        <group ref={rLeg} position={[-0.11, 0.5, 0]}>
          <mesh material={stage === 1 ? m.bottom : m.skin} position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.075, 0.34, 4, 6]} />
          </mesh>
        </group>
        {/* sling bag (stage 1 only) */}
        {stage === 1 && (
          <mesh material={m.accent} position={[0.22, 0.7, 0.14]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.14, 0.18, 0.07]} />
          </mesh>
        )}
      </group>
      {/* blob shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[0.34, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ---------- Rudra, the toddler follower (stage 3+) ----------
export function Rudra({ anim }: { anim: React.RefObject<CharAnim> }) {
  const body = useRef<THREE.Group>(null);
  const mats = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: SKIN, flatShading: true }),
      hair: new THREE.MeshStandardMaterial({ color: HAIR, flatShading: true }),
      dress: new THREE.MeshStandardMaterial({ color: "#f0b866", flatShading: true }),
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!body.current) return;
    const t = clock.elapsedTime;
    const moving = anim.current?.moving;
    // toddlers bounce more
    body.current.position.y = moving ? Math.abs(Math.sin(t * 11)) * 0.08 : Math.sin(t * 2.4) * 0.02;
    body.current.rotation.z = moving ? Math.sin(t * 11) * 0.08 : 0;
  });

  return (
    <group>
      <group
        ref={body}
        onClick={(e) => {
          e.stopPropagation();
          sfx.giggle();
          if (body.current) body.current.position.y += 0.25;
        }}
      >
        {/* big head, tiny body — toddler proportions */}
        <mesh material={mats.dress} position={[0, 0.32, 0]}>
          <coneGeometry args={[0.17, 0.3, 7]} />
        </mesh>
        <mesh material={mats.skin} position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.16, 10, 8]} />
        </mesh>
        <mesh material={mats.hair} position={[0, 0.63, -0.02]}>
          <sphereGeometry args={[0.163, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {/* pigtails */}
        <mesh material={mats.hair} position={[0.15, 0.66, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
        </mesh>
        <mesh material={mats.hair} position={[-0.15, 0.66, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.034, 0]}>
        <circleGeometry args={[0.2, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}
