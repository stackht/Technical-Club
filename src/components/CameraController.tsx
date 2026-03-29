"use client"

import { useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  scrollRef: React.MutableRefObject<number>
  hoveredRef: React.MutableRefObject<boolean>
  centered?: boolean
}

export default function CameraController({ scrollRef, hoveredRef, centered = false }: Props) {
  const { camera } = useThree()
  const target = centered ? new THREE.Vector3(0, 0.1, 0) : new THREE.Vector3(1.8, 0.2, 0)
  const position = centered ? new THREE.Vector3(0, 0, 6.6) : new THREE.Vector3(1.2, 0.1, 6.6)

  useEffect(() => {
    camera.position.copy(position)
    camera.lookAt(target)
  }, [camera, position, target])

  useFrame(() => {
    camera.lookAt(target)
  })

  return null
}
