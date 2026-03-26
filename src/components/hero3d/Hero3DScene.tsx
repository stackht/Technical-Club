"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing"
import { Html, useProgress } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import CameraController from "./CameraController"
import LightingSetup from "./LightingSetup"
import Model from "./Model"
import FloatingObjects from "./FloatingObjects"
import UIOverlay from "./UIOverlay"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="glass-panel w-64 rounded-2xl p-4 text-center text-white/70">
        <div className="text-xs uppercase tracking-[0.3em] text-neonBlue/80">
          Syncing Reality
        </div>
        <div className="mt-4 h-2 rounded-sm bg-white/10">
          <div
            className="h-2 rounded-sm bg-neonBlue"
            style={{ width: `${progress.toFixed(0)}%` }}
          />
        </div>
      </div>
    </Html>
  )
}

export default function Hero3DScene() {
  return (
    <section id="hero-3d" className="relative min-h-screen overflow-hidden bg-hero-radial">
      <div className="noise-overlay absolute inset-0 opacity-40" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        className="absolute inset-0"
      >
        <Suspense fallback={<Loader />}>
          <CameraController />
          <LightingSetup />
          <Physics gravity={[0, -0.2, 0]}>
            <Model />
            <FloatingObjects />
          </Physics>
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
            <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={1.2} />
            <Noise opacity={0.06} />
            <Vignette eskil={false} offset={0.25} darkness={0.75} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <UIOverlay />
    </section>
  )
}
