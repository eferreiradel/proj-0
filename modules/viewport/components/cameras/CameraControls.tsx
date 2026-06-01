"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import gsap from "gsap";

const POSITIONS: Record<string, [number, number, number]> = {
  esterni: [15.71, 1.76, -0.88],
  tetto: [9.3, 10.2, -9.9],
  interni: [11, 1.3, -0.63],
  galley: [8.8, 3.2, 11.8],
};

const TARGETS: Record<string, [number, number, number]> = {
  esterni: [0, 1.0, 0],
  tetto: [0, 1.0, 0],
  interni: [0, 1.0, 0],
  galley: [0, 1.0, 0],
};

export default function CameraControls() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const lookAtTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate camera on section change (not for freeview)
  const prevSection = useRef(activeSection);
  useEffect(() => {
    if (prevSection.current === activeSection) return;
    prevSection.current = activeSection;

    const pos = POSITIONS[activeSection];
    const target = TARGETS[activeSection];
    if (!pos || !target) return; // interni: no camera movement

    tweenRef.current?.kill();
    lookAtTweenRef.current?.kill();

    tweenRef.current = gsap.to(camera.position, {
      x: pos[0], y: pos[1], z: pos[2],
      duration: 1.2,
      ease: "power2.inOut",
      onStart: () => { setIsAnimating(true); },
      onComplete: () => { setIsAnimating(false); },
    });

    lookAtTweenRef.current = gsap.to(lookAtTarget.current, {
      x: target[0], y: target[1], z: target[2],
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [activeSection, camera]);

  // Apply lookAt every frame while animating
  useFrame(() => {
    if (!isAnimating) return;
    camera.lookAt(lookAtTarget.current.x, lookAtTarget.current.y, lookAtTarget.current.z);
  });

  // OrbitControls active when not animating
  return (
    <OrbitControls
      enabled={!isAnimating}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2}
      minDistance={8}
      maxDistance={18}
      target={lookAtTarget.current}
      enableZoom={true}
      enablePan={false}
    />
  );
}
