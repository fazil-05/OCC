"use client";

import { Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

export function GlowRing() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.18;
    meshRef.current.rotation.x = Math.PI / 2.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <Torus ref={meshRef} args={[3.3, 0.02, 16, 220]} position={[0, -0.2, -3]}>
      <meshBasicMaterial color="#00B8F0" transparent opacity={0.3} />
    </Torus>
  );
}
