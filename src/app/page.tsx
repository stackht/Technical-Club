"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Lenis from "lenis"
import CursorGlow from "../components/CursorGlow"
import HeroCentered from "../components/HeroCentered"
import VisionAgenda from "../components/sections/VisionAgenda"
import TraditionalVsUs from "../components/sections/TraditionalVsUs"
import ParticipantBenefits from "../components/sections/ParticipantBenefits"
import SelectionCriteria from "../components/sections/SelectionCriteria"
import TeamTasks from "../components/sections/TeamTasks"
import OurGoals from "../components/sections/OurGoals"
import WhyTrustUs from "../components/sections/WhyTrustUs"
import WhoAreWe from "../components/sections/WhoAreWe"
import FormSection from "../components/Form"

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [hideHeroText, setHideHeroText] = useState(false)
  const rotateRef = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    let ticking = false
    let lastHide = false
    let timeout: ReturnType<typeof setTimeout> | null = null

    const updateActive = () => {
      ticking = false
      const top = scroller.scrollTop
      const shouldHide = top > 20
      if (shouldHide !== lastHide) {
        lastHide = shouldHide
        setHideHeroText(shouldHide)
      }
      rotateRef.current = top * 0.003
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
    return () => {
      if (timeout) clearTimeout(timeout)
      scroller.removeEventListener("scroll", onScroll)
      document.body.classList.remove("is-scrolling")
    }
  }, [])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const content = scroller.querySelector(".page-depth") as HTMLElement | null
    const lenis = new Lenis({
      wrapper: scroller,
      content: content ?? undefined,
      lerp: 0.08,
      smoothWheel: true,
    })
    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
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
      event.preventDefault()
    }
    scroller.addEventListener("wheel", handleWheel, { passive: false })
    return () => scroller.removeEventListener("wheel", handleWheel)
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
          <WhoAreWe />
          <FormSection />
          <div className="scroll-spacer-end" />
        </div>
      </div>
    </motion.main>
  )
}
