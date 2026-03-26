"use client"

import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  scrollRef: React.MutableRefObject<number>
  hoveredRef: React.MutableRefObject<boolean>
  centered?: boolean
}

export default function CameraController({ scrollRef, hoveredRef, centered = false }: Props) {
  useFrame(({ camera }) => {
    const zoom = 6.6
    const x = centered ? 0 : 1.2
    const y = centered ? 0 : 0.1
    camera.position.lerp(new THREE.Vector3(x, y, zoom), 0.08)
    camera.lookAt(centered ? new THREE.Vector3(0, 0.1, 0) : new THREE.Vector3(1.8, 0.2, 0))
  })

  return null
}
