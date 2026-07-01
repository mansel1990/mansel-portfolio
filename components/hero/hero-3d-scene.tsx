"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const NODE_POSITIONS: [number, number, number][] = [
  [2.8, 0.6, -1],
  [-2.4, 1.2, 0.5],
  [1.5, -1.8, 1.2],
  [-1.8, -1.2, -1.5],
  [0.2, 2.4, -0.8],
  [-0.5, -2.2, 0.3],
];

const NODE_COLORS = ["#06b6d4", "#a855f7", "#10b981", "#22d3ee", "#c084fc", "#34d399"];

function NeuralCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.22;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <MeshDistortMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.85}
          distort={0.28}
          speed={2}
          wireframe
        />
      </mesh>
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function SkillNode({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.12;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function ConnectionLines() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    NODE_POSITIONS.forEach(([x, y, z]) => {
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(x, y, z));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#06b6d4" transparent opacity={0.25} />
    </lineSegments>
  );
}

function OrbitingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.12;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.015, 8, 64]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.4}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.25,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y * 0.12,
      0.05
    );
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#06b6d4" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#a855f7" />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#10b981" />

      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.5} />

      <group ref={groupRef}>
        <NeuralCore />
        <ConnectionLines />
        <OrbitingRing />
        {NODE_POSITIONS.map((pos, i) => (
          <SkillNode key={i} position={pos} color={NODE_COLORS[i]} index={i} />
        ))}
      </group>
    </>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0"
    >
      <Scene />
    </Canvas>
  );
}
