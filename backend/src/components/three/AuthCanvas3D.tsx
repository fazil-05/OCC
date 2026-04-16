"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { FloatingSphere } from "@/components/three/FloatingSphere";
import { GlowRing } from "@/components/three/GlowRing";
import { ParticleField } from "@/components/three/ParticleField";
import { TextGeometry3D } from "@/components/three/TextGeometry3D";

export function AuthCanvas3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 55 }} style={{ background: "#0C0C0A" }}>
      <ambientLight intensity={0.45} color="#F5F0E8" />
      <pointLight position={[4, 5, 4]} intensity={1.4} color="#C9A96E" />
      <pointLight position={[-4, 3, 3]} intensity={0.8} color="#00B8F0" />
      <Stars radius={60} depth={40} count={1200} factor={3} saturation={0} fade speed={0.35} />
      <ParticleField />
      <GlowRing />
      <FloatingSphere />
      <TextGeometry3D />
    </Canvas>
  );
}
