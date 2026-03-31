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
    <main className="hero-bg relative h-screen overflow-y-auto px-4 py-0 text-white/80 sm:px-6">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,229,255,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,0,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl space-y-6">
        <div className="sticky top-0 z-30 w-full overflow-x-hidden bg-[#050805]/95 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 px-4 text-center sm:px-6">
            <div className="terminal-title min-w-0 truncate whitespace-nowrap font-orbitron text-xl text-neonGreen sm:text-2xl md:text-3xl">
              Cmd Profile Shell
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Button type="button" variant="ghost" onClick={() => router.push("/participant")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  localStorage.removeItem("cmd_token")
                  router.replace("/")
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="glass-panel mt-6 rounded-xl border border-neonGreen/40 bg-[#050805] p-5 shadow-[0_0_35px_rgba(0,255,0,0.2)] sm:p-8">
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">
            Participant Profile
          </div>
          <div className="mt-6 grid gap-4 text-sm text-white/80 sm:grid-cols-2">
            {[
              { label: "Name", value: profile?.name || "—" },
              { label: "Email", value: profile?.email || "—" },
              { label: "Username", value: profile?.username || "—" },
              { label: "Phone", value: profile?.phone || "—" },
              { label: "Year", value: profile?.year || "—" },
              { label: "Branch", value: profile?.branch || "—" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-black/50 p-4"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-neonGreen/70">
                  {item.label}
                </div>
                <div className="mt-2 text-sm text-white/80">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
