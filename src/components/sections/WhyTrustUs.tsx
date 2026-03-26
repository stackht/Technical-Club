"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

const testimonials = [
  "Built by passionate developers, for real-world impact.",
  "From ideation to deployment, we ship with purpose.",
  "A community that learns fast and builds faster.",
]

export default function WhyTrustUs() {
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
          Why Trust Us?
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((text, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="glitch-card glass-panel rounded-2xl p-6 text-white/70"
            >
              <p className="text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
