"use client";

import { Suspense } from "react";
import CameraControls from "./cameras/CameraControls";
import Lighting from "./lights/Lighting";
import MainScene from "./models/MainScene";

export default function Scene() {
  return (
    <>
      <CameraControls />
      <Lighting />
      <Suspense fallback={null}>
        <MainScene />
      </Suspense>
    </>
  );
}
