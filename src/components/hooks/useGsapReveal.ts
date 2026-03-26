"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useGsapReveal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const scroller = document.querySelector(".scroll-stage") as HTMLElement | null
    const ctx = gsap.context(() => {
      if (!scroller) return
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 60, z: -160, rotateX: 8 },
        {
          autoAlpha: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            scroller,
            start: "top 80%",
          },
        },
      )
    }, element)
    return () => ctx.revert()
  }, [ref])
}
