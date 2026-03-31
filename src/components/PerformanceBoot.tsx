"use client"

import { useEffect } from "react"

export default function PerformanceBoot() {
  useEffect(() => {
    document.body.classList.add("is-initial-load")
    let cleared = false
    const clear = () => {
      if (cleared) return
      cleared = true
      document.body.classList.remove("is-initial-load")
    }

    const idle: number =
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback(clear, { timeout: 2500 })
        : window.setTimeout(clear, 2000)

    return () => {
      clear()
      if ("cancelIdleCallback" in window) {
        ;(window as any).cancelIdleCallback(idle)
      } else {
        clearTimeout(idle)
      }
    }
  }, [])

  return null
}
