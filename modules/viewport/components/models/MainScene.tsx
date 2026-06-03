"use client"

import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { useConfigStore } from '@/modules/viewport/store/useConfigStore'
import gsap from 'gsap'

const MODEL_PATH = '/3d/scene/main.glb'
const LIGHTMAP_PATHS = {
  day: '/3d/scene/interior_lightmap_day.hdr',
  night: '/3d/scene/interior_lightmap_night.hdr',
}
const SHELL_SLIDE_Y = 12

export function Model() {
  const group = useRef<THREE.Group>(null!)
  const gltf = useGLTF(MODEL_PATH)
  const { actions } = useAnimations(gltf.animations, gltf.scene)
  const activeSection = useConfigStore((s) => s.activeSection)
  const roofOption = useConfigStore((s) => s.roofOption)
  const paintColor = useConfigStore((s) => s.paintColor)
  const interiorMode = useConfigStore((s) => s.interiorMode)

  // Find ext_shell_r node
  const shellRef = useRef<THREE.Object3D | null>(null)
  const shellOriginalY = useRef(0)
  useEffect(() => {
    const shell = gltf.scene.getObjectByName('ext_shell_r')
    if (shell) {
      shellRef.current = shell
      shellOriginalY.current = shell.position.y
    }
  }, [gltf.scene])

  // Show/hide roof_rack and roof_rack_full based on roofOption
  useEffect(() => {
    const roofRack = gltf.scene.getObjectByName('roof_rack')
    if (roofRack) {
      roofRack.visible = roofOption === 'crossbars'
    }
    const roofRackFull = gltf.scene.getObjectByName('roof_rack_full')
    if (roofRackFull) {
      roofRackFull.visible = roofOption === 'roof_rack_full'
    }
  }, [roofOption, gltf.scene])

  // Change paint color
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat?.name === 'mat_ext_paint') {
          mat.color.set(paintColor)
        }
      }
    })
  }, [paintColor, gltf.scene])

  // Ground shadow: apply alpha-mapped texture to the Ground plane
  useEffect(() => {
    const ground = gltf.scene.getObjectByName('Ground') as THREE.Mesh
    if (!ground) return

    const loader = new THREE.TextureLoader()
    const shadowTex = loader.load('/3d/scene/lightmap_ground.png', (tex) => {
      tex.colorSpace = THREE.NoColorSpace
      tex.flipY = false
      tex.anisotropy = 4
    })

    const oldMat = ground.material as THREE.Material
    ground.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    })
    ground.renderOrder = 1
    if (oldMat && oldMat !== ground.material) oldMat.dispose?.()

    return () => {
      shadowTex.dispose()
    }
  }, [gltf.scene])

  // Cache interior day/night materials + the shell_body.002 meshes
  const dayMat = useRef<THREE.Material | null>(null)
  const nightMat = useRef<THREE.Material | null>(null)
  const interiorMeshes = useRef<THREE.Mesh[]>([])
  useEffect(() => {
    // Grab both interior materials wherever they appear in the scene
    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = mesh.material as THREE.Material
      if (mat?.name === 'mat_interior_day' && !dayMat.current) dayMat.current = mat
      if (mat?.name === 'mat_interior_night' && !nightMat.current) nightMat.current = mat
    })

    // Locate the shell_body.002 node (three.js may sanitize the dot)
    const shellInterior =
      gltf.scene.getObjectByName('shell_body.002') ??
      gltf.scene.getObjectByName('shell_body002') ??
      gltf.scene.getObjectByName('shell_body_002')

    interiorMeshes.current = []
    if (shellInterior) {
      shellInterior.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (mesh.isMesh) interiorMeshes.current.push(mesh)
      })
    }
  }, [gltf.scene])

  // Load and apply interior lightmap based on day/night mode (cached, no re-decode on switch)
  const lightmapCache = useRef<Record<string, THREE.Texture>>({})
  useEffect(() => {
    const mesh = gltf.scene.getObjectByName('interior') as THREE.Mesh
    if (!mesh) return

    const applyLightmap = (tex: THREE.Texture) => {
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat.lightMap === tex) return
      mat.lightMap = tex
      mat.lightMapIntensity = 20.0
      mat.needsUpdate = true
    }

    const cached = lightmapCache.current[interiorMode]
    if (cached) {
      applyLightmap(cached)
      return
    }

    const path = LIGHTMAP_PATHS[interiorMode]
    new RGBELoader().load(path, (tex) => {
      tex.colorSpace = THREE.NoColorSpace
      tex.mapping = THREE.UVMapping
      tex.flipY = false
      lightmapCache.current[interiorMode] = tex
      applyLightmap(tex)
    })
  }, [gltf.scene, interiorMode])

  // Swap interior material based on day/night mode
  useEffect(() => {
    const target = interiorMode === 'day' ? dayMat.current : nightMat.current
    if (!target) return
    interiorMeshes.current.forEach((mesh) => {
      mesh.material = target
    })
  }, [interiorMode, gltf.scene])

  // GSAP shell slide + galley
  const prevSection = useRef(activeSection)
  const galleyIsOpen = useRef(false)
  useEffect(() => {
    if (!shellRef.current) return

    const wasInterni = prevSection.current === 'interni'
    const isInterni = activeSection === 'interni'
    const wasGalley = prevSection.current === 'galley'
    const isGalley = activeSection === 'galley'

    // Shell slide
    if (isInterni && !wasInterni) {
      gsap.to(shellRef.current.position, {
        y: shellOriginalY.current + SHELL_SLIDE_Y,
        duration: 1.2,
        ease: 'power2.inOut',
      })
    } else if (!isInterni && wasInterni) {
      gsap.to(shellRef.current.position, {
        y: shellOriginalY.current,
        duration: 1.0,
        ease: 'power2.out',
      })
    }

    // Galley animation from GLB
    const galleyUp = actions['galley_up']
    if (galleyUp) {
      galleyUp.clampWhenFinished = true
      galleyUp.setLoop(THREE.LoopOnce, 1)

      if (isGalley && !wasGalley) {
        galleyUp.timeScale = 1
        galleyUp.reset().play()
        galleyIsOpen.current = true
      } else if (!isGalley && galleyIsOpen.current) {
        // Close galley only if it was actually open
        galleyUp.timeScale = -1
        galleyUp.reset()
        galleyUp.time = galleyUp.getClip().duration
        galleyUp.play()
        galleyIsOpen.current = false
      }

      if (isGalley) galleyUp.timeScale = 1
    }

    prevSection.current = activeSection
  }, [activeSection, actions])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
