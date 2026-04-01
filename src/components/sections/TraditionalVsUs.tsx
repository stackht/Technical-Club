"use client"

import { memo, useRef } from "react"
import { motion } from "framer-motion"
import { useGsapReveal } from "../hooks/useGsapReveal"

function TraditionalVsUs() {
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
          Traditional Club vs Branch Bliss
        </motion.h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60"
          >
            <h3 className="font-orbitron text-lg text-white/70">Traditional</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>General events, fests, and social activities</li>
              <li>Broad participation over tight core teams</li>
              <li>Output is events and promotions</li>
              <li>Selection is open or seniority-based</li>
              <li>Committees and meetings dominate delivery</li>
              <li>Theoretical exposure with low production rigor</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-neonGreen/40 bg-gradient-to-br from-black via-[#0a1206] to-[#0a1a02] p-8 text-white"
          >
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(182,255,0,0.1),transparent_60%)]" />
            <div className="absolute -right-10 top-10 h-32 w-32 rounded-sm bg-lime-400/20 blur-3xl" />
            <h3 className="relative font-orbitron text-lg text-neonGreen">
              Branch Bliss
            </h3>
            <ul className="relative mt-4 space-y-3 text-sm text-white/80">
              <li>Technical strike team — mini engineering ecosystem</li>
              <li>Lean, agile core of 20 selected members</li>
              <li>Real deployed products and systems</li>
              <li>2-stage Creative Pressure Test (mindset over credentials)</li>
              <li>Sprint-based development with deadlines</li>
              <li>AI-assisted, production-grade, industry-level work</li>
              <li>Strictly technical — no fests or social media work</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default memo(TraditionalVsUs)
