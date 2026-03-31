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

    const idle = "requestIdleCallback" in window
      ? (window as any).requestIdleCallback(clear, { timeout: 2500 })
      : window.setTimeout(clear, 2000)

    return () => {
      clear()
      if ("cancelIdleCallback" in window && typeof idle === "number") {
        ;(window as any).cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
    }
  }, [])

  return null
}
