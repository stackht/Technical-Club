"use client"

import { memo, useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

function VisionAgenda() {
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
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-neonGreen/30 bg-gradient-to-br from-black via-[#0a1206] to-[#0b1604] p-8 text-white"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-neonGreen/80">
              Vision
            </div>
            <p className="mt-4 text-lg leading-relaxed text-white/85">
              "To transform students from learners of syntax into builders of
              scalable systems - and to establish the college as a recognized
              hub for innovation, startup culture, and technical excellence."
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              "Executive Summary",
              "Mission & Vision",
              "Core Philosophy - The AI-Era Approach",
              "Team Structure & Composition",
              "Technical Teams & Roles",
              "Leadership Structure",
              "Working Model and Standard Operating Procedure",
              "Benefits & Impact",
              "Scope & Exclusion Clause",
            ].map((label, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                style={{ animationDelay: `${index * 0.2}s` }}
                className="glass-panel relative rounded-2xl p-5 text-white/70 float-slow"
              >
                <div className="absolute -top-6 right-5 h-12 w-12 rounded-sm bg-neonGreen/20 blur-2xl" />
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="mt-2 font-orbitron text-sm text-white">
                  {label}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(VisionAgenda)
