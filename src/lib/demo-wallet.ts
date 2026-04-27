/**
 * Demo wallet helper.
 *
 * Lets users register and transact against the local Hardhat chain WITHOUT
 * the MetaMask browser extension. We sign with one of Hardhat's well-known
 * test accounts (Account #1 for patient, #2 for doctor — Account #0 is the
 * deployer of HealthToken/MedicalContract and must not be re-used).
 *
 * Local-dev only. The values here are publicly documented Hardhat keys —
 * they don't unlock anything outside your `npx hardhat node`.
 */

export type DemoRole = "patient" | "doctor"

export const DEMO_STORAGE_KEY = "veil_demo_wallet"

// Fallbacks if the env vars aren't set. These match the hardcoded defaults
// in veil-web/.env. See https://hardhat.org/hardhat-network/docs/reference#accounts
const FALLBACK = {
  rpcUrl: "http://localhost:8545",
  patient: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey:
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  doctor: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey:
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
} as const

export function getDemoConfig(role: DemoRole) {
  const rpcUrl =
    process.env.NEXT_PUBLIC_DEMO_RPC_URL || FALLBACK.rpcUrl
  if (role === "patient") {
    return {
      rpcUrl,
      address:
        process.env.NEXT_PUBLIC_DEMO_PATIENT_ADDRESS ||
        FALLBACK.patient.address,
      privateKey:
        process.env.NEXT_PUBLIC_DEMO_PATIENT_PRIVATE_KEY ||
        FALLBACK.patient.privateKey,
    }
  }
  return {
    rpcUrl,
    address:
      process.env.NEXT_PUBLIC_DEMO_DOCTOR_ADDRESS || FALLBACK.doctor.address,
    privateKey:
      process.env.NEXT_PUBLIC_DEMO_DOCTOR_PRIVATE_KEY ||
      FALLBACK.doctor.privateKey,
  }
}

/** Returns the active demo role from localStorage, or null if disabled. */
export function getActiveDemoRole(): DemoRole | null {
  if (typeof window === "undefined") return null
  const v = window.localStorage.getItem(DEMO_STORAGE_KEY)
  return v === "patient" || v === "doctor" ? v : null
}

export function setActiveDemoRole(role: DemoRole) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DEMO_STORAGE_KEY, role)
}

export function clearActiveDemoRole() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(DEMO_STORAGE_KEY)
}
