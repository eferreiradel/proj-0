"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { useLightingStore } from "../ui/LightingDebug";

export default function Lighting() {
  const params = useLightingStore((s) => s.params);

  return (
    <>
      <Environment
        files="/hdri/venice_sunset_1k.hdr"
        background={false}
        environmentRotation={[0, params.environmentRotation, 0]}
      />
      <ambientLight intensity={0} />
      <directionalLight
        position={[params.directionalX, params.directionalY, params.directionalZ]}
        intensity={0}
        castShadow
      />

      {/* Point light for interior illumination */}
      <pointLight
        position={[params.pointLightX, params.pointLightY, params.pointLightZ]}
        intensity={0}
        distance={20}
        decay={2}
      />

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
