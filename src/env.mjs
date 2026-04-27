import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    // Demo / dev-only email-password login. When unset, the credentials
    // provider falls back to the hardcoded demo creds in src/lib/auth.ts.
    DEMO_EMAIL: z.string().email().optional(),
    DEMO_PASSWORD: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_TOKEN_ADDRESS: z.string().min(1),
    // Optional demo wallet config (only present in local dev). When unset,
    // the demo button still works using the hardcoded fallbacks defined in
    // src/lib/demo-wallet.ts.
    NEXT_PUBLIC_DEMO_RPC_URL: z.string().url().optional(),
    NEXT_PUBLIC_DEMO_PATIENT_ADDRESS: z.string().startsWith("0x").optional(),
    NEXT_PUBLIC_DEMO_PATIENT_PRIVATE_KEY: z
      .string()
      .startsWith("0x")
      .optional(),
    NEXT_PUBLIC_DEMO_DOCTOR_ADDRESS: z.string().startsWith("0x").optional(),
    NEXT_PUBLIC_DEMO_DOCTOR_PRIVATE_KEY: z
      .string()
      .startsWith("0x")
      .optional(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    DEMO_EMAIL: process.env.DEMO_EMAIL,
    DEMO_PASSWORD: process.env.DEMO_PASSWORD,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEMO_RPC_URL: process.env.NEXT_PUBLIC_DEMO_RPC_URL,
    NEXT_PUBLIC_DEMO_PATIENT_ADDRESS:
      process.env.NEXT_PUBLIC_DEMO_PATIENT_ADDRESS,
    NEXT_PUBLIC_DEMO_PATIENT_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_DEMO_PATIENT_PRIVATE_KEY,
    NEXT_PUBLIC_DEMO_DOCTOR_ADDRESS:
      process.env.NEXT_PUBLIC_DEMO_DOCTOR_ADDRESS,
    NEXT_PUBLIC_DEMO_DOCTOR_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_DEMO_DOCTOR_PRIVATE_KEY,
  },
})
