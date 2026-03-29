import "dotenv/config"
import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT || 8080
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10)
const OTP_COOLDOWN_SECONDS = Number(process.env.OTP_COOLDOWN_SECONDS || 60)
const JWT_SECRET = process.env.JWT_SECRET || "change-me"

app.set("trust proxy", 1)
app.use(express.json())

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["*"]

const corsOptions = {
  origin: corsOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const requestOtpSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6),
  year: z.enum(["FE", "SE", "TE", "BE"]),
  branch: z.enum(["AI&DS", "AIML", "IOT", "COMP", "MECH"]),
})

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(8),
})

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24),
  password: z.string().min(6).max(128),
})

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6).max(128),
})

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function nowPlusMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000)
}

async function sendMail({ to, subject, text }) {
  if (!process.env.SMTP_HOST) {
    throw new Error("SMTP not configured")
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  })
}

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.post("/auth/request-otp", async (req, res) => {
  try {
    const data = requestOtpSchema.parse(req.body)
    const recent = await prisma.otpToken.findFirst({
      where: {
        email: data.email,
        createdAt: {
          gt: new Date(Date.now() - OTP_COOLDOWN_SECONDS * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
    })
    if (recent) {
      return res.status(429).json({ ok: false, message: "Please wait before requesting again." })
    }

    const otp = generateOtp()
    const otpHash = await bcrypt.hash(otp, 10)
    await prisma.otpToken.create({
      data: {
        email: data.email,
        otpHash,
        phone: data.phone,
        year: data.year,
        branch: data.branch,
        expiresAt: nowPlusMinutes(OTP_TTL_MINUTES),
      },
    })

    await sendMail({
      to: data.email,
      subject: "Your Code Medium OTP",
      text: `Your OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`,
    })

    return res.json({ ok: true })
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }
})

app.post("/auth/verify-otp", async (req, res) => {
  try {
    const data = verifyOtpSchema.parse(req.body)
    const record = await prisma.otpToken.findFirst({
      where: {
        email: data.email,
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!record) {
      return res.status(400).json({ ok: false, message: "OTP not found." })
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ ok: false, message: "OTP expired." })
    }

    const valid = await bcrypt.compare(data.otp, record.otpHash)
    if (!valid) {
      return res.status(400).json({ ok: false, message: "Invalid OTP." })
    }

    await prisma.otpToken.update({
      where: { id: record.id },
      data: { verifiedAt: new Date() },
    })

    return res.json({ ok: true })
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }
})

app.post("/auth/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        email: data.email,
        verifiedAt: { not: null },
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!otpRecord) {
      return res.status(400).json({ ok: false, message: "Verify OTP first." })
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ ok: false, message: "OTP expired." })
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    })
    if (existing) {
      return res.status(400).json({ ok: false, message: "User already exists." })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)
    await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        phone: otpRecord.phone,
        year: otpRecord.year,
        branch: otpRecord.branch,
      },
    })

    await prisma.otpToken.update({
      where: { id: otpRecord.id },
      data: { consumedAt: new Date() },
    })

    await sendMail({
      to: data.email,
      subject: "Registration Confirmed",
      text: "Your registration for Code Medium is confirmed. Welcome aboard!",
    })

    return res.json({ ok: true })
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.identifier }, { username: data.identifier }],
      },
    })
    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid credentials." })
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) {
      return res.status(400).json({ ok: false, message: "Invalid credentials." })
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    })

    return res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, username: user.username },
    })
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on :${PORT}`)
})
