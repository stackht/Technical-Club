"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useCursor, useGLTF } from "@react-three/drei"
import { Group } from "three"
import { DRACOLoader } from "three-stdlib"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

export default function Model() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(
    "/models/model.glb",
    true,
    undefined,
    (loader) => {
      loader.setDRACOLoader(dracoLoader)
    },
  )
  const [hovered, setHovered] = useState(false)
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const emissiveMaterials = useRef<THREE.MeshStandardMaterial[]>([])

  useCursor(hovered)

  useEffect(() => {
    emissiveMaterials.current = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        const material = child.material
        if (material && "emissive" in material) {
          const mat = material as THREE.MeshStandardMaterial
          mat.emissive = new THREE.Color("#00f0ff")
          mat.emissiveIntensity = 0.2
          emissiveMaterials.current.push(mat)
        }
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const targetScale = hovered ? 1.05 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    groupRef.current.rotation.y += 0.002
    emissiveMaterials.current.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        hovered ? 1.2 : 0.25,
        0.08,
      )
    })
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, -0.6, 0]}
    >
      <primitive object={scene} scale={2.2} />
    </group>
  )
}

useGLTF.preload("/models/model.glb")
