"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Html, Sparkles, useProgress } from "@react-three/drei"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CharacterModel from "./CharacterModel"
import CameraController from "./CameraController"
import Lighting from "./Lighting"
import Effects from "./Effects"
import UIOverlay from "./UIOverlay"

gsap.registerPlugin(ScrollTrigger)

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="glass-panel w-64 rounded-2xl p-4 text-center text-white/70">
        <div className="text-xs uppercase tracking-[0.3em] text-neonGreen/80">
          Syncing Reality
        </div>
        <div className="mt-4 h-2 rounded-sm bg-white/10">
          <div
            className="h-2 rounded-sm bg-neonGreen"
            style={{ width: `${progress.toFixed(0)}%` }}
          />
        </div>
      </div>
    </Html>
  )
}

export default function HeroArcane() {
  const scrollRef = useRef(0)
  const hoveredRef = useRef(false)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#hero-arcane",
      start: "top top",
      end: "bottom+=1200 top",
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <section id="hero-arcane" className="relative min-h-screen overflow-hidden bg-black">
      <div className="noise-overlay absolute inset-0 opacity-22" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(0,229,255,0.16),transparent_45%)]" />
      <div className="hero-frame pointer-events-none">
        <div className="hero-grid" />
        <div className="scanlines" />
      </div>

      <div className="absolute inset-[5vh_4vw] z-20 rounded-[4px] overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} shadows className="h-full w-full">
          <Suspense fallback={<Loader />}>
            <fog attach="fog" args={["#020402", 5, 18]} />
            <CameraController scrollRef={scrollRef} hoveredRef={hoveredRef} />
            <Lighting hoveredRef={hoveredRef} />
            <CharacterModel scrollRef={scrollRef} hoveredRef={hoveredRef} />
            <Sparkles count={80} scale={[12, 8, 6]} size={1.1} speed={0.18} color="#39ff14" />
            <Effects />
          </Suspense>
        </Canvas>
      </div>
      <UIOverlay />
    </section>
  )
}
