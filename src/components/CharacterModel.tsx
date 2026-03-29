"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { PresentationControls, useCursor, useGLTF } from "@react-three/drei"
import { DRACOLoader } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

type Props = {
  scrollRef: React.MutableRefObject<number>
  hoveredRef: React.MutableRefObject<boolean>
  centered?: boolean
  rotateRef?: React.MutableRefObject<number>
}

export default function CharacterModel({
  scrollRef,
  hoveredRef,
  centered = false,
  rotateRef,
}: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const hasInitialized = useRef(false)
  const basePosition = useMemo(() => {
    if (!centered) return new THREE.Vector3(3.2, -1.1, 0)
    const x = THREE.MathUtils.clamp(viewport.width * 0.22, 1.1, 2.6)
    const y = THREE.MathUtils.clamp(-viewport.height * 0.32, -3.0, -1.8)
    return new THREE.Vector3(x, y, 0)
  }, [centered, viewport.width, viewport.height])
  const modelScale = centered
    ? THREE.MathUtils.clamp(viewport.width * 0.35, 1.2, 1.8)
    : 0.42
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const emissiveMaterials = useRef<THREE.MeshStandardMaterial[]>([])
  const emissiveBase = useRef(new Map<THREE.MeshStandardMaterial, number>())
  const { mouse } = useThree()
  const { scene } = useGLTF(
    "/models/scene.gltf",
    true,
    undefined,
    (loader) => {
      loader.setDRACOLoader(dracoLoader)
      loader.manager.setURLModifier((url) => {
        if (url.includes("Assets/Models/")) return url.replace("Assets/Models/", "models/")
        return url
      })
    },
  )

  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useEffect(() => {
    emissiveMaterials.current = []
    emissiveBase.current.clear()
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        const material = child.material
        if (material && "emissive" in material) {
          const mat = material as THREE.MeshStandardMaterial
          emissiveMaterials.current.push(mat)
          emissiveBase.current.set(mat, mat.emissiveIntensity ?? 0)
        }
      }
    })

    // Center the model so it sits at the origin
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.set(-center.x, -center.y, -center.z)
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const scrollShift = centered ? 0.2 : 0
    const parallaxX = 0
    const parallaxY = 0
    const targetPosition = new THREE.Vector3(
      basePosition.x + parallaxX,
      basePosition.y + parallaxY - scrollShift,
      basePosition.z,
    )

    if (!hasInitialized.current) {
      groupRef.current.position.copy(targetPosition)
      groupRef.current.scale.set(1, 1, 1)
      groupRef.current.rotation.set(0, rotateRef?.current ?? 0, 0)
      hasInitialized.current = true
      return
    }

    groupRef.current.position.copy(targetPosition)

    groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2)
    const targetRotY = rotateRef?.current ?? 0
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.12)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.2)

    emissiveMaterials.current.forEach((mat) => {
      const base = emissiveBase.current.get(mat) ?? 0
      if (mat.emissive) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity ?? base,
          base,
          0.2,
        )
      }
    })
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        hoveredRef.current = true
        setHovered(true)
      }}
      onPointerOut={() => {
        hoveredRef.current = false
        setHovered(false)
      }}
      position={[basePosition.x, basePosition.y - (centered ? 0.2 : 0), 0]}
    >
      <primitive object={scene} scale={modelScale} />
    </group>
  )
}

useGLTF.preload("/models/scene.gltf")
