"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Html, useProgress } from "@react-three/drei"
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
          Loading Model
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

type Props = {
  hideHeroText?: boolean
  rotateRef?: React.MutableRefObject<number>
}

export default function HeroCentered({ hideHeroText = false, rotateRef }: Props) {
  const scrollRef = useRef(0)
  const hoveredRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    if (!scroller) return
    const trigger = ScrollTrigger.create({
      trigger: "#hero-centered",
      start: "top top",
      end: "bottom+=1200 top",
      scrub: true,
      scroller,
      onUpdate: (self) => {
        scrollRef.current = self.progress
      },
    })
    return () => trigger.kill()
  }, [])

  useEffect(() => {
    scrollRef.current = 0
  }, [pathname])

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <section id="hero-centered" className="relative min-h-screen overflow-hidden bg-[#050805]">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,229,255,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,0,0.06),transparent_50%)]" />

      <div className="absolute inset-0 z-10">
        <UIOverlay variant="centered" hideHeroText={hideHeroText} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-30"
      >
        <Canvas
          key={pathname}
          camera={{ position: [0, 0.2, 7], fov: 42 }}
          dpr={isMobile ? 0.9 : 1}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          className="h-full w-full pointer-events-none"
        >
          <Suspense fallback={<Loader />}>
            <fog attach="fog" args={["#050505", 6, 20]} />
            <CameraController scrollRef={scrollRef} hoveredRef={hoveredRef} centered />
            <Lighting hoveredRef={hoveredRef} />
            <CharacterModel
              scrollRef={scrollRef}
              hoveredRef={hoveredRef}
              centered
              rotateRef={rotateRef}
            />
            <Effects />
          </Suspense>
        </Canvas>
      </motion.div>
    </section>
  )
}
