"use client";

import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useConfigStore, type Section } from "@/modules/viewport/store/useConfigStore";
import gsap from "gsap";

// Camera positions per section
const POSITIONS: Record<string, [number, number, number]> = {
  esterni: [15.71, 1.76, -0.88],
  tetto: [7.15, 7.82, -7.59],
  interni: [3.5, 1.6, -0.8],
  galley: [6.73, 4.5, 9.08],
};

// Where the camera looks for each section
const TARGETS: Record<string, [number, number, number]> = {
  esterni: [0, 1.0, 0],
  tetto: [0, 1.0, 0],
  interni: [-1, 1.3, 0],
  galley: [0, 1.0, 0],
};

export default function CameraControls() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const lookAtTweenRef = useRef<gsap.core.Tween | null>(null);
  const isFreeView = activeSection === "freeview";

  // Mouse parallax
  const mouseOffset = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseOffset.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseOffset.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Animate camera on section change (not for freeview)
  const prevSection = useRef(activeSection);
  useEffect(() => {
    if (prevSection.current === activeSection) return;
    prevSection.current = activeSection;

    if (isFreeView) return; // Don't animate into freeview

    const pos = POSITIONS[activeSection];
    const target = TARGETS[activeSection];
    if (!pos || !target) return;

    tweenRef.current?.kill();
    lookAtTweenRef.current?.kill();

    tweenRef.current = gsap.to(camera.position, {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      duration: 1.2,
      ease: "power2.inOut",
    });

    lookAtTweenRef.current = gsap.to(lookAtTarget.current, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [activeSection, camera, isFreeView]);

  // Apply lookAt every frame (not in freeview)
  useFrame(() => {
    if (isFreeView) return;

    const parallaxStrength = activeSection === "interni" ? 1.0 : 0;
    smoothMouse.current.x += (mouseOffset.current.x - smoothMouse.current.x) * 0.03;
    smoothMouse.current.y += (mouseOffset.current.y - smoothMouse.current.y) * 0.03;

    const offsetX = smoothMouse.current.x * parallaxStrength;
    const offsetY = -smoothMouse.current.y * parallaxStrength * 0.3;
    camera.lookAt(
      lookAtTarget.current.x + offsetX,
      lookAtTarget.current.y + offsetY,
      lookAtTarget.current.z
    );
  });

  // In freeview, render OrbitControls
  if (isFreeView) {
    return (
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={20}
        target={[0, 1.0, 0]}
      />
    );
  }

  return null;
}
