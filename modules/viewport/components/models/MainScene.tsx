"use client"

import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useConfigStore } from '@/modules/viewport/store/useConfigStore'
import gsap from 'gsap'

const MODEL_PATH = '/3d/scene/main.glb'
const SHELL_SLIDE_Y = 5

export function Model() {
  const group = useRef<THREE.Group>(null!)
  const gltf = useGLTF(MODEL_PATH)
  const { actions } = useAnimations(gltf.animations, gltf.scene)
  const activeSection = useConfigStore((s) => s.activeSection)
  const roofOption = useConfigStore((s) => s.roofOption)

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
      } else if (!isGalley && activeSection !== 'freeview' && galleyIsOpen.current) {
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
