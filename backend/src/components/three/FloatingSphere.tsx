"use client";

import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

export function FloatingSphere() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    const scale = 0.98 + Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[0, -0.25, -2.4]}>
      <Sphere args={[2.65, 64, 64]}>
        <MeshDistortMaterial
          color="#C9A96E"
          wireframe
          distort={0.24}
          speed={1.8}
          transparent
          opacity={0.16}
        />
      </Sphere>
    </group>
  );
}
