"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

export default function VisionAgenda() {
  const sectionRef = useRef<HTMLElement | null>(null)
  useGsapReveal(sectionRef)

  return (
    <section
      id="vision"
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
          Our Vision & Agenda
        </motion.h2>
        <p className="mt-4 max-w-2xl text-white/70">
          We aim to build industry-ready developers through real-world projects,
          startup culture, and innovation.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Prototype", "Launch", "Iterate"].map((label, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              style={{ animationDelay: `${index * 0.4}s` }}
              className="glass-panel relative rounded-2xl p-6 text-white/70 float-slow"
            >
              <div className="absolute -top-8 right-6 h-16 w-16 rounded-sm bg-neonGreen/20 blur-2xl" />
              <h3 className="font-orbitron text-lg text-white">{label}</h3>
              <p className="mt-3 text-sm leading-relaxed">
                Structured sprints with immersive mentorship and hands-on labs.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
