"use client";

import { Environment, ContactShadows } from "@react-three/drei";

export default function Lighting() {
  return (
    <>
      {/* Soft HDRI environment lighting */}
      <Environment preset="city" background={false} />

      {/* Fill light */}
      <ambientLight intensity={0.2} />

      {/* Key light */}
      <directionalLight position={[5, 8, 5]} intensity={0.5} castShadow />

      {/* Soft contact shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
      />
    </>
  );
}
