"use client"

import { Environment } from "@react-three/drei"

export default function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 6]} intensity={1.3} color="#b6ff00" />
      <spotLight
        position={[-4, 8, 4]}
        intensity={2}
        angle={0.35}
        penumbra={0.6}
        color="#8ffcff"
        castShadow
      />
      <Environment preset="night" />
    </>
  )
}
