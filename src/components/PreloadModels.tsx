"use client"

import { useEffect } from "react"
import { useGLTF } from "@react-three/drei"

export default function PreloadModels() {
  useEffect(() => {
    useGLTF.preload("/models/scene.gltf")
  }, [])

  return null
}
