"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

export default function CameraController() {
  const { camera } = useThree()
  const progress = useRef({ value: 0 })
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#hero-3d",
      start: "top top",
      end: "bottom+=1200 top",
      scrub: true,
      onUpdate: (self) => {
        progress.current.value = self.progress
      },
    })
    return () => trigger.kill()
  }, [])

  useFrame(({ mouse }) => {
    const zoom = THREE.MathUtils.lerp(8, 4.2, progress.current.value)
    const x = mouse.x * 0.6
    const y = mouse.y * 0.4
    camera.position.lerp(new THREE.Vector3(x, y, zoom), 0.08)
    target.current.lerp(new THREE.Vector3(0, 0.2, 0), 0.08)
    camera.lookAt(target.current)
  })

  return null
}
