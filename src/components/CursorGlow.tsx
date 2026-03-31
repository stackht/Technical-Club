"use client"

import { useEffect, useRef } from "react"

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover)").matches) return

    let raf = 0
    let latestX = 0
    let latestY = 0
    const apply = () => {
      glow.style.transform = `translate(${latestX}px, ${latestY}px) translate(-50%, -50%)`
      raf = 0
    }

    const handleMove = (event: MouseEvent) => {
      latestX = event.clientX
      latestY = event.clientY
      if (raf) return
      raf = requestAnimationFrame(apply)
    }

    window.addEventListener("mousemove", handleMove)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}
