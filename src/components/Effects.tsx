"use client"

import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing"

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.15} mipmapBlur />
      <DepthOfField focusDistance={0.0} focalLength={0.0} bokehScale={0.0} />
      <Vignette eskil={false} offset={0.2} darkness={0.9} />
    </EffectComposer>
  )
}
