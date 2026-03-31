"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

gsap.registerPlugin(ScrollToPlugin)

const subtitleText = "There is a builder inside all of us"

type Props = {
  variant?: "centered"
  hideHeroText?: boolean
}

export default function UIOverlay({ variant, hideHeroText = false }: Props) {
  const router = useRouter()
  const [keySeq, setKeySeq] = useState("")
  const [typed, setTyped] = useState("")
  const [activeId, setActiveId] = useState("hero-centered")
  const [heroOpacity, setHeroOpacity] = useState(1)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [springProps, api] = useSpring(() => ({ xy: [0, 0] }))
  const subtitleChars = useMemo(() => subtitleText.split(""), [])
  const handleTabClick = (id: string) => {
    setActiveId(id)
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    if (!scroller) return
    if (id === "hero-centered") {
      scroller.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const target = document.getElementById(id)
    if (!target) return
    const targetCenter = target.offsetTop + target.offsetHeight / 2
    const scrollTop = targetCenter - scroller.clientHeight / 2
    scroller.scrollTo({ top: Math.max(scrollTop, 0), behavior: "smooth" })
  }

  useEffect(() => {
    const fullText = "Code Medium"
    let index = 0
    const interval = setInterval(() => {
      index += 1
      setTyped(fullText.slice(0, index))
      if (index === fullText.length) clearInterval(interval)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === "c") {
        setKeySeq("c")
        return
      }
      if (keySeq === "c" && event.key.toLowerCase() === "m") {
        setKeySeq("cm")
        return
      }
      if (keySeq === "cm" && event.key.toLowerCase() === "d") {
        setKeySeq("")
        router.push("/admin/login")
        return
      }
      if (event.key.length === 1) {
        setKeySeq("")
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [keySeq, router])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const handleMove = (event: MouseEvent) => {
      const rect = overlay.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      api.start({ xy: [x * 18, y * 16] })
    }
    overlay.addEventListener("mousemove", handleMove)
    return () => overlay.removeEventListener("mousemove", handleMove)
  }, [api])

  useEffect(() => {
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    if (!scroller) return
    const sections = ["hero-centered", "vision", "benefits", "participate"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) {
          setActiveId(visible.target.id)
        }
      },
      {
        root: scroller,
        threshold: [0.2, 0.4, 0.6, 0.8],
      },
    )

    sections.forEach((section) => observer.observe(section))
    const handleScroll = () => {
      if (scroller.scrollTop < 40) {
        setActiveId("hero-centered")
      }
    }
    scroller.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => {
      scroller.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    if (!scroller) return
    const hero = document.getElementById("hero-centered")
    const vision = document.getElementById("vision")
    if (!hero) return

    const updateHeroOpacity = () => {
      const scrollerRect = scroller.getBoundingClientRect()
      const centerY = scrollerRect.top + scrollerRect.height / 2
      const rect = hero.getBoundingClientRect()
      const heroCenter = rect.top + rect.height / 2
      const visionVisible =
        !!vision && vision.getBoundingClientRect().top < scrollerRect.bottom
      if (!visionVisible) {
        setHeroOpacity(1)
        return
      }
      setHeroOpacity(heroCenter < centerY ? 0 : 1)
    }

    updateHeroOpacity()
    const onScroll = () => requestAnimationFrame(updateHeroOpacity)
    scroller.addEventListener("scroll", onScroll)
    window.addEventListener("resize", updateHeroOpacity)
    return () => {
      scroller.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateHeroOpacity)
    }
  }, [])

  return (
    <>
      {variant === "centered" && (
        <div className="terminal-header terminal-header-layer pointer-events-auto fixed left-0 right-0 top-6 mx-auto flex w-full max-w-6xl items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60">
          <div className="terminal-titlebar">Cmd</div>
          <div className="terminal-tabs flex items-center gap-4">
            {[
              { label: "Home", id: "hero-centered" },
              { label: "Vision", id: "vision" },
              { label: "Benefits", id: "benefits" },
              { label: "Participate", id: "participate" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`terminal-tab cursor-pointer select-none ${activeId === item.id ? "terminal-tab-active" : ""}`}
                onMouseDown={() => handleTabClick(item.id)}
                onClick={() => handleTabClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="terminal-window-controls">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <animated.div
        ref={overlayRef}
        style={{
          transform: springProps.xy.to((x, y) => `translate3d(${x}px, ${y}px, 0)`),
        }}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6"
      >
        {variant === "centered" && (
          <>
            <div className="header-shield" />
          <motion.div
            initial={false}
            animate={{ opacity: hideHeroText ? 0 : 1, y: hideHeroText ? -20 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="terminal-hero-text pointer-events-none absolute inset-0 flex items-center justify-start"
            style={{ opacity: hideHeroText ? 0 : 1 }}
          >
            <div className="terminal-bg-text w-full text-left font-orbitron font-bold uppercase leading-none text-[#d7ddd7]/28 drop-shadow-[0_0_50px_rgba(180,190,180,0.2)]">
                <span className="inline-block origin-left scale-x-[0.8] scale-y-[0.75] tracking-[0.16em]">
                  TECHNICAL
                </span>{" "}
                <span className="whitespace-nowrap">CLUB</span>
              </div>
            </motion.div>
          </>
        )}

        <div className="terminal-content-layer mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.7fr]">
          <div className="flex flex-col gap-8 lg:pr-24" style={{ opacity: heroOpacity }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: hideHeroText ? 0 : 1,
              y: hideHeroText ? -20 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="terminal-hero-title text-balance font-cinzel text-4xl text-[#dfe9d9] drop-shadow-[0_0_18px_rgba(170,220,170,0.35)] sm:text-6xl md:text-7xl"
          >
            <span className="glitch flicker-text" data-text={typed}>
              {typed}
            </span>
            <span className="ml-2 flicker-cursor text-neonGreen">▍</span>
          </motion.h1>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hideHeroText ? 0 : 1,
              y: hideHeroText ? -10 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-auto flex flex-wrap items-center gap-5"
          >
            <Button
              className="group overflow-hidden border-neonGreen/60 text-neonGreen shadow-[0_0_25px_rgba(79,224,204,0.45)] hover:scale-105 hover:text-white hover:shadow-[0_0_45px_rgba(79,224,204,0.85)]"
              onMouseMove={(event) => {
                const target = event.currentTarget
                const rect = target.getBoundingClientRect()
                const x = event.clientX - rect.left
                const y = event.clientY - rect.top
                target.style.setProperty("--ripple-x", `${x}px`)
                target.style.setProperty("--ripple-y", `${y}px`)
              }}
              onClick={() => {
                const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
                const target = document.getElementById("participate")
                if (!target || !scroller) return
                const targetCenter = target.offsetTop + target.offsetHeight / 2
                const scrollTop = targetCenter - scroller.clientHeight / 2
                scroller.scrollTo({ top: Math.max(scrollTop, 0), behavior: "smooth" })
              }}
            >
              <span>Join Now</span>
              <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100">
                <span className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-neonGreen/30 blur-3xl [left:var(--ripple-x)] [top:var(--ripple-y)]" />
              </span>
            </Button>
            </motion.div>
          </div>

          <div className="hidden lg:flex flex-col items-end justify-end gap-4 text-right">
            <div className="h-[70vh] w-full" />
          </div>
        </div>
      </animated.div>
    </>
  )
}
