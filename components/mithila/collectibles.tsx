"use client";

/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { buildCoins, buildTunnels, coinDoorCost, coinsTowardDoor } from "@/lib/mithila/collectibles";
import { mithilaInput } from "@/lib/mithila/input";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "./audio";

const PICK_RADIUS = 2.4;

const gold = () =>
  new THREE.MeshStandardMaterial({
    color: "#ffd700",
    emissive: "#ffaa00",
    emissiveIntensity: 0.85,
    flatShading: true,
  });

export function Coins() {
  const defs = useMemo(() => buildCoins(), []);
  const collected = useMithila((s) => s.coins);
  const collect = useMithila((s) => s.collectCoin);
  const frontier = useMithila((s) => s.frontier);

  return (
    <group>
      {defs.map((d) =>
        collected.includes(d.id) || d.land >= frontier ? null : (
          <CoinMesh key={d.id} def={d} onCollect={() => collect(d.id)} />
        ),
      )}
    </group>
  );
}

function CoinMesh({
  def,
  onCollect,
}: {
  def: { id: string; pos: THREE.Vector3 };
  onCollect: () => void;
}) {
  const g = useRef<THREE.Group>(null);
  const [dying, setDying] = useState(false);
  const taken = useRef(false);
  const mat = useMemo(() => gold(), []);

  const take = () => {
    if (taken.current || dying) return;
    taken.current = true;
    setDying(true);
    sfx.spark();
    if (navigator.vibrate) navigator.vibrate(10);
    onCollect();
  };

  useFrame(({ clock }, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 3.2;
    g.current.position.y = def.pos.y + Math.sin(clock.elapsedTime * 3 + def.pos.x) * 0.12;

    // auto-pickup when player walks near
    if (!taken.current) {
      const dx = mithilaInput.playerX - def.pos.x;
      const dz = mithilaInput.playerZ - def.pos.z;
      if (dx * dx + dz * dz < PICK_RADIUS * PICK_RADIUS) take();
    }

    if (dying) {
      g.current.scale.multiplyScalar(1 + delta * 10);
      mat.transparent = true;
      mat.opacity = Math.max(0, mat.opacity - delta * 5);
    }
  });

  return (
    <group
      ref={g}
      position={def.pos}
      onClick={(e) => {
        e.stopPropagation();
        take();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        take();
      }}
    >
      {/* larger invisible hit target for taps */}
      <mesh visible={false}>
        <sphereGeometry args={[1.1, 8, 8]} />
      </mesh>
      <mesh material={mat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.1, 16]} />
      </mesh>
    </group>
  );
}

export function Tunnels() {
  const defs = useMemo(() => buildTunnels(), []);
  const frontier = useMithila((s) => s.frontier);
  const openSideGame = useMithila((s) => s.openSideGame);
  const setToast = useMithila((s) => s.setToast);

  return (
    <group>
      {defs.map((t) =>
        t.land >= frontier ? null : (
          <group key={t.id} position={t.pos} rotation={[0, t.yaw, 0]}>
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[2.2, 2.2, 0.35]} />
              <meshStandardMaterial color="#1a120c" flatShading />
            </mesh>
            <mesh position={[0, 1.1, 0.05]}>
              <boxGeometry args={[1.4, 1.6, 0.2]} />
              <meshStandardMaterial color="#0a0806" flatShading emissive="#f0b866" emissiveIntensity={0.15} />
            </mesh>
            <Html position={[0, 2.6, 0]} center distanceFactor={12} zIndexRange={[20, 0]}>
              <button
                type="button"
                className="mithila-serif italic text-sm px-3 py-1 rounded-full"
                style={{
                  background: "rgba(9,11,34,0.75)",
                  border: "1px solid rgba(240,184,102,0.5)",
                  color: "#f0b866",
                  whiteSpace: "nowrap",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setToast(t.label);
                  openSideGame(t.game);
                  sfx.tap();
                }}
              >
                {t.label} ✦
              </button>
            </Html>
          </group>
        ),
      )}
    </group>
  );
}

/** Shows coins from previous biome toward the next gate */
export function CoinDoorHints() {
  const frontier = useMithila((s) => s.frontier);
  const coins = useMithila((s) => s.coins);
  const doorsOpen = useMithila((s) => s.doorsOpen);
  if (frontier >= 10) return null;
  const cost = coinDoorCost[frontier];
  if (cost == null || doorsOpen.includes(frontier)) return null;
  const have = coinsTowardDoor(frontier, coins);
  return (
    <div
      className="absolute bottom-48 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-xs tracking-wide rounded-full px-3 py-1.5"
      style={{ background: "rgba(9,11,34,0.65)", border: "1px solid rgba(255,215,0,0.4)", color: "#ffd700" }}
    >
      🪙 {have}/{cost} coins to open
    </div>
  );
}

/** Full-screen memory flash when a coin is collected */
export function CoinPhotoFlash() {
  const photo = useMithila((s) => s.coinPhoto);
  const clear = useMithila((s) => s.clearCoinPhoto);
  const coins = useMithila((s) => s.coins);

  useEffect(() => {
    if (!photo) return;
    const t = setTimeout(clear, 1600);
    return () => clearTimeout(t);
  }, [photo, clear]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          key={photo + coins.length}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-[45] flex items-center justify-center pointer-events-none px-8"
          style={{ background: "rgba(4,5,16,0.55)" }}
        >
          <div className="relative max-w-sm w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              className="w-full rounded-2xl object-cover shadow-2xl"
              style={{
                maxHeight: "55vh",
                border: "3px solid rgba(240,184,102,0.65)",
                boxShadow: "0 0 48px rgba(240,184,102,0.35)",
              }}
            />
            <div
              className="mithila-serif italic text-center mt-3 text-sm"
              style={{ color: "#f0b866", textShadow: "0 2px 12px #000" }}
            >
              a memory ✦
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
