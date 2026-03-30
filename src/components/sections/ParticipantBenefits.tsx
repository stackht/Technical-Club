"use client"

import { memo, useRef } from "react"
import { animated, to, useSpring } from "@react-spring/web"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

const benefits = [
  "Real startup experience",
  "Hackathon exposure",
  "Industry-level projects",
  "Networking",
]

function HoloCard({ text }: { text: string }) {
  const [springProps, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  }))

  return (
    <animated.div
      className="glass-panel relative rounded-2xl p-6 text-white/80"
      style={{
        transform: to(
          [springProps.rotateX, springProps.rotateY, springProps.scale],
          (rx, ry, s) =>
            `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`,
        ),
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const rotateX = ((y / rect.height) * 2 - 1) * -10
        const rotateY = ((x / rect.width) * 2 - 1) * 12
        api.start({ rotateX, rotateY, scale: 1.03 })
      }}
      onMouseLeave={() => api.start({ rotateX: 0, rotateY: 0, scale: 1 })}
    >
      <animated.div>
        <div className="absolute inset-0 rounded-2xl border border-neonGreen/40 opacity-60" />
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-sm bg-neonGreen/20 blur-2xl" />
        <h3 className="font-orbitron text-lg text-white">{text}</h3>
        <p className="mt-3 text-sm text-white/60">
          Unlock guided pathways, peer squads, and high-impact delivery.
        </p>
      </animated.div>
    </animated.div>
  )
}

function ParticipantBenefits() {
  const sectionRef = useRef<HTMLElement | null>(null)
  useGsapReveal(sectionRef)

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="terminal-section relative px-6 py-24 section-3d"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="terminal-title font-orbitron text-3xl text-neonGreen"
        >
          Participant Benefits
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <HoloCard key={benefit} text={benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(ParticipantBenefits)
