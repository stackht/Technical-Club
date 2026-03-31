"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"

export default function ParticipantProfilePage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<{
    name: string
    email: string
    username: string
    phone: string
    year: string
    branch: string
  } | null>(null)
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  useEffect(() => {
    const token = localStorage.getItem("cmd_token")
    if (!token) {
      router.replace("/")
      return
    }
    setReady(true)
  }, [router])

  useEffect(() => {
    if (!ready) return
    const token = localStorage.getItem("cmd_token")
    if (!token) return
    const load = async () => {
      const response = await fetch(`${apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        setProfile(data.user)
      }
    }
    load()
  }, [apiBase, ready])

  if (!ready) return null

  return (
    <main className="hero-bg relative min-h-screen px-6 py-20 text-white/80">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,229,255,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,0,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="terminal-title font-orbitron text-3xl text-neonGreen">
            Cmd Profile Shell
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => router.push("/participant")}>
              Back
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("cmd_token")
                router.replace("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="glass-panel rounded-xl border border-neonGreen/40 bg-[#050805] p-8 shadow-[0_0_35px_rgba(0,255,0,0.2)]">
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">
            Participant Profile
          </div>
          <div className="mt-6 grid gap-4 text-sm text-white/80">
            <div>
              <span className="text-neonGreen/70">Name:</span>{" "}
              {profile?.name || "—"}
            </div>
            <div>
              <span className="text-neonGreen/70">Email:</span>{" "}
              {profile?.email || "—"}
            </div>
            <div>
              <span className="text-neonGreen/70">Username:</span>{" "}
              {profile?.username || "—"}
            </div>
            <div>
              <span className="text-neonGreen/70">Phone:</span>{" "}
              {profile?.phone || "—"}
            </div>
            <div>
              <span className="text-neonGreen/70">Year:</span>{" "}
              {profile?.year || "—"}
            </div>
            <div>
              <span className="text-neonGreen/70">Branch:</span>{" "}
              {profile?.branch || "—"}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
