"use client";

import { Suspense } from "react";
import CameraControls from "./cameras/CameraControls";
import CameraLogger from "./cameras/CameraLogger";
import Lighting from "./lights/Lighting";
import { Model as MainScene } from "./models/MainScene";

export default function Scene() {
  return (
    <>
      <CameraControls />
      <CameraLogger />
      <Lighting />
      <Suspense fallback={null}>
        <MainScene />
      </Suspense>
    </>
  );
}
