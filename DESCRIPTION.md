# Beple Wallet (비플월렛)

A hybrid payment wallet platform for both **domestic Korean users** and **foreign tourists** visiting South Korea. Charge, pay, and withdraw KRW through cryptocurrency exchanges and stablecoin integrations.

---

## Overview

Beple Wallet bridges the gap between crypto assets and everyday KRW payments in South Korea. It provides a unified mobile interface where users can:

- **Charge** Bipple Money (KRW) from bank accounts, crypto exchanges (Korbit), or stablecoin platforms (Triple-A)
- **Pay** merchants via QR code scanning
- **Withdraw** cash from ATMs nationwide
- **Manage** multiple cryptocurrency assets (BTC, ETH, USDC, USDT, XRP, SOL)

---

## User Types

### Domestic Users (내국인)

| Feature | Detail |
|---|---|
| Target | Korean residents with Korbit exchange accounts |
| Charging | Bank account transfer / Korbit exchange (sell crypto → KRW) |
| Authentication | Real-name verification via ARS |
| Charge Limit | 2,000,000 KRW |
| KYC | Auto-verified through ARS real-name system |

### Foreign Users (외국인 / Tourist)

| Feature | Detail |
|---|---|
| Target | Tourists and stablecoin holders visiting Korea |
| Charging | Triple-A integration (USDT/USDC on-chain → KRW) |
| Authentication | Minimal-KYC (Passport OCR + Face recognition) |
| Charge Limit | 1,000,000 KRW |
| KYC | Passport scan + Liveness detection + HiKorea verification |

---

## Key Features

### Wallet & Payments
- **Bipple Money Balance** — KRW prepaid wallet for instant payments
- **QR Code Payment** — Scan merchant QR to pay at stores, cafes, restaurants
- **ATM Withdrawal** — Cash out at NICE ATMs (10,000 KRW units, 1,300 KRW fee)
- **Transaction History** — Full history with filters (period, type, status, payment method)
- **Digital Receipts** — Electronic receipts for tax deduction

### Charging Methods
- **Bank Account** — Direct transfer from linked Korean bank accounts
- **Korbit Exchange** — OAuth-connected crypto asset sell → KRW conversion
- **Triple-A Stablecoin** — On-chain USDT/USDC deposit → KRW conversion
- **Coin Conversion** — Convert held crypto assets to Bipple Money (1% fee)

### KYC & Identity
- **Passport OCR** — Automatic passport data extraction with MRZ reading
- **Face Recognition** — Liveness detection + face matching against passport photo
- **HiKorea Integration** — Residence status verification for foreigners
- **ARS Verification** — Phone-based real-name verification for domestic users

### Multi-Platform Exchange Support
- **Korbit** — Korea's first crypto exchange (218+ trading pairs)
- **Triple-A** — Global stablecoin payment infrastructure
- **Upbit / Binance** — Additional exchange integrations via API key

### Security
- **6-digit Transaction PIN** — Required for all payments and withdrawals
- **PIN Lockout** — 5 failed attempts → 5-minute lockout
- **Face ID / Biometric** — Optional biometric login
- **Auth Guard** — Protected routes require authentication
- **LocalStorage Persistence** — Session survives browser refresh

### Internationalization
- **Korean (한국어)** — Full native support
- **English** — Complete translation
- **Chinese (中文)** — Simplified Chinese support

---

## Common Rules (공통 숫자 정책)

| Rule | Value |
|---|---|
| ATM fee | 1,300 KRW per transaction |
| ATM daily limit | 300,000 KRW |
| ATM unit | 10,000 KRW increments |
| Coin conversion fee | 1% |
| PIN digits | 6 |
| Domestic charge limit | 2,000,000 KRW |
| Foreigner charge limit | 1,000,000 KRW |

---

## App Flow

```
Language Select → Login/SignUp → Terms → PIN Setup → User Type Select
                                                         │
                              ┌──────────────────────────┤
                              │                          │
                         Domestic                    Foreigner
                              │                          │
                       ARS Verification         KYC (Passport + Face)
                              │                          │
                              └──────────┬───────────────┘
                                         │
                                       Home
                                    ┌────┼────┐
                                    │    │    │
                                 Charge  Pay  ATM
                                    │    │    │
                                 Complete History Settings
```

---

## State & Error Messages

| Category | States |
|---|---|
| **Empty** | No coins registered, No notifications |
| **Error** | ATM limit exceeded, Coin balance insufficient, KYC OCR/Face/Stay failed, PIN locked |
| **Success** | Charge complete, Payment complete, ATM withdrawal complete |
| **System** | Loading/Processing spinner, Camera permission dialog, Exchange maintenance |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 8.x | Build tool |
| Tailwind CSS | 4.x | Styling |
| Zustand | 5.x | State management (with persist middleware) |
| React Router | 7.x | Client-side routing |
| Lucide React | 1.6 | Icon library |

---

## Design Specification

Based on **비플월렛 UX/UI 상세 설계서 v1.02** — 71-slide wireframe specification covering:
- Target & policy principles
- Full user flow wireframes
- State & error message catalog
- KYC failure state definitions
- Account/Coin registration process details

---

## License

This is a prototype/proof-of-concept application. All rights reserved.
