"use client";

/* eslint-disable react-hooks/immutability -- R3F game loop: mutating refs/scene in useFrame is the intended pattern */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { lands, medleySrc } from "@/lib/mithila/data";
import {
  pointAt,
  nearestT,
  maxT,
  landT,
  landOf,
  yawAt,
  buildRoadGeometry,
  LAND_COUNT,
  sideAt,
} from "@/lib/mithila/world";
import { biomePads, clampToBiomes, distToFrontierGate } from "@/lib/mithila/physics";
import { mithilaInput, consumeJump } from "@/lib/mithila/input";
import { useMithila, stageForFrontier } from "@/lib/mithila/store";
import { audio, sfx } from "./audio";
import { Mithi, Rudra, type CharAnim } from "./Mithi";
import { AllLands, Sparks } from "./lands";
import { Coins, Tunnels, CoinDoorHints, CoinPhotoFlash } from "./collectibles";
import { VirtualPad } from "./hud";

type Walk = {
  /** progress along road 0..1 (for atmosphere / resume / gates) */
  t: number;
  /** free-world position */
  x: number;
  z: number;
  y: number;
  vy: number;
  yaw: number;
  running: boolean;
  /** tap-to-walk target in XZ, or null */
  tapX: number | null;
  tapZ: number | null;
};

const JUMP_V = 5.2;
const GRAVITY = 18;
const MOVE_SPEED = 7.5;
const RUN_MULT = 1.55;
const TURN_RATE = 2.6; // rad/s — caps how fast facing snaps (stops mobile spin)
const CAM_FOLLOW = 1.6; // how quickly chase-cam yaw trails the character
const MEMORY_SPEED = 0.22; // slow walk while a coin-memory flash is open

function shortestAngle(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// ---------- atmosphere: sky/fog/light lerp with position ----------
function Atmosphere({ walk }: { walk: React.RefObject<Walk> }) {
  const { scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const skyA = useMemo(() => new THREE.Color(), []);
  const fogA = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    scene.fog = new THREE.Fog("#ffd9b8", 28, 110);
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
    const night = f / (LAND_COUNT - 1);
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

// ---------- character + camera controller (free XZ + jump) ----------
function Controller({ walk, anim }: { walk: React.RefObject<Walk>; anim: React.RefObject<CharAnim> }) {
  const { camera } = useThree();
  const mithiRef = useRef<THREE.Group>(null);
  const rudraRef = useRef<THREE.Group>(null);
  const stage = stageForFrontier(useMithila((s) => s.frontier));
  const camPos = useMemo(() => new THREE.Vector3(0, 4, 8), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const pads = useMemo(() => biomePads(), []);
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  // Stable camera yaw — move relative to this, not the live camera, so stick + chase-cam
  // can't feed each other into a spin on mobile.
  const camYaw = useRef(0);

  useEffect(() => {
    const on = (e: KeyboardEvent, v: boolean) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = v;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = v;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = v;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = v;
      if (e.code === "Space") {
        keys.current.space = v;
        if (v) mithilaInput.jumpPressed = true;
      }
    };
    const kd = (e: KeyboardEvent) => on(e, true);
    const ku = (e: KeyboardEvent) => on(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  useFrame((_, delta) => {
    const w = walk.current;
    const a = anim.current;
    const s = useMithila.getState();
    const d = Math.min(delta, 0.05);
    const active = s.phase === "world";
    const memoryOpen = !!s.coinPhoto;
    const speedScale = memoryOpen ? MEMORY_SPEED : 1;

    // Freeze leftover stick/tap intent while any overlay owns the screen
    if (!active) {
      w.tapX = null;
      w.tapZ = null;
      w.running = false;
      mithilaInput.x = 0;
      mithilaInput.y = 0;
    }

    // fast travel → snap to land center
    if (s.travelTo !== null) {
      const dest = sideAt(landT.center(s.travelTo), 0);
      w.x = dest.x;
      w.z = dest.z;
      w.t = landT.center(s.travelTo);
      w.tapX = null;
      w.tapZ = null;
      w.running = false;
      camYaw.current = w.yaw;
      s.consumeTravel();
    }

    let ix = mithilaInput.x + (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0);
    let iy = mithilaInput.y + (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0);
    // Soften lateral stick — sideways is what feeds the old spin loop on touch pads
    ix *= 0.72;
    const stickLen = Math.hypot(ix, iy);
    if (stickLen > 1) {
      ix /= stickLen;
      iy /= stickLen;
    }

    // Move relative to lagged camera yaw (not live camera look — breaks spin feedback)
    const cy = camYaw.current;
    const fwdX = Math.sin(cy);
    const fwdZ = Math.cos(cy);
    const rightX = -Math.cos(cy);
    const rightZ = Math.sin(cy);

    let mx = 0;
    let mz = 0;
    if (active && stickLen > 0.12) {
      w.tapX = null;
      w.tapZ = null;
      const speed = MOVE_SPEED * speedScale * (stickLen > 0.85 && !memoryOpen ? RUN_MULT : 1);
      const dirX = rightX * ix + fwdX * iy;
      const dirZ = rightZ * ix + fwdZ * iy;
      mx = dirX * speed * d;
      mz = dirZ * speed * d;
      const targetYaw = Math.atan2(dirX, dirZ);
      const turn = shortestAngle(w.yaw, targetYaw);
      const maxTurn = TURN_RATE * d;
      w.yaw += Math.max(-maxTurn, Math.min(maxTurn, turn));
      w.running = stickLen > 0.85 && !memoryOpen;
    } else if (active && w.tapX !== null && w.tapZ !== null) {
      const dx = w.tapX - w.x;
      const dz = w.tapZ - w.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.35) {
        w.tapX = null;
        w.tapZ = null;
        w.running = false;
      } else {
        const speed = MOVE_SPEED * speedScale * (w.running && !memoryOpen ? RUN_MULT : 1);
        const step = Math.min(dist, speed * d);
        mx = (dx / dist) * step;
        mz = (dz / dist) * step;
        const targetYaw = Math.atan2(dx, dz);
        const turn = shortestAngle(w.yaw, targetYaw);
        const maxTurn = TURN_RATE * d;
        w.yaw += Math.max(-maxTurn, Math.min(maxTurn, turn));
      }
    } else {
      w.running = false;
    }

    // jump
    if (active && !memoryOpen && w.y <= 0.01 && consumeJump()) {
      w.vy = JUMP_V;
      sfx.tap();
    }
    w.vy -= GRAVITY * d;
    w.y = Math.max(0, w.y + w.vy * d);
    if (w.y <= 0) {
      w.y = 0;
      w.vy = 0;
    }

    const nx = w.x + mx;
    const nz = w.z + mz;
    const clamped = clampToBiomes(nx, nz, s.frontier, pads);
    w.x = clamped.x;
    w.z = clamped.z;
    mithilaInput.playerX = w.x;
    mithilaInput.playerZ = w.z;

    // sync road t from nearest point (for atmosphere + gate)
    const nt = nearestT(new THREE.Vector3(w.x, 0, w.z), 40);
    if (nt !== null) w.t = Math.min(nt, maxT(s.frontier) + 0.02);

    const moving = Math.hypot(mx, mz) > 0.001 || w.y > 0.02;
    a.moving = moving && w.y <= 0.02;
    a.running = w.running && a.moving;
    a.celebrateUntil = Math.max(a.celebrateUntil, s.celebrateUntil);

    if (mithiRef.current) {
      mithiRef.current.position.set(w.x, w.y, w.z);
      const cur = mithiRef.current.rotation.y;
      mithiRef.current.rotation.y = cur + shortestAngle(cur, w.yaw) * Math.min(1, d * 8);
    }

    if (rudraRef.current) {
      const behind = new THREE.Vector3(
        w.x - Math.sin(w.yaw) * 1.4,
        0,
        w.z - Math.cos(w.yaw) * 1.4,
      );
      rudraRef.current.position.lerp(behind, Math.min(1, d * 4));
      rudraRef.current.rotation.y = w.yaw;
    }

    // Chase cam trails character yaw slowly — keeps look stable while turning
    camYaw.current += shortestAngle(camYaw.current, w.yaw) * Math.min(1, d * CAM_FOLLOW);
    const back = new THREE.Vector3(
      w.x - Math.sin(camYaw.current) * 6.8,
      4.4 + w.y * 0.3,
      w.z - Math.cos(camYaw.current) * 6.8,
    );
    camPos.lerp(back, Math.min(1, d * 2.4));
    camera.position.copy(camPos);
    lookAt.lerp(
      new THREE.Vector3(
        w.x + Math.sin(camYaw.current) * 2.5,
        1.2 + w.y,
        w.z + Math.cos(camYaw.current) * 2.5,
      ),
      Math.min(1, d * 3),
    );
    camera.lookAt(lookAt);

    const li = landOf(w.t);
    if (li !== s.lastLand) s.setLastLand(li);

    // finale only after lantern chase (or if she already cleared it)
    if (
      s.frontier >= LAND_COUNT &&
      !s.finaleSeen &&
      s.actionFlags.lanternChase &&
      s.phase === "world" &&
      w.t > landT.start(9) + 0.02
    ) {
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

// ---------- tap-to-walk on road + biome pads ----------
function TapGround({ walk }: { walk: React.RefObject<Walk> }) {
  const geo = useMemo(() => buildRoadGeometry(1.8), []);
  const handleTap = (e: { point: THREE.Vector3; stopPropagation: () => void }) => {
    e.stopPropagation();
    const s = useMithila.getState();
    if (s.phase !== "world") return;
    const lim = maxT(s.frontier);
    const t = nearestT(e.point, 22);
    if (t !== null && t > lim + 0.015) {
      sfx.gateRattle();
      s.setToast(`${lands[Math.min(s.frontier, LAND_COUNT - 1)].gateName} is locked — walk up to it.`);
      return;
    }
    sfx.tap();
    walk.current.tapX = e.point.x;
    walk.current.tapZ = e.point.z;
    walk.current.running = false;
  };
  return (
    <>
      <mesh geometry={geo} onClick={handleTap} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#c4a574" flatShading />
      </mesh>
      {/* wide invisible plane for tap-to-walk across biomes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -130]} onClick={handleTap}>
        <planeGeometry args={[120, 320]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

function useGateProximity(walk: React.RefObject<Walk>) {
  const [nearGate, setNearGate] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      const s = useMithila.getState();
      if (s.phase !== "world" || s.frontier >= LAND_COUNT) return setNearGate(false);
      const d = distToFrontierGate(walk.current.x, walk.current.z, s.frontier);
      setNearGate(d < 4.2);
    }, 200);
    return () => clearInterval(iv);
  }, [walk]);
  return nearGate;
}

const transformLines: Record<number, { title: string; sub: string }> = {
  2: { title: "2016", sub: "She said yes. The road would never be walked alone again." },
  3: { title: "11 · 11 · 2021", sub: "And then there were three." },
  4: { title: "2026", sub: "Happy birthday, Queen Mithila." },
};

export default function World() {
  const walk = useRef<Walk>({
    t: 0,
    x: 0,
    z: 0,
    y: 0,
    vy: 0,
    yaw: 0,
    running: false,
    tapX: null,
    tapZ: null,
  });
  const anim = useRef<CharAnim>({ moving: false, running: false, celebrateUntil: 0 });
  const frontier = useMithila((s) => s.frontier);
  const shownStage = useMithila((s) => s.shownStage);
  const markStageShown = useMithila((s) => s.markStageShown);
  const openTrial = useMithila((s) => s.openTrial);
  const startSequence = useMithila((s) => s.startSequence);
  const lastLand = useMithila((s) => s.lastLand);
  const [transform, setTransform] = useState<{ title: string; sub: string } | null>(null);
  const [biomeLabel, setBiomeLabel] = useState("");
  const nearGate = useGateProximity(walk);
  const booted = useRef(false);
  const seqArmed = useRef({ bridge: false, lantern: false });

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const li = Math.min(lastLand, Math.max(0, frontier - 1));
    const t = landT.center(li);
    const p = pointAt(Math.min(t, maxT(frontier)));
    walk.current.t = Math.min(t, maxT(frontier));
    walk.current.x = p.x;
    walk.current.z = p.z;
    walk.current.yaw = yawAt(walk.current.t);
    audio.playMusic(medleySrc, { loop: true, volume: 0.75 });
    setBiomeLabel(lands[li].title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (frontier === 1 && booted.current) {
      const lim = maxT(1);
      if (walk.current.t > lim) {
        walk.current.t = lim;
        const p = pointAt(lim);
        walk.current.x = p.x;
        walk.current.z = p.z;
      }
    }
  }, [frontier]);

  // biome name toast + action sequence triggers
  useEffect(() => {
    const iv = setInterval(() => {
      const li = landOf(walk.current.t);
      const title = lands[li]?.title;
      if (title && title !== biomeLabel) {
        setBiomeLabel(title);
        useMithila.getState().setToast(`${title} · ${lands[li].years}`);
      }
      const s = useMithila.getState();
      if (s.phase !== "world") return;
      // BridgeDash when first entering Bridge of Two
      if (
        !s.actionFlags.bridgeDash &&
        !seqArmed.current.bridge &&
        s.frontier >= 2 &&
        walk.current.t >= landT.start(1) &&
        walk.current.t < landT.start(1) + 0.04
      ) {
        seqArmed.current.bridge = true;
        startSequence("bridge-dash");
      }
      // LanternChase at Birthday City threshold
      if (
        !s.actionFlags.lanternChase &&
        !seqArmed.current.lantern &&
        s.frontier >= 10 &&
        walk.current.t >= landT.start(9)
      ) {
        seqArmed.current.lantern = true;
        startSequence("lantern-chase");
      }
    }, 400);
    return () => clearInterval(iv);
  }, [biomeLabel, startSequence]);

  useEffect(() => {
    const stage = stageForFrontier(frontier);
    if (stage > shownStage && transformLines[stage]) {
      const line = transformLines[stage];
      const t = setTimeout(() => {
        sfx.transform();
        setTransform(line);
        markStageShown(stage);
        setTimeout(() => setTransform(null), 3600);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [frontier, shownStage, markStageShown]);

  return (
    <div className="absolute inset-0">
      <Canvas dpr={[1, 2]} camera={{ fov: 55, near: 0.1, far: 240, position: [0, 4, 8] }} gl={{ antialias: true }}>
        <Atmosphere walk={walk} />
        <Stars radius={100} depth={60} count={1200} factor={2.5} fade speed={0.4} />
        <TapGround walk={walk} />
        <AllLands />
        <Coins />
        <Tunnels />
        <Sparks />
        <Controller walk={walk} anim={anim} />
      </Canvas>

      <VirtualPad />
      <CoinDoorHints />
      <CoinPhotoFlash />

      {/* current biome chip */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none rounded-full px-4 py-1.5 text-xs tracking-[0.2em] uppercase"
        style={{ background: "rgba(9,11,34,0.55)", border: "1px solid rgba(240,184,102,0.35)", color: "#f0b866" }}
      >
        {biomeLabel || lands[0].title}
      </div>

      {nearGate && frontier < LAND_COUNT && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-40 text-center mithila-rise">
          <button className="mithila-btn" onClick={() => openTrial(frontier)}>
            open {lands[frontier].gateName} ✦
          </button>
        </div>
      )}

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
