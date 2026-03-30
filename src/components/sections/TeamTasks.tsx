"use client"

import { memo, useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

const faces = [
  { label: "Frontend", transform: "rotateY(0deg) translateZ(90px)" },
  { label: "Backend", transform: "rotateY(90deg) translateZ(90px)" },
  { label: "AI/ML", transform: "rotateY(180deg) translateZ(90px)" },
  { label: "Design", transform: "rotateY(-90deg) translateZ(90px)" },
  { label: "Management", transform: "rotateX(90deg) translateZ(90px)" },
  { label: "Operations", transform: "rotateX(-90deg) translateZ(90px)" },
]

function TeamTasks() {
  const sectionRef = useRef<HTMLElement | null>(null)
  useGsapReveal(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="terminal-section relative px-6 py-24 section-3d"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="terminal-title font-orbitron text-3xl text-neonGreen"
        >
            Team Tasks
          </motion.h2>
          <p className="mt-4 max-w-xl text-white/70">
            Every crew runs like a startup pod, rotating responsibilities across
            a high-velocity product cycle.
          </p>
        </div>

        <div className="relative flex justify-center">
          <div className="cube">
            {faces.map((face) => (
              <div
                key={face.label}
                className="cube-face"
                style={{ transform: face.transform }}
              >
                {face.label}
              </div>
            ))}
          </div>
          <div className="absolute -inset-6 rounded-sm border border-neonGreen/20 blur-2xl" />
        </div>
      </div>
    </section>
  )
}

export default memo(TeamTasks)
