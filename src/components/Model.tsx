"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { PresentationControls, useCursor, useGLTF } from "@react-three/drei"
import { Group } from "three"
import { DRACOLoader } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

export default function Model() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(
    "/models/scene.gltf",
    true,
    undefined,
    (loader) => {
      loader.setDRACOLoader(dracoLoader)
      const fallbackTexture =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
      loader.manager.setURLModifier((url) => {
        if (url.includes("Assets/Models/")) return fallbackTexture
        return url
      })
    },
  )
  const [hovered, setHovered] = useState(false)
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const { mouse } = useThree()
  const basePosition = useMemo(() => new THREE.Vector3(2.2, -1.4, 0), [])

  useCursor(hovered)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    const parallaxX = mouse.x * 0.4
    const parallaxY = mouse.y * 0.3
    groupRef.current.position.lerp(
      new THREE.Vector3(
        basePosition.x + parallaxX,
        basePosition.y + Math.sin(time * 0.6 + floatOffset) * 0.2 + parallaxY,
        basePosition.z,
      ),
      0.08,
    )
    const targetScale = hovered ? 1.05 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    groupRef.current.rotation.y += 0.002
  })

  return (
    <PresentationControls
      global
      rotation={[0.1, 0, 0]}
      polar={[-0.6, 0.6]}
      azimuth={[-1.2, 1.2]}
      speed={1.5}
    >
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[2.2, -1.4, 0]}
      >
        <primitive object={scene} scale={0.5} />
      </group>
    </PresentationControls>
  )
}

useGLTF.preload(
  "/models/scene.gltf",
  true,
  undefined,
  (loader) => {
    loader.setDRACOLoader(dracoLoader)
    const fallbackTexture =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
    loader.manager.setURLModifier((url) => {
      if (url.includes("Assets/Models/")) return fallbackTexture
      return url
    })
  },
)
