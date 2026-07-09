"use client";

/* eslint-disable react-hooks/immutability -- R3F game loop: mutating refs/scene in useFrame is the intended pattern */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { lands, medleySrc } from "@/lib/mithila/data";
import {
  pointAt,
  tangentAt,
  nearestT,
  maxT,
  landT,
  landOf,
  yawAt,
  buildRoadGeometry,
  LAND_COUNT,
} from "@/lib/mithila/world";
import { useMithila, stageForFrontier } from "@/lib/mithila/store";
import { audio, sfx } from "./audio";
import { Mithi, Rudra, type CharAnim } from "./Mithi";
import { AllLands, Sparks } from "./lands";

type Walk = { t: number; target: number; running: boolean };

// ---------- atmosphere: sky/fog/light lerp with position ----------
function Atmosphere({ walk }: { walk: React.RefObject<Walk> }) {
  const { scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const skyA = useMemo(() => new THREE.Color(), []);
  const fogA = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    scene.fog = new THREE.Fog("#ffd9b8", 25, 95);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  useFrame(() => {
    const f = Math.min(walk.current.t * LAND_COUNT, LAND_COUNT - 1);
    const i = Math.floor(f);
    const j = Math.min(i + 1, LAND_COUNT - 1);
    const mix = f - i;
    skyA.set(lands[i].sky).lerp(new THREE.Color(lands[j].sky), mix);
    fogA.set(lands[i].fog).lerp(new THREE.Color(lands[j].fog), mix);
    if (!(scene.background instanceof THREE.Color)) scene.background = new THREE.Color();
    (scene.background as THREE.Color).copy(skyA);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(fogA);
    const night = f / (LAND_COUNT - 1); // 0 dawn -> 1 deep night
    if (amb.current) amb.current.intensity = 0.95 - night * 0.45;
    if (sun.current) sun.current.intensity = 1.15 - night * 0.75;
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.9} />
      <directionalLight ref={sun} position={[8, 14, 6]} intensity={1.1} color="#fff2dd" />
    </>
  );
}

// ---------- character + camera controller ----------
function Controller({ walk, anim }: { walk: React.RefObject<Walk>; anim: React.RefObject<CharAnim> }) {
  const { camera } = useThree();
  const mithiRef = useRef<THREE.Group>(null);
  const rudraRef = useRef<THREE.Group>(null);
  const stage = stageForFrontier(useMithila((s) => s.frontier));
  const camPos = useMemo(() => new THREE.Vector3(0, 4, 8), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const w = walk.current;
    const a = anim.current;
    const s = useMithila.getState();
    const d = Math.min(delta, 0.05);

    // consume fast travel
    if (s.travelTo !== null) {
      w.target = landT.center(s.travelTo);
      w.running = true;
      s.consumeTravel();
    }

    // clamp target by frontier
    const lim = maxT(s.frontier);
    w.target = THREE.MathUtils.clamp(w.target, 0, lim);

    // move
    const speed = (w.running ? 0.042 : 0.016) * (s.phase === "world" ? 1 : 0);
    const diff = w.target - w.t;
    const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * d * 60 * 0.016);
    w.t += step;
    const moving = Math.abs(diff) > 0.0015;
    if (!moving) w.running = false;
    a.moving = moving;
    a.running = w.running;
    a.celebrateUntil = Math.max(a.celebrateUntil, s.celebrateUntil);

    // place Mithi
    const p = pointAt(w.t);
    const yaw = yawAt(w.t) + (moving && diff < 0 ? Math.PI : 0);
    if (mithiRef.current) {
      mithiRef.current.position.set(p.x, 0, p.z);
      const cur = mithiRef.current.rotation.y;
      mithiRef.current.rotation.y = cur + (yaw - cur) * Math.min(1, d * 8);
    }

    // Rudra follows behind (stage 3+)
    if (rudraRef.current) {
      const rt = Math.max(0, w.t - 0.0055);
      const rp = pointAt(rt);
      rudraRef.current.position.lerp(new THREE.Vector3(rp.x, 0, rp.z), Math.min(1, d * 4));
      rudraRef.current.rotation.y = yaw;
    }

    // camera: behind + above, looking ahead
    const tan = tangentAt(w.t);
    const behind = new THREE.Vector3(p.x - tan.x * 6.5, 4.2, p.z - tan.z * 6.5);
    camPos.lerp(behind, Math.min(1, d * 2.2));
    camera.position.copy(camPos);
    lookAt.lerp(new THREE.Vector3(p.x + tan.x * 3, 1.2, p.z + tan.z * 3), Math.min(1, d * 3));
    camera.lookAt(lookAt);

    // track land + persist occasionally
    const li = landOf(w.t);
    if (li !== s.lastLand) s.setLastLand(li);

    // finale trigger: inside Birthday City with all gates open
    if (s.frontier >= LAND_COUNT && !s.finaleSeen && s.phase === "world" && w.t > landT.start(9) + 0.02) {
      s.setPhase("finale");
    }
  });

  return (
    <>
      <group ref={mithiRef}>
        <Mithi anim={anim} stage={stage} />
      </group>
      {stage >= 3 && (
        <group ref={rudraRef}>
          <Rudra anim={anim} />
        </group>
      )}
    </>
  );
}

// ---------- tap-to-walk ground ----------
function TapGround({ walk }: { walk: React.RefObject<Walk> }) {
  const geo = useMemo(() => buildRoadGeometry(1.5), []);
  const handleTap = (e: { point: THREE.Vector3; stopPropagation: () => void }) => {
    e.stopPropagation();
    const s = useMithila.getState();
    if (s.phase !== "world") return;
    const t = nearestT(e.point, 10);
    if (t === null) return;
    const lim = maxT(s.frontier);
    if (t > lim + 0.01) {
      sfx.gateRattle();
      s.setToast(`${lands[Math.min(s.frontier, LAND_COUNT - 1)].gateName} is locked — walk up to it.`);
    }
    sfx.tap();
    walk.current.target = THREE.MathUtils.clamp(t, 0, lim);
  };
  return (
    <>
      {/* visible road */}
      <mesh geometry={geo} onClick={handleTap}>
        <meshStandardMaterial color="#d8c8a8" flatShading />
      </mesh>
      {/* generous invisible tap band (also catches taps beside the road) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -130]} onClick={handleTap}>
        <planeGeometry args={[90, 300]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

// ---------- gate proximity prompt + stage transformation moments ----------
function useGateProximity(walk: React.RefObject<Walk>) {
  const [nearGate, setNearGate] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      const s = useMithila.getState();
      if (s.phase !== "world" || s.frontier >= LAND_COUNT) return setNearGate(false);
      const lim = maxT(s.frontier);
      setNearGate(lim - walk.current.t < 0.02);
    }, 250);
    return () => clearInterval(iv);
  }, [walk]);
  return nearGate;
}

const transformLines: Record<number, { title: string; sub: string }> = {
  2: { title: "2016", sub: "She said yes. The road would never be walked alone again." },
  3: { title: "11 · 11 · 2021", sub: "And then there were three." },
  4: { title: "2026", sub: "Happy birthday, Queen Mithila." },
};

// ---------- the world ----------
export default function World() {
  const walk = useRef<Walk>({ t: 0, target: 0, running: false });
  const anim = useRef<CharAnim>({ moving: false, running: false, celebrateUntil: 0 });
  const frontier = useMithila((s) => s.frontier);
  const shownStage = useMithila((s) => s.shownStage);
  const markStageShown = useMithila((s) => s.markStageShown);
  const openTrial = useMithila((s) => s.openTrial);
  const lastLand = useMithila((s) => s.lastLand);
  const [transform, setTransform] = useState<{ title: string; sub: string } | null>(null);
  const nearGate = useGateProximity(walk);
  const booted = useRef(false);

  // resume position + start medley once
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const t = landT.center(Math.min(lastLand, frontier - 1 < 0 ? 0 : Math.min(lastLand, 9)));
    walk.current.t = Math.min(t, maxT(frontier));
    walk.current.target = walk.current.t;
    audio.playMusic(medleySrc, { loop: true, volume: 0.75 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // restart support: when frontier drops back to 1, snap to start
  useEffect(() => {
    if (frontier === 1 && booted.current) {
      walk.current.t = Math.min(walk.current.t, maxT(1));
      walk.current.target = walk.current.t;
    }
  }, [frontier]);

  // stage transformation moments
  useEffect(() => {
    const stage = stageForFrontier(frontier);
    if (stage > shownStage && transformLines[stage]) {
      const line = transformLines[stage];
      const t = setTimeout(() => {
        sfx.transform();
        setTransform(line);
        markStageShown(stage);
        setTimeout(() => setTransform(null), 3600);
      }, 1400); // let the gate open first
      return () => clearTimeout(t);
    }
  }, [frontier, shownStage, markStageShown]);

  return (
    <div className="absolute inset-0">
      <Canvas dpr={[1, 2]} camera={{ fov: 55, near: 0.1, far: 220, position: [0, 4, 8] }} gl={{ antialias: true }}>
        <Atmosphere walk={walk} />
        <Stars radius={100} depth={60} count={1500} factor={2.5} fade speed={0.4} />
        <TapGround walk={walk} />
        <AllLands />
        <Sparks />
        <Controller walk={walk} anim={anim} />
      </Canvas>

      {/* gate prompt */}
      {nearGate && frontier < LAND_COUNT && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 text-center mithila-rise">
          <button className="mithila-btn" onClick={() => openTrial(frontier)}>
            open {lands[frontier].gateName} ✦
          </button>
        </div>
      )}

      {/* transformation overlay */}
      {transform && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(240,184,102,0.28), rgba(4,5,16,0.75))" }}
        >
          <div className="text-center mithila-rise">
            <div className="mithila-serif italic" style={{ fontSize: 54, color: "#f0b866", textShadow: "0 0 40px rgba(240,184,102,0.7)" }}>
              {transform.title}
            </div>
            <div className="mithila-serif italic mt-2" style={{ fontSize: 20, color: "#f5f0e8", opacity: 0.9 }}>
              {transform.sub}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
