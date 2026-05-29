"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import gsap from "gsap";

// Camera positions per section
const POSITIONS: Record<string, [number, number, number]> = {
  esterni: [15.71, 1.76, -0.88],
  tetto: [7.15, 7.82, -7.59],
  interni: [5.5, 3.2, -1.2],
  galley: [6.73, 4.5, 9.08],
};

// Where the camera looks for each section
const TARGETS: Record<string, [number, number, number]> = {
  esterni: [0, 1.0, 0],
  tetto: [0, 1.0, 0],
  interni: [1, 1.5, -0.5],
  galley: [0, 1.0, 0],
};

export default function CameraControls() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const cameraResetCount = useConfigStore((s) => s.cameraResetCount);
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const lookAtTweenRef = useRef<gsap.core.Tween | null>(null);

  // Start ready on mount — esterni is the default and camera starts at its position
  const [orbitReady, setOrbitReady] = useState(true);

  const animateTo = useCallback((section: string, onDone?: () => void) => {
    const pos = POSITIONS[section];
    const target = TARGETS[section];
    if (!pos || !target) return;

    tweenRef.current?.kill();
    lookAtTweenRef.current?.kill();
    setOrbitReady(false);

    tweenRef.current = gsap.to(camera.position, {
      x: pos[0], y: pos[1], z: pos[2],
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setOrbitReady(true);
        onDone?.();
      },
    });

    lookAtTweenRef.current = gsap.to(lookAtTarget.current, {
      x: target[0], y: target[1], z: target[2],
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [camera]);

  // Animate on section change
  const prevSection = useRef<string | null>(null);
  useEffect(() => {
    if (prevSection.current === null) {
      // First mount — already at esterni position, just mark ready
      prevSection.current = activeSection;
      return;
    }
    prevSection.current = activeSection;
    animateTo(activeSection);
  }, [activeSection, animateTo]);

  // Reset camera to default position when same section is clicked again
  useEffect(() => {
    if (cameraResetCount === 0) return;
    animateTo(activeSection);
  }, [cameraResetCount, activeSection, animateTo]);

  // Apply lookAt every frame while OrbitControls is not active
  useFrame(() => {
    if (orbitReady) return;
    camera.lookAt(lookAtTarget.current.x, lookAtTarget.current.y, lookAtTarget.current.z);
  });

  if (orbitReady) {
    return (
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={20}
        target={new THREE.Vector3(
          TARGETS[activeSection]?.[0] ?? 0,
          TARGETS[activeSection]?.[1] ?? 1,
          TARGETS[activeSection]?.[2] ?? 0,
        )}
      />
    );
  }

  return null;
}
