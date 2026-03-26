"use client"

import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  scrollRef: React.MutableRefObject<number>
  hoveredRef: React.MutableRefObject<boolean>
  centered?: boolean
}

export default function CameraController({ scrollRef, hoveredRef, centered = false }: Props) {
  useFrame(({ camera, mouse, clock }) => {
    const zoom = 6.6
    const x = centered ? mouse.x * 0.2 : 0.8 + mouse.x * 0.45
    const y = centered ? mouse.y * 0.15 : mouse.y * 0.25
    const shake = hoveredRef.current ? Math.sin(clock.elapsedTime * 10) * 0.01 : 0
    camera.position.lerp(new THREE.Vector3(x + shake, y + shake, zoom), 0.08)
    camera.lookAt(centered ? new THREE.Vector3(0, 0.1, 0) : new THREE.Vector3(1.8, 0.2, 0))
  })

  return null
}
