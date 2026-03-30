"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"

const challenges = [
  "Unused Mobile Data — Design a system where users can save, transfer, or monetize unused data efficiently.",
  "Mumbai Local Ticket Verification — Design a frictionless ticket verification system that reduces time while preventing fraud.",
  "Fast Language Learning — Design a solution that drastically reduces learning time while maximizing practical fluency.",
  "Bank SMS Charges Problem — Reduce or replace SMS alerts while maintaining security and regulatory compliance.",
  "Future of Developers vs AI — How can a human developer stay relevant or outperform AI?",
  "AI for College Admin — Reduce workload for attendance, assignments, grading, communication, and administration.",
  "Smart Wearable for Color Vision Deficiency — Detect and communicate colors in real-time with fast, accurate feedback.",
  "OTP Fraud Prevention — Prevent or reduce OTP sharing fraud with a simple, secure user experience.",
]

export default function ChallengesPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  useEffect(() => {
    const token = localStorage.getItem("cmd_token")
    if (!token) {
      router.replace("/")
    }
  }, [router])

  const submitChallenge = async (statementId: number, statement: string) => {
    const token = localStorage.getItem("cmd_token")
    if (!token) return
    setSubmitting(true)
    setMessage("")
    try {
      const response = await fetch(`${apiBase}/challenges/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statementId, statement }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Submit failed.")
      setMessage("Sealed. Your challenge has been recorded.")
      setTimeout(() => router.push("/"), 1200)
    } catch (error: any) {
      setMessage(error.message || "Submit failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="hero-bg h-screen overflow-y-auto px-6 py-20 text-white/80">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="terminal-title font-orbitron text-3xl text-neonGreen">
          Cmd Problem Shell
        </div>
        <div className="glass-panel rounded-xl border border-neonGreen/40 bg-[#050805] p-6 shadow-[0_0_35px_rgba(0,255,0,0.2)]">
          <div className="mb-4 text-xs uppercase tracking-[0.35em] text-white/70">
            Select and Seal One Problem
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((item, index) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-black/60 p-4 shadow-inner shadow-black/60"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-neonGreen/70">
                  Problem {index + 1}
                </div>
                <div className="mt-2 text-sm text-white/80">{item}</div>
                <div className="mt-4 flex justify-end">
                  <Button
                    className="min-w-[140px]"
                    onClick={() => submitChallenge(index + 1, item)}
                    disabled={submitting}
                  >
                    {submitting ? "Sealing..." : "Seal"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {message && (
            <div className="mt-4 text-xs uppercase tracking-[0.28em] text-neonGreen/80">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
