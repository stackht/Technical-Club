"use client"

import { useEffect } from "react"

export default function ConsoleSilencer() {
  useEffect(() => {
    const originalWarn = console.warn
    console.warn = (...args: unknown[]) => {
      const first = args[0]
      if (typeof first === "string" && first.includes("THREE.Clock")) {
        return
      }
      originalWarn(...args)
    }
    return () => {
      console.warn = originalWarn
    }
  }, [])

  return null
}
