"use client"

import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function CameraController() {
  const target = new THREE.Vector3(0, 0.2, 0)
  const position = new THREE.Vector3(0, 0, 6.6)

  useFrame(({ camera }) => {
    camera.position.lerp(position, 0.08)
    camera.lookAt(target)
  })

  return null
}
