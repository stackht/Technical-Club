"use client"

import { memo } from "react"
import { motion } from "framer-motion"

const team = [
  {
    name: "Nihal Mishra",
    role: "President",
    note: "National Level Hackathon Winner",
  },
  {
    name: "Hemant Thakur",
    role: "Vice President",
    note: "National Level Hackathon Winner",
  },
  {
    name: "Siddhesh Gangurde",
    role: "Technical Head",
    note: "",
  },
]

function WhoAreWe() {
  return (
    <section className="terminal-section relative px-6 py-24 section-3d">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="terminal-title font-orbitron text-3xl text-neonGreen"
        >
          Who Are We?
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="glass-panel hacker-scan rounded-2xl p-6 text-white/80"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-neonGreen/70">
                Identity Card
              </div>
              <div className="mt-4 text-lg font-orbitron text-white">{member.name}</div>
              <div className="mt-2 text-sm text-white/70">{member.role}</div>
              {member.note && (
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-neonGreen/60">
                  {member.note}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(WhoAreWe)
