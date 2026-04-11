"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  GradientTexture,
  PerspectiveCamera,
  Environment,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

function Model({ color1 = "#6366f1", color2 = "#a855f7" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smoothly rotate based on cursor
    const x = (state.mouse.x * viewport.width) / 8;
    const y = (state.mouse.y * viewport.height) / 8;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -y,
      0.1
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      x,
      0.1
    );
  });

  return (
    // @ts-ignore
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        {/* @ts-ignore */}
        <MeshDistortMaterial
          color="#ffffff"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.1}
          reflectivity={1}
          clearcoat={1}
        >
          {/* @ts-ignore */}
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={[color1, color2, "#3b82f6"]}
            size={1024}
          />
        </MeshDistortMaterial>
      </mesh>
    </Float>
  );
}

export function Interactive3DModel() {
  return (
    <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
      {/* @ts-ignore */}
      <Canvas shadows dpr={[1, 2]}>
        {/* @ts-ignore */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={1} />
        
        <React.Suspense fallback={null}>
          <Model />
          {/* @ts-ignore */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
          {/* @ts-ignore */}
          <Environment preset="city" />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
