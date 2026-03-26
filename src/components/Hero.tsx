"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import ThreeDScene from "./3DScene"
import { Button } from "./ui/button"

gsap.registerPlugin(ScrollToPlugin)

const subtitleText = "Build. Break. Innovate."

export default function Hero() {
  const [typed, setTyped] = useState("")
  const sectionRef = useRef<HTMLElement | null>(null)
  const [springProps, api] = useSpring(() => ({ xy: [0, 0] }))

  useEffect(() => {
    const fullText = "Code Disk"
    let index = 0
    const interval = setInterval(() => {
      index += 1
      setTyped(fullText.slice(0, index))
      if (index === fullText.length) {
        clearInterval(interval)
      }
    }, 140)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const handleMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      api.start({ xy: [x * 20, y * 20] })
    }
    section.addEventListener("mousemove", handleMove)
    return () => section.removeEventListener("mousemove", handleMove)
  }, [api])

  const subtitleChars = useMemo(() => subtitleText.split(""), [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-hero-radial px-6 pt-24"
    >
      <ThreeDScene />
      <div className="noise-overlay absolute inset-0 opacity-40" />
      <animated.div
        style={{
          transform: springProps.xy.to(
            (x, y) => `translate3d(${x}px, ${y}px, 0)`,
          ),
        }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-sm border border-neonBlue/40 bg-black/60 px-6 py-2 text-xs uppercase tracking-[0.4em] text-neonBlue/80"
        >
          Futuristic Technical Club
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="text-balance font-orbitron text-4xl uppercase text-[#dfe9d9] drop-shadow-[0_0_18px_rgba(170,220,170,0.35)] sm:text-6xl md:text-7xl"
        >
          <span className="glitch" data-text={typed}>
            {typed}
          </span>
          <span className="animate-pulse text-neonBlue">▍</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="max-w-2xl text-lg text-white/70 sm:text-xl"
        >
          {subtitleChars.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.04 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center gap-5"
        >
          <Button
            className="group overflow-hidden hover:scale-105"
            onMouseMove={(event) => {
              const target = event.currentTarget
              const rect = target.getBoundingClientRect()
              const x = event.clientX - rect.left
              const y = event.clientY - rect.top
              target.style.setProperty("--ripple-x", `${x}px`)
              target.style.setProperty("--ripple-y", `${y}px`)
            }}
            onClick={() => {
              const form = document.getElementById("join-form")
              if (!form) return
              gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: form, offsetY: 40 },
                ease: "power2.out",
              })
            }}
          >
            <span>Join the Movement</span>
            <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100">
              <span className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-neonBlue/30 blur-3xl [left:var(--ripple-x)] [top:var(--ripple-y)]" />
            </span>
          </Button>

          <button className="btn btn-ghost border border-white/20 text-white/60 hover:border-neonGreen hover:text-neonGreen">
            Explore Labs
          </button>
        </motion.div>
      </animated.div>
    </section>
  )
}
