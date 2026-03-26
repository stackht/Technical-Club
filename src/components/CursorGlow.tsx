"use client"

import { useEffect, useRef } from "react"

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const handleMove = (event: MouseEvent) => {
      glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}
