# Project Structure

```
├── app/                    # Next.js App Router (pages, layouts, routes)
│   ├── layout.tsx          # Root layout with NextIntlClientProvider
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles (Tailwind)
│   └── favicon.ico
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
│       ├── Viewport.tsx    # Main component (Canvas wrapper, flex-1 height)
│       ├── index.ts        # Public exports
│       └── components/     # Internal components by category
│           ├── cameras/
│           │   └── CameraControls.tsx  # OrbitControls with damping
│           ├── lights/
│           │   └── Lighting.tsx        # Ambient + directional light
│           ├── models/
│           │   └── MainScene.tsx       # GLB loader with fallback (Draco)
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
- Each model component handles its own loading + fallback
- Use `useGLTF(path, true)` for automatic Draco decoding
- Wrap model components in `<Suspense>` in the Scene

### Viewport components organization
- `cameras/` — camera controls and rigs
- `lights/` — all lighting setups
- `models/` — GLB/GLTF model loaders
- `environment/` — grids, floors, skyboxes, fog
