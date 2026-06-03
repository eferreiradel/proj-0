"use client";

import { useState } from "react";
import { create } from "zustand";

export interface LightingParams {
  ambientIntensity: number;
  directionalIntensity: number;
  directionalX: number;
  directionalY: number;
  directionalZ: number;
  environmentRotation: number;
  aoIntensity: number;
  pointLightIntensity: number;
  pointLightX: number;
  pointLightY: number;
  pointLightZ: number;
}

interface LightingStoreState {
  params: LightingParams;
  setParams: (params: LightingParams) => void;
}

export const useLightingStore = create<LightingStoreState>((set) => ({
  params: {
    ambientIntensity: 0.2,
    directionalIntensity: 0.5,
    directionalX: 5,
    directionalY: 8,
    directionalZ: 5,
    environmentRotation: Math.PI / 4,
    aoIntensity: 0,
    pointLightIntensity: 0.8,
    pointLightX: 8,
    pointLightY: 2,
    pointLightZ: 10,
  },
  setParams: (params) => set({ params }),
}));

export default function LightingDebug() {
  const params = useLightingStore((s) => s.params);
  const setParams = useLightingStore((s) => s.setParams);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (key: keyof LightingParams, value: number) => {
    setParams({ ...params, [key]: value });
  };

  const exportConfig = () => {
    const config = {
      lighting: {
        ambient: { intensity: params.ambientIntensity },
        directional: {
          position: [params.directionalX, params.directionalY, params.directionalZ],
          intensity: params.directionalIntensity,
        },
        pointLight: {
          position: [params.pointLightX, params.pointLightY, params.pointLightZ],
          intensity: params.pointLightIntensity,
        },
        environmentRotation: params.environmentRotation,
      },
      effects: {
        ambientOcclusion: { intensity: params.aoIntensity },
      },
    };
    return JSON.stringify(config, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors z-50"
      >
        🎨 Lighting Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm p-4 max-h-[90vh] overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Lighting Parameters</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {/* Ambient Light */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Ambient Intensity: {params.ambientIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={params.ambientIntensity}
          onChange={(e) => handleChange("ambientIntensity", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Directional Light Intensity */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Directional Intensity: {params.directionalIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={params.directionalIntensity}
          onChange={(e) => handleChange("directionalIntensity", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Directional Position */}
      <div className="mb-4 space-y-2 border-b pb-4">
        <label className="block text-xs font-semibold text-gray-700">
          Directional Position
        </label>
        <div>
          <label className="text-xs text-gray-600">X: {params.directionalX.toFixed(2)}</label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.5"
            value={params.directionalX}
            onChange={(e) => handleChange("directionalX", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Y: {params.directionalY.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={params.directionalY}
            onChange={(e) => handleChange("directionalY", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Z: {params.directionalZ.toFixed(2)}</label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.5"
            value={params.directionalZ}
            onChange={(e) => handleChange("directionalZ", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Point Light (Interior) */}
      <div className="mb-4 space-y-2 border-b pb-4">
        <label className="block text-xs font-semibold text-gray-700">
          Point Light Intensity: {params.pointLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={params.pointLightIntensity}
          onChange={(e) => handleChange("pointLightIntensity", parseFloat(e.target.value))}
          className="w-full"
        />

        <label className="block text-xs font-semibold text-gray-700 mt-3">
          Point Light Position
        </label>
        <div>
          <label className="text-xs text-gray-600">X: {params.pointLightX.toFixed(2)}</label>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={params.pointLightX}
            onChange={(e) => handleChange("pointLightX", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Y: {params.pointLightY.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={params.pointLightY}
            onChange={(e) => handleChange("pointLightY", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Z: {params.pointLightZ.toFixed(2)}</label>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={params.pointLightZ}
            onChange={(e) => handleChange("pointLightZ", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Environment Rotation */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Environment Rotation: {params.environmentRotation.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max={Math.PI * 2}
          step="0.1"
          value={params.environmentRotation}
          onChange={(e) => handleChange("environmentRotation", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Ambient Occlusion */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          AO Intensity: {params.aoIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={params.aoIntensity}
          onChange={(e) => handleChange("aoIntensity", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Export */}
      <div className="mt-4">
        <button
          onClick={handleCopy}
          className="w-full px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? "✓ Copied!" : "📋 Copy Config"}
        </button>
      </div>

      {/* Config Preview */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
        {exportConfig()}
      </div>
    </div>
  );
}
