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

      {/* Soft contact shadows — baked once instead of recomputed every frame */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={2.5}
        far={4}
        resolution={512}
        frames={1}
      />
    </>
  );
}
