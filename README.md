# proj-0

> An interactive 3D configurator for a teardrop caravan — built as a demo.

![Demo](https://proj-0-eo9gyjyrj-contlimaferreiraeverton-5785s-projects.vercel.app/)

---

## Overview

**proj-0** is a real-time 3D product configurator for a teardrop trailer, demonstrating how complex physical products can be explored, configured, and felt — directly in the browser, with no plugins.

It's the flagship demo of the forma3d boilerplate: a repeatable, production-ready foundation for manufacturers who want their products to be experienced online, not just described.

---

## Features

- **Orbital camera** — full 360° exploration of the model with smooth orbit controls
- **Exploded view** — animated disassembly to reveal internal structure and components
- **Galley door animation** — GSAP-driven door open/close with realistic motion
- **Hotspot system** — contextual information anchored to 3D points in world space
- **Roof variant switching** — real-time material and geometry swap between configurations
- 🚧 **Interior view** — in progress

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| 3D rendering | Three.js + React Three Fiber |
| Animation | GSAP |
| State management | Zustand |
| UI components | shadcn/ui + Tailwind CSS |
| 3D pipeline | Blender → Draco-compressed GLB |
| Deployment | Vercel |

---

## 3D Pipeline

The model was built and exported from Blender following a structured naming convention for mesh management:

| Prefix | Purpose |
|---|---|
| `ext_` | Exterior parts |
| `int_` | Interior parts |
| `opt_` | Optional / configurable parts |
| `mat_` | Material swap targets |

Assets are exported as **Draco-compressed GLB** with baked lightmaps via SimpleBake, optimized for fast load and smooth real-time rendering.

---

## Getting Started

```bash
git clone https://github.com/eferreiradel/proj-0.git
cd proj-0
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Live Demo

[proj-0 on Vercel →](https://proj-0-eo9gyjyrj-contlimaferreiraeverton-5785s-projects.vercel.app/)

---

## About forma3d

forma3d builds interactive 3D product configurators for manufacturers of complex physical products — caravans, furniture, industrial equipment.

> *Your product deserves to be felt.*

[linkedin.com/in/everton.forma3d](https://www.linkedin.com/in/everton.forma3d)
