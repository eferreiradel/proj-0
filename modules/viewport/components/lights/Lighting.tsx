"use client";

import { Environment, ContactShadows } from "@react-three/drei";

export default function Lighting() {
  return (
    <>
      <Environment preset="sunset" background={false} environmentRotation={[0, Math.PI / 4, 0]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} castShadow />

      {/* Soft contact shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={2.5}
        far={4}
      />
    </>
  );
}
