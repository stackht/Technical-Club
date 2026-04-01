"use client"

import { memo, useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

const steps = [
  "Registration",
  "Problem Statement Selection",
  "Interview Round",
  "Interview Results",
]

function SelectionCriteria() {
  const sectionRef = useRef<HTMLElement | null>(null)
  useGsapReveal(sectionRef)

  return (
    <section
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
          Selection Criteria / Rounds
        </motion.h2>

        <div className="mt-10 space-y-6 border-l border-neonGreen/40 pl-8">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative"
            >
              <div className="absolute -left-[45px] top-1 h-6 w-6 rounded-sm border border-neonGreen/70 bg-black shadow-[0_0_20px_rgba(0,255,0,0.8)]" />
              <h3 className="font-orbitron text-lg text-white">{step}</h3>
              <p className="mt-2 text-sm text-white/60">
                Precision checks, collaboration cues, and leadership signals.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(SelectionCriteria)
