# Project Structure

```
├── app/                    # Next.js App Router (pages, layouts, routes)
│   ├── layout.tsx          # Root layout with NextIntlClientProvider
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles (Tailwind)
│   └── favicon.ico
│
├── components/             # Shared UI components (shadcn/ui)
│   └── ui/
│       └── card.tsx        # Card component (shadcn)
│
├── lib/                    # Shared utilities
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│
├── locales/                # Translation files per module
│   └── {module}/           # One folder per module (e.g. home, dashboard, auth)
│       ├── en.ts           # English keys
│       └── it.ts           # Italian keys
│
├── messages/               # Aggregated messages per locale (TS, NOT JSON)
│   ├── en.ts              # Imports all modules' EN files and composes them
│   └── it.ts              # Imports all modules' IT files and composes them
│
├── i18n/                   # next-intl configuration
│   └── request.ts         # Request-scoped config (locale + messages loading)
│
├── modules/                # Feature modules
│   └── viewport/           # 3D viewport module
│       ├── Viewport.tsx    # Main component (Canvas + Theatre SheetProvider + UI overlay)
│       ├── index.ts        # Public exports
│       ├── animation.json  # Theatre.js exported animation state
│       ├── store/
│       │   └── useConfigStore.ts  # Zustand store (activeSection, selections)
│       └── components/
│           ├── cameras/
│           │   └── CameraControls.tsx  # OrbitControls (zoom-out only, no below horizon)
│           ├── lights/
│           │   └── Lighting.tsx        # Ambient + directional light
│           ├── models/
│           │   └── MainScene.tsx       # gltfjsx-generated model (typed meshes)
│           ├── ui/
│           │   └── SectionNav/         # Floating pill toolbar (4 sections)
│           │       └── locales/
│           │           └── SectionNav.tsx
│           └── Scene.tsx               # Scene composition (Suspense boundary)
│
├── public/                 # Static assets
│   └── 3d/
│       └── scene/
│           └── main.glb    # Main 3D scene model (Draco-compressed)
│
├── next.config.ts          # Next.js config with next-intl plugin
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS (Tailwind)
├── eslint.config.mjs       # ESLint configuration
└── package.json
```

## Conventions

### Translations
- Each module has its own folder under `locales/{module}/`
- Each locale file exports a default object with `as const`
- `messages/en.ts` and `messages/it.ts` import from `locales/` and compose the full message object
- Never use JSON for translations — always TypeScript files
- Namespace in next-intl matches the key in messages (e.g. `HomePage` → `useTranslations("HomePage")`)

### Adding a new module's translations
1. Create `locales/{module}/en.ts` and `locales/{module}/it.ts`
2. Import them in `messages/en.ts` and `messages/it.ts` under the appropriate namespace key

### 3D Models
- GLB files go in `public/3d/{category}/{name}.glb` (Draco-compressed preferred)
- Model components live in `modules/viewport/components/models/`
- Model components are generated with `npx gltfjsx` then manually fixed (see tech-stack.md notes)
- Use `useGLTF('/3d/scene/main.glb') as unknown as GLTFResult` for typed access
- Wrap model components in `<Suspense>` in the Scene
- The `Model` export is a named export (not default)

### Viewport components organization
- `cameras/` — camera controls and rigs
- `lights/` — all lighting setups
- `models/` — GLB/GLTF model loaders (gltfjsx-generated)
- `ui/` — overlay UI components (SectionNav, future FloatCard, BottomBar)
- `environment/` — grids, floors, skyboxes, fog

### State Management
- Zustand store at `modules/viewport/store/useConfigStore.ts`
- Import path: `@/modules/viewport/store/useConfigStore`
- Sections: `"Esterni" | "Tetto" | "Interni" | "Cambusa"`
- Default active section: `"Esterni"`

### Theatre.js Animation
- Project: `"Caravan"`, Sheet: `"Scene"`
- Studio initialized only in development (`process.env.NODE_ENV === "development"`)
- SheetProvider wraps the Scene inside Canvas
- Animation state exported to `modules/viewport/animation.json`

### OrbitControls constraints
- `minDistance: 5.2` — no zoom-in beyond initial camera position
- `maxDistance: 12` — max zoom-out
- `maxPolarAngle: Math.PI / 2` — cannot go below the model
- Full 360° horizontal rotation (no azimuth limits)
