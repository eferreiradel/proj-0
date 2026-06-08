"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { useLightingStore } from "../ui/LightingDebug";
import { useConfigStore } from "@/modules/viewport/store/useConfigStore";

// drei loads these presets from the pmndrs HDRI CDN
type DreiPreset =
  | "apartment" | "city" | "dawn" | "forest" | "lobby"
  | "night" | "park" | "studio" | "sunset" | "warehouse";

export default function Lighting() {
  const params = useLightingStore((s) => s.params);
  const hdri = useConfigStore((s) => s.hdri) as DreiPreset;

  return (
    <>
      <Environment
        preset={hdri}
        background={false}
        environmentIntensity={params.environmentIntensity}
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
