# Tech Stack

## Framework
- **Next.js** 16.2.6 — App Router
- **React** 19.2.4

## Language
- **TypeScript** ^5

## Styling
- **Tailwind CSS** ^4 (via @tailwindcss/postcss)

## UI Components
- **shadcn/ui** — Radix-based component library (components in `components/ui/`)
- **class-variance-authority** — Variant styling
- **clsx** + **tailwind-merge** — Class merging utilities
- **lucide-react** — Icons

## 3D
- **Three.js** ^0.184 — 3D rendering engine
- **@react-three/fiber** ^9.6 — React renderer for Three.js
- **@react-three/drei** ^10.7 — Useful helpers and abstractions for R3F
- **@theatre/core** + **@theatre/r3f** — Animation sequencing and timeline control
- **@theatre/studio** (dev only) — Visual animation editor

## State Management
- **Zustand** — Lightweight state store (used for config/section state)

## Internationalization
- **next-intl** ^4.12.0 — i18n for App Router (Server & Client Components)

## Linting
- **ESLint** ^9 with eslint-config-next

## Package Manager
- **npm** (package-lock.json)

## Supported Locales
- `en` (English) — default
- `it` (Italian)

## Important Notes
- When running `npx gltfjsx`, always fix the generated file afterwards:
  - Replace `import React from 'react'` with `import type { ThreeElements } from '@react-three/fiber'`
  - Remove `animations: GLTFAction[]` from the type (GLB has no animations)
  - Replace `JSX.IntrinsicElements['group']` with `ThreeElements['group']`
  - Replace `useGLTF('/main.glb') as GLTFResult` with `useGLTF('/3d/scene/main.glb') as unknown as GLTFResult`
  - Replace `useGLTF.preload('/main.glb')` with `useGLTF.preload('/3d/scene/main.glb')`
