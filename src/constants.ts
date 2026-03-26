// Beple Wallet - App Constants
// Extracted from spec v1.02 Common Rules

// ATM
export const ATM_FEE = 1300                 // ATM withdrawal fee per transaction (KRW)
export const ATM_DAILY_LIMIT = 300000       // ATM daily withdrawal limit (KRW)
export const ATM_MIN_AMOUNT = 10000         // ATM minimum withdrawal (KRW)
export const ATM_UNIT = 10000               // ATM withdrawal unit (KRW)

// Charging
export const CHARGE_MIN = 10000             // Minimum charge amount (KRW)
export const CHARGE_MAX_DOMESTIC = 2000000  // Max charge for domestic users (KRW)
export const CHARGE_MAX_FOREIGNER = 1000000 // Max charge for foreigner users (KRW)
export const COIN_CHARGE_FEE_RATE = 0.01   // Coin charging fee rate (1%)

// Security
export const PIN_LENGTH = 6                 // PIN digit count
export const PIN_MAX_ATTEMPTS = 5           // Max failed PIN attempts before lockout
export const PIN_LOCKOUT_MS = 300000        // PIN lockout duration (5 minutes)
export const SESSION_TIMEOUT_MS = 600000    // Session inactivity timeout (10 minutes)

// Initial balance
export const INITIAL_BALANCE = 150000       // Default starting balance (KRW)

// Exchange rates (mock - production uses live API)
export const MOCK_RATES: Record<string, number> = {
  BTC: 106514000,
  ETH: 3233000,
  USDC: 1493,
  USDT: 1493,
  XRP: 2109,
  SOL: 137200,
}
