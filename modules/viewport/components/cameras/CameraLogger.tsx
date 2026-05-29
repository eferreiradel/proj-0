"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Double-click anywhere to log camera position/rotation to a DOM overlay.
 */
export default function CameraLogger() {
  const { camera, gl } = useThree();

  useEffect(() => {
    // Create DOM element for output
    let el = document.getElementById("cam-log");
    if (!el) {
      el = document.createElement("div");
      el.id = "cam-log";
      el.style.cssText =
        "position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.85);color:#0f0;font:12px monospace;padding:12px;border-radius:8px;z-index:99999;pointer-events:none;white-space:pre;";
      document.body.appendChild(el);
    }

    const handler = () => {
      const pos = camera.position;
      const rot = camera.rotation;
      el!.textContent = [
        `position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`,
        `rotation: [${rot.x.toFixed(3)}, ${rot.y.toFixed(3)}, ${rot.z.toFixed(3)}]`,
      ].join("\n");
    };

    gl.domElement.addEventListener("dblclick", handler);
    return () => {
      gl.domElement.removeEventListener("dblclick", handler);
    };
  }, [camera, gl]);

  return null;
}
