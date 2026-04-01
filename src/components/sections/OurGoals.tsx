"use client"

import { memo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGsapReveal } from "../hooks/useGsapReveal"

gsap.registerPlugin(ScrollTrigger)

const goals = [
  { label: "Build industry-level products", value: 92 },
  { label: "Prepare students for startups and internships", value: 88 },
  { label: "Encourage research-driven development", value: 78 },
  { label: "Develop AI-era engineers", value: 84 },
  { label: "Establish the college as an innovation hub", value: 90 },
]

function OurGoals() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  useGsapReveal(sectionRef)

  useEffect(() => {
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    const ctx = gsap.context(() => {
      if (!scroller) return
      barsRef.current.forEach((bar, index) => {
        if (!bar) return
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${goals[index].value}%`,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bar,
              scroller,
              start: "top 85%",
            },
          },
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

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
          Our Goals
        </motion.h2>

        <div className="mt-10 space-y-6">
          {goals.map((goal, index) => (
            <div key={goal.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-white/70">
                <span>{goal.label}</span>
                <span>{goal.value}%</span>
              </div>
              <div className="h-3 rounded-sm bg-white/10">
                <div
                  ref={(el) => {
                    barsRef.current[index] = el
                  }}
                  className="h-3 rounded-sm bg-neonGreen shadow-[0_0_20px_rgba(0,255,0,0.7)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(OurGoals)
