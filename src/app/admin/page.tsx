"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("cmd_admin_token")
    if (!token) {
      router.replace("/admin/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <main className="hero-bg min-h-screen px-6 py-20 text-white/80">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="terminal-title font-orbitron text-3xl text-neonGreen">
          Cmd Admin
        </div>
        <div className="glass-panel rounded-xl border border-neonGreen/40 bg-[#050805] p-8 shadow-[0_0_35px_rgba(0,255,0,0.2)]">
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">
            Admin Console
          </div>
          <div className="mt-4 text-sm text-white/80">
            Admin access granted. Hook this panel to challenges, users, and review tools.
          </div>
        </div>
      </div>
    </main>
  )
}
