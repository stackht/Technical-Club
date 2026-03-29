"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import gsap from "gsap"
import type { RootState, AppDispatch } from "../lib/store"
import { resetForm, setStatus, updateField } from "../lib/features/formSlice"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function FormSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { email, phone, year, branch, status } = useSelector(
    (state: RootState) => state.form,
  )
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (status === "success" && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { boxShadow: "0 0 0 rgba(57, 255, 20, 0)" },
        {
          boxShadow: "0 0 30px rgba(57, 255, 20, 0.9)",
          duration: 0.6,
          yoyo: true,
          repeat: 1,
        },
      )
    }
  }, [status])

  return (
    <section
      id="participate"
      className="terminal-section relative px-6 py-24 section-3d"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="terminal-title font-orbitron text-3xl text-neonGreen"
        >
          Participation Form
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={(event) => {
            event.preventDefault()
            if (status === "loading") return
            dispatch(setStatus("loading"))
            setTimeout(() => {
              dispatch(setStatus("success"))
              setTimeout(() => {
                dispatch(resetForm())
              }, 1500)
            }, 1400)
          }}
          className="glass-panel mt-10 max-w-3xl space-y-6 rounded-3xl p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="neo@branchbliss.dev"
                value={email}
                onChange={(event) =>
                  dispatch(updateField({ field: "email", value: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 90000 00000"
                value={phone}
                onChange={(event) =>
                  dispatch(updateField({ field: "phone", value: event.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <select
                id="year"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/80 shadow-inner shadow-black/60 outline-none transition focus:border-neonGreen/60 focus:ring-2 focus:ring-neonGreen/30"
                value={year}
                onChange={(event) =>
                  dispatch(updateField({ field: "year", value: event.target.value }))
                }
                required
              >
                <option value="" disabled>
                  Select year
                </option>
                <option value="FE">FE</option>
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <select
                id="branch"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/80 shadow-inner shadow-black/60 outline-none transition focus:border-neonGreen/60 focus:ring-2 focus:ring-neonGreen/30"
                value={branch}
                onChange={(event) =>
                  dispatch(updateField({ field: "branch", value: event.target.value }))
                }
                required
              >
                <option value="" disabled>
                  Select branch
                </option>
                <option value="AI&DS">AI&DS</option>
                <option value="AIML">AIML</option>
                <option value="IOT">IOT</option>
                <option value="COMP">COMP</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button ref={buttonRef} type="submit" className="min-w-[220px]">
              {status === "loading" && (
                <span className="absolute right-4 h-3 w-3 animate-ping rounded-sm bg-neonGreen/80" />
              )}
              {status === "loading"
                ? "Transmitting..."
                : status === "success"
                  ? "Access Granted"
                  : "Submit"}
            </Button>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
              {status === "loading" && "Encrypting submission..."}
              {status === "success" && "Signal received."}
              {status === "idle" && "Secure, encrypted channel."}
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
