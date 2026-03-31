"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    setMessage("")
    try {
      const response = await fetch(`${apiBase}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Login failed.")
      localStorage.setItem("cmd_admin_token", data.token)
      router.push("/admin")
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Login failed.")
    }
  }

  return (
    <main className="hero-bg relative min-h-screen px-6 py-20 text-white/80">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,229,255,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,0,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex w-full flex-wrap items-center justify-center gap-4 text-center">
          <div className="terminal-title terminal-title-plain w-full min-w-0 truncate whitespace-nowrap font-orbitron text-3xl text-neonGreen">
            Admin Login
          </div>
          <Button type="button" variant="ghost" onClick={() => router.push("/")}>
            Back
          </Button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="glass-panel mt-10 space-y-6 rounded-xl border border-neonGreen/40 bg-[#050805] p-8 shadow-[0_0_35px_rgba(0,255,0,0.2)]"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" className="min-w-[160px]">
              {status === "loading" ? "Authenticating..." : "Enter"}
            </Button>
            {status === "error" && (
              <div className="text-xs uppercase tracking-[0.2em] text-red-400">
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
