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
          Our Vision
        </motion.h2>
        <div className="mt-6">
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
        </div>
      </div>
    </section>
  )
}

export default memo(VisionAgenda)
