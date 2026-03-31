"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function AdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [participants, setParticipants] = useState<
    {
      id: string
      name: string
      email: string
      phone: string
      statementId: number | null
      sScore: number | null
      pScore: number | null
      dScore: number | null
      reviewStatus: string
    }[]
  >([])
  const [scores, setScores] = useState<Record<string, { s: string; p: string; d: string }>>({})
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  useEffect(() => {
    const token = localStorage.getItem("cmd_admin_token")
    if (!token) {
      router.replace("/admin/login")
      return
    }
    setReady(true)
  }, [router])

  useEffect(() => {
    if (!ready) return
    const token = localStorage.getItem("cmd_admin_token")
    if (!token) return
    const load = async () => {
      const response = await fetch(`${apiBase}/admin/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) return
      setParticipants(data.participants || [])
      const initialScores: Record<string, { s: string; p: string; d: string }> = {}
      for (const participant of data.participants || []) {
        initialScores[participant.id] = {
          s: participant.sScore?.toString() || "",
          p: participant.pScore?.toString() || "",
          d: participant.dScore?.toString() || "",
        }
      }
      setScores(initialScores)
    }
    load()
  }, [apiBase, ready])

  const updateScore = (id: string, field: "s" | "p" | "d", value: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: {
        s: prev[id]?.s || "",
        p: prev[id]?.p || "",
        d: prev[id]?.d || "",
        [field]: value,
      },
    }))
  }

  const submitReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    const token = localStorage.getItem("cmd_admin_token")
    if (!token) return
    const current = scores[id] || { s: "", p: "", d: "" }
    const toNumber = (value: string) => (value === "" ? null : Number(value))
    const payload = {
      sScore: toNumber(current.s),
      pScore: toNumber(current.p),
      dScore: toNumber(current.d),
      reviewStatus: status,
    }
    const response = await fetch(`${apiBase}/admin/participants/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id ? { ...participant, reviewStatus: status } : participant,
      ),
    )
  }

  const rows = useMemo(
    () =>
      participants.map((participant) => ({
        ...participant,
        scores: scores[participant.id] || { s: "", p: "", d: "" },
      })),
    [participants, scores],
  )

  if (!ready) return null

  return (
    <main className="hero-bg relative min-h-screen px-6 py-20 text-white/80">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,229,255,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,0,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl space-y-6">
        <div className="terminal-title font-orbitron text-3xl text-neonGreen">
          Cmd Admin
        </div>
        <div className="glass-panel rounded-xl border border-neonGreen/40 bg-[#050805] p-8 shadow-[0_0_35px_rgba(0,255,0,0.2)]">
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">
            Admin Console
          </div>
          <div className="mt-6 overflow-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-y-3 text-sm text-white/80">
              <thead className="text-left text-xs uppercase tracking-[0.25em] text-white/50">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Sealed</th>
                  <th className="py-2 pr-4">S</th>
                  <th className="py-2 pr-4">P</th>
                  <th className="py-2 pr-4">D</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((participant) => (
                  <tr key={participant.id} className="bg-black/40">
                    <td className="rounded-l-md px-3 py-3">{participant.name}</td>
                    <td className="px-3 py-3">{participant.email}</td>
                    <td className="px-3 py-3">{participant.phone}</td>
                    <td className="px-3 py-3">
                      {participant.statementId ? `#${participant.statementId}` : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={participant.scores.s}
                        onChange={(event) =>
                          updateScore(participant.id, "s", event.target.value)
                        }
                        className="h-9 w-16 bg-black/60"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={participant.scores.p}
                        onChange={(event) =>
                          updateScore(participant.id, "p", event.target.value)
                        }
                        className="h-9 w-16 bg-black/60"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={participant.scores.d}
                        onChange={(event) =>
                          updateScore(participant.id, "d", event.target.value)
                        }
                        className="h-9 w-16 bg-black/60"
                      />
                    </td>
                    <td className="px-3 py-3 text-xs">{participant.reviewStatus}</td>
                    <td className="rounded-r-md px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          className="px-4 py-2"
                          onClick={() => submitReview(participant.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-4 py-2"
                          onClick={() => submitReview(participant.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-white/50">
                      No participants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
