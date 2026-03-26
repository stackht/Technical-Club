"use client"

import { useMemo, useRef } from "react"
import { RigidBody, BallCollider } from "@react-three/rapier"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const colors = ["#00f0ff", "#39ff14", "#0b1c22"]

function FloatingItem({ position }: { position: [number, number, number] }) {
  const body = useRef<any>(null)
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [])

  useFrame(() => {
    if (!body.current) return
    body.current.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
      true,
    )
  })

  return (
    <RigidBody
      ref={body}
      position={position}
      linearDamping={2}
      angularDamping={3}
      colliders={false}
    >
      <BallCollider args={[0.6]} />
      <mesh castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </RigidBody>
  )
}

function MouseField() {
  const body = useRef<any>(null)
  const { camera, mouse } = useThree()

  useFrame(() => {
    if (!body.current) return
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
    vector.unproject(camera)
    const dir = vector.sub(camera.position).normalize()
    const distance = (camera.position.z - 0) / dir.z
    const pos = camera.position.clone().add(dir.multiplyScalar(distance))
    body.current.setNextKinematicTranslation({
      x: pos.x,
      y: pos.y,
      z: pos.z,
    })
  })

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false}>
      <BallCollider args={[1.4]} />
    </RigidBody>
  )
}

export default function FloatingObjects() {
  const positions = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.2) * 5,
        (Math.random() - 0.5) * 6,
      ]) as [number, number, number][],
    [],
  )

  return (
    <group>
      <MouseField />
      {positions.map((pos, index) => (
        <FloatingItem key={`float-${index}`} position={pos} />
      ))}
    </group>
  )
}
