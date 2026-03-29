"use client"

import { useEffect, useRef, useState } from "react"
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
  const { email, phone, year, branch, otp, username, password, status } = useSelector(
    (state: RootState) => state.form,
  )
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [step, setStep] = useState<"details" | "otp" | "credentials" | "done">(
    "details",
  )
  const [message, setMessage] = useState("")
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""

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

  const submitDetails = async () => {
    dispatch(setStatus("loading"))
    setMessage("")
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`${apiBase}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, year, branch }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send OTP.")
      dispatch(setStatus("success"))
      setStep("otp")
      setMessage("OTP sent to your email.")
    } catch (error: any) {
      dispatch(setStatus("error"))
      setMessage(error.name === "AbortError" ? "Request timed out." : error.message || "Something went wrong.")
    }
  }

  const submitOtp = async () => {
    dispatch(setStatus("loading"))
    setMessage("")
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`${apiBase}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Invalid OTP.")
      dispatch(setStatus("success"))
      setStep("credentials")
      setMessage("OTP verified. Create your account.")
    } catch (error: any) {
      dispatch(setStatus("error"))
      setMessage(error.name === "AbortError" ? "Request timed out." : error.message || "OTP verification failed.")
    }
  }

  const submitCredentials = async () => {
    dispatch(setStatus("loading"))
    setMessage("")
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Registration failed.")

      const loginController = new AbortController()
      const loginTimeout = setTimeout(() => loginController.abort(), 15000)
      const loginResponse = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
        signal: loginController.signal,
      })
      clearTimeout(loginTimeout)
      const loginData = await loginResponse.json()
      if (loginResponse.ok && loginData.token) {
        localStorage.setItem("cmd_token", loginData.token)
      }

      dispatch(setStatus("success"))
      setStep("done")
      setMessage("Registration complete. You are now logged in.")
      dispatch(resetForm())
    } catch (error: any) {
      dispatch(setStatus("error"))
      setMessage(error.name === "AbortError" ? "Request timed out." : error.message || "Registration failed.")
    }
  }

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
            if (step === "details") {
              submitDetails()
            } else if (step === "otp") {
              submitOtp()
            } else if (step === "credentials") {
              submitCredentials()
            }
          }}
          className="glass-panel mt-10 max-w-3xl space-y-6 rounded-3xl p-8"
        >
          {step === "details" && (
            <>
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
            </>
          )}

          {step === "otp" && (
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(event) =>
                  dispatch(updateField({ field: "otp", value: event.target.value }))
                }
                required
              />
            </div>
          )}

          {step === "credentials" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Create Username</Label>
                <Input
                  id="username"
                  placeholder="cmd_user"
                  value={username}
                  onChange={(event) =>
                    dispatch(updateField({ field: "username", value: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) =>
                    dispatch(updateField({ field: "password", value: event.target.value }))
                  }
                  required
                />
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-sm text-white/70">
              Registration complete and session saved locally.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button ref={buttonRef} type="submit" className="min-w-[220px]">
              {status === "loading" && (
                <span className="absolute right-4 h-3 w-3 animate-ping rounded-sm bg-neonGreen/80" />
              )}
              {status === "loading"
                ? "Transmitting..."
                : step === "details"
                  ? "Send OTP"
                  : step === "otp"
                    ? "Verify OTP"
                    : step === "credentials"
                      ? "Create Account"
                      : "Done"}
            </Button>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
              {status === "loading" && "Encrypting submission..."}
              {status === "error" && message}
              {status === "success" && message}
              {status === "idle" && (message || "Secure, encrypted channel.")}
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
