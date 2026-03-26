"use client"

import { Environment } from "@react-three/drei"

export default function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} color="#00f0ff" />
      <spotLight
        position={[-4, 8, 4]}
        intensity={2}
        angle={0.35}
        penumbra={0.6}
        color="#39ff14"
        castShadow
      />
      <Environment preset="city" />
    </>
  )
}
