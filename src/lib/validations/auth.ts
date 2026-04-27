import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email(),
  // Password is only required for the credentials login. Email-only
  // submissions (the legacy magic-link flow) are still allowed.
  password: z.string().min(1).optional(),
})
