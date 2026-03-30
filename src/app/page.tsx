"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import CursorGlow from "../components/CursorGlow"
import HeroCentered from "../components/HeroCentered"
import VisionAgenda from "../components/sections/VisionAgenda"
import TraditionalVsUs from "../components/sections/TraditionalVsUs"
import ParticipantBenefits from "../components/sections/ParticipantBenefits"
import SelectionCriteria from "../components/sections/SelectionCriteria"
import TeamTasks from "../components/sections/TeamTasks"
import OurGoals from "../components/sections/OurGoals"
import WhyTrustUs from "../components/sections/WhyTrustUs"
import FormSection from "../components/Form"

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [hideHeroText, setHideHeroText] = useState(false)
  const rotateRef = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const sections = Array.from(
      scroller.querySelectorAll<HTMLElement>(".terminal-section"),
    )
    if (!sections.length) return

    let ticking = false
    let lastHide = false
    let timeout: ReturnType<typeof setTimeout> | null = null

    const updateActive = () => {
      ticking = false
      const scrollerRect = scroller.getBoundingClientRect()
      const centerY = scrollerRect.top + scrollerRect.height / 2
      const header = document.querySelector(".terminal-header") as HTMLElement | null
      const headerBottom = header ? header.getBoundingClientRect().bottom : scrollerRect.top
      const headerHeight = header ? header.getBoundingClientRect().height : 0

      const top = scroller.scrollTop
      const shouldHide = top > 20
      if (shouldHide !== lastHide) {
        lastHide = shouldHide
        setHideHeroText(shouldHide)
      }
      rotateRef.current = top * 0.003

      sections.forEach((section) => {
        if (section.id === "participate") {
          section.style.opacity = "1"
          return
        }
        const rect = section.getBoundingClientRect()
        const sectionCenter = rect.top + rect.height / 2
        if (rect.top <= headerBottom) {
          const overlap = headerBottom - rect.top
          const fadeRange = Math.max(headerHeight * 1.2, 1)
          const progress = Math.min(Math.max(overlap / fadeRange, 0), 1)
          const fade = Math.max(1 - progress, 0)
          section.style.opacity = fade.toString()
          return
        }
        if (sectionCenter < centerY) {
          section.style.opacity = "0"
        } else {
          section.style.opacity = "1"
        }
      })
    }

    const onScroll = () => {
      document.body.classList.add("is-scrolling")
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling")
      }, 140)
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateActive)
    }

    updateActive()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      if (timeout) clearTimeout(timeout)
      scroller.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateActive)
      document.body.classList.remove("is-scrolling")
    }
  }, [])

  useEffect(() => {
    if (pathname !== "/") return
    const scroller = scrollRef.current
    if (!scroller) return
    scroller.scrollTo({ top: 0 })
    rotateRef.current = 0
    setHideHeroText(false)
  }, [pathname])

  useEffect(() => {
    if (pathname !== "/") return
    const scroller = scrollRef.current
    if (!scroller) return
    const topLock = () => {
      scroller.scrollTop = 0
      rotateRef.current = 0
    }
    topLock()
    const raf = requestAnimationFrame(topLock)
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const handleWheel = (event: WheelEvent) => {
      if (document.body.dataset.modalOpen === "true") return
      scroller.scrollTop += event.deltaY
    }
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])


  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative hero-bg"
    >
      <CursorGlow />
      <div className="hero-fixed">
        <HeroCentered hideHeroText={hideHeroText} rotateRef={rotateRef} />
      </div>
      <div ref={scrollRef} className="scroll-stage">
        <div className="scroll-spacer" />
        <div className="page-depth">
          <VisionAgenda />
          <TraditionalVsUs />
          <ParticipantBenefits />
          <SelectionCriteria />
          <TeamTasks />
          <OurGoals />
          <WhyTrustUs />
          <FormSection />
          <div className="scroll-spacer-end" />
        </div>
      </div>
    </motion.main>
  )
}
