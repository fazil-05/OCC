"use client";

import { Float, Text } from "@react-three/drei";

export function TextGeometry3D() {
  return (
    <Float speed={1.35} rotationIntensity={0.24} floatIntensity={0.7}>
      <Text
        position={[0, 0.45, 0.1]}
        fontSize={1.65}
        letterSpacing={0.08}
        color="#F5F0E8"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        OCC
        <meshStandardMaterial
          color="#C9A96E"
          metalness={0.85}
          roughness={0.18}
          emissive="#C9A96E"
          emissiveIntensity={0.15}
        />
      </Text>
    </Float>
  );
}
