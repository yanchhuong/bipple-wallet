# Beple Wallet (비플월렛)

A hybrid wallet and exchange platform that unifies **fiat banking**, **local crypto exchanges**, and **global crypto networks** into one app — so both locals and foreigners can store, exchange, and spend money seamlessly.

---

## What Problem Does This Solve?

Today, managing money across banks, crypto exchanges, and international transfers requires multiple apps. Foreigners visiting Korea can't easily spend crypto at local stores. Locals juggle between banking apps and exchange platforms.

**Beple Wallet fixes this** by putting everything in one place:

```
┌─────────────────────────────────────────────────┐
│                  Beple Wallet                    │
│                                                  │
│   🌐 Global Crypto    🇰🇷 Local Exchange    🏦 Banks  │
│   (Triple-A)          (Korbit)           (Korean) │
│        │                   │                 │    │
│        └───────────┬───────┘─────────────────┘    │
│                    │                              │
│              [ Unified Wallet ]                   │
│              [ Pay / Withdraw / Send ]            │
└─────────────────────────────────────────────────┘
```

---

## How It Works (Simple Version)

### For Foreigners (No Korean bank needed)
1. Open app → Quick passport KYC
2. Send crypto (USDT/USDC) from any wallet
3. Crypto converts to KRW automatically
4. Pay at stores, withdraw cash at ATMs

### For Locals (Korean residents)
1. Open app → Phone OTP verification
2. Connect Korbit exchange (one-time OAuth via Korbit app)
3. Top up wallet from bank or sell crypto via Korbit API
4. Pay, transfer, withdraw — all in one app

---

## Three Layers Working Together

| Layer | Provider | What It Does |
|---|---|---|
| **Global Crypto** | Triple-A | Receives crypto from anywhere in the world (USDT, USDC) |
| **Local Exchange** | Korbit | Converts crypto ↔ KRW at real-time market rates via API |
| **Local Banking** | Korean Banks | Deposits, withdrawals, and direct payments to/from bank accounts |

**The magic:** These three layers connect through one wallet balance. Users don't need to think about which system they're using — it just works.

---

## User Types & Feature Access

| Feature | Domestic (내국인) | Foreigner (외국인) |
|---|---|---|
| **Charge: Bank Account** | ✅ | ❌ |
| **Charge: Korbit Exchange** | ✅ | ❌ |
| **Charge: Direct Transfer Crypto** | ✅ | ✅ |
| **QR Payment** | ✅ | ✅ |
| **ATM Withdrawal** | ✅ | ✅ |
| **Bank Account Management** | ✅ (Settings) | ❌ (hidden) |
| **Charge Limit** | 2,000,000 KRW | 1,000,000 KRW |
| **KYC Method** | Phone OTP + ARS real-name | Passport OCR + Face liveness |

**Key rule:** Foreigners (passport KYC) only see Direct Transfer Crypto. Bank and Korbit features are hidden — they require a Korean bank account.

---

## Onboarding Flow

```
Splash Screen
    │
    ├─→ "기존 사용자" (Existing) → Load demo data → Home
    │
    └─→ "새로운 사용자" (New) → Language Select
                                    │
                              ┌─────┴─────┐
                              │           │
                         Domestic    Foreigner
                              │           │
                    Phone OTP +      Passport KYC
                    ARS verify     (OCR + Face + HiKorea)
                              │           │
                         Bank Setup       │
                         or Korbit        │
                              │           │
                              └─────┬─────┘
                                    │
                              Terms → PIN → Home
```

---

## Korbit Integration (Domestic Only)

### First-Time Connection (OAuth via Korbit App)

Korbit app is needed **only once** for initial authentication. After that, everything works via API.

```
Beple Wallet                     Korbit App (simulated)
     │                                │
     │  "Connect to Korbit" →         │
     │                           ① 연동 Guide
     │                           ② 계좌 정보 확인
     │                           ③ 이용 동의 (3 terms)
     │                           ④ 인증 코드 확인 (6-digit)
     │                           ⑤ 비밀번호 + 2FA OTP
     │                           ⑥ 인증 완료 ✓
     │                                │
     │  ← Return to Beple             │
     │  "Korbit Connected!" ✓         │
     │                                │
     │  (subsequent charges use       │
     │   Korbit API only —            │
     │   no app needed)               │
```

### Korbit Charging Flow (API-based, after OAuth)
1. Select asset to sell (BTC, ETH, XRP — fetched via Korbit API)
2. Enter sell quantity
3. Confirm sale at market price
4. Processing timeline (sell → KRW transfer → wallet charge)
5. Balance updated

---

## Direct Transfer Crypto (All Users)

5-step flow for on-chain crypto deposits:

```
① Request receiving address (select coin + network)
② Open external crypto wallet app
③ Copy address & transfer (QR code + wallet address + 30-min timer)
④ Wait for deposit confirmation (blockchain confirmations)
⑤ Complete (balance updated)
```

**MetaMask-style simulation:** When user copies the deposit address, a simulated crypto wallet UI appears showing the transfer process (Send → To → Amount → Review → Confirmed).

Supported: USDT, USDC on ERC-20 / TRC-20 / Solana networks.

---

## State Management

### Session Isolation
- Uses **`sessionStorage`** (not `localStorage`) for Zustand persist
- Each browser tab = completely independent state
- New tab = fresh onboarding (blank state)
- Same tab refresh = state preserved
- Close tab = data wiped

### Key State
```
bippleMoney: number          // KRW wallet balance
korbitConnected: boolean     // Korbit OAuth completed
userType: 'domestic' | 'foreigner'
bankAccounts: BankAccount[]  // Linked Korean banks
transactions: Transaction[]  // Full transaction history
pin: string                  // 6-digit transaction PIN
```

---

## Security

| Feature | Detail |
|---|---|
| 6-digit PIN | Required for every payment and withdrawal |
| PIN Lockout | 5 wrong attempts → 5-minute lockout with countdown |
| Face ID | Optional biometric login (toggle in Settings) |
| KYC | Passport OCR + face liveness for foreigners; Phone OTP + ARS for locals |
| Auth Guard | Protected routes redirect to login if not authenticated |
| Session isolation | Each tab has independent state via sessionStorage |

---

## Common Rules

| Rule | Value |
|---|---|
| ATM fee | 1,300 KRW per transaction |
| ATM daily limit | 300,000 KRW |
| ATM unit | 10,000 KRW increments |
| Crypto charge fee | 1% |
| PIN digits | 6 |
| Domestic charge limit | 2,000,000 KRW |
| Foreigner charge limit | 1,000,000 KRW |

---

## Languages

| Language | Coverage |
|---|---|
| Korean (한국어) | Full (690+ keys) |
| English | Full |
| Chinese (中文) | Full |

---

## Responsive Design

| Screen | Behavior |
|---|---|
| Desktop (>500px) | iPhone mockup frame with notch + status bar |
| Mobile (≤500px) | Full screen, no frame, native feel |
| Dark mode | System / Light / Dark toggle in Settings |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling + dark mode |
| Zustand 5 | State management with sessionStorage persistence |
| React Router 7 | Client-side routing with auth guards |
| Lucide React | Icons |

---

## Backend Developer Guide

This section documents what a backend team needs to build to replace the current client-side simulation with real APIs.

### System Architecture (COOCON Model)

```
┌──────────────┐     ┌──────────────────────┐     ┌────────────┐
│  Beple Wallet │────▶│  COOCON / BizPlay     │────▶│  Triple-A   │
│  (Mobile App) │     │  (Server)             │     │ (Singapore) │
└──────────────┘     │                      │     └────────────┘
                     │  • KRW settlement     │
                     │  • Beple Money balance │     ┌────────────┐
                     │  • Service operation   │────▶│  Korbit     │
                     │                      │     │ (Korean VASP)│
                     └──────────────────────┘     └────────────┘
                              │
                     ┌────────┴────────┐
                     │  Korean Banks    │
                     │  (펌뱅킹/Open    │
                     │   Banking)       │
                     └─────────────────┘
```

| Entity | Role | Crypto Handling |
|---|---|---|
| **COOCON (쿠콘/비즈플레이)** | Server operator, KRW settlement, Beple Money balance | ❌ No crypto (KRW only) |
| **Triple-A** | Deposit address issuance, stablecoin receipt, USDT/USDC → KRW conversion | ✅ On-chain |
| **Korbit** | OAuth auth, API sell orders, KRW generation via 펌뱅킹 | ✅ Exchange |
| **Korean Banks** | 펌뱅킹 transfers, ARS verification, account linking | ❌ Fiat only |

---

### Case 1: Direct Transfer Crypto (Triple-A) — Detailed Flow

```
① App (User)              ② COOCON Server           ③ Triple-A             ④ Blockchain
│                         │                         │                      │
│ STEP 1: Balance screen  │                         │                      │
│ STEP 2: Select Triple-A │                         │                      │
│         + enter PIN     │                         │                      │
│ STEP 3: Select coin     │                         │                      │
│   (USDT/USDC)           │                         │                      │
│   + network (ERC20/     │                         │                      │
│     TRC20/Solana)       │                         │                      │
│                         │ STEP 4: Request address  │                      │
│                         │ ──────────────────────▶ │                      │
│                         │                         │ Generate address     │
│                         │ ◀────────────────────── │ + QR code            │
│ STEP 5: Show address    │                         │                      │
│   + QR to user          │                         │                      │
│                         │                         │                      │
│   User opens MetaMask ──┼─────────────────────────┼──────────────────▶  │
│   and sends stablecoin  │                         │                  On-chain
│                         │                         │                  transfer
│ STEP 6: Waiting screen  │                         │ ◀──────────────── │
│   [전송 대기 중]          │                         │ Deposit detected   │
│                         │ ◀── deposit status ──── │                      │
│ STEP 7: Progress update │                         │                      │
│                         │ ◀── KRW settlement ──── │ USDT/USDC → KRW     │
│                         │     (4-1. KRW 송금)      │ conversion           │
│ STEP 8: Complete        │                         │                      │
│   balance updated       │ Update Beple Money      │                      │
```

**Service Flow (서비스 플로우):**
1. **충전 요청** — User selects Triple-A → coin (USDT/USDC) + network (ERC20/TRC20)
2. **입금 주소 발급** — COOCON Server → Triple-A API → disposable address + QR issued
3. **디지털자산 송금** — User sends from MetaMask/exchange to the address (on-chain)
4. **환전 및 정산** — Triple-A detects deposit → converts USDT/USDC to KRW → settles to COOCON
5. **입금 확인 및 비플머니 충전** — COOCON receives KRW → updates Beple Money balance

---

### Case 2: Korbit Charging (Domestic Only) — Detailed Flow

```
① App (User)              ② COOCON Server           ③ Korbit App           ④ Korbit API
│                         │                         │                      │
│ STEP 1: Balance screen  │                         │                      │
│ STEP 2: Select Korbit   │                         │                      │
│         + enter PIN     │                         │                      │
│ STEP 3: Select asset    │                         │                      │
│  (USDT/USDC/BTC/ETH)   │                         │                      │
│                         │                         │                      │
│ STEP 4: [코빗 앱으로    │ ── login request ──────▶│                      │
│          이동] tap      │                         │ User authenticates   │
│                         │                         │ (login + 출금 동의)   │
│                         │ ◀── OAuth token ─────── │                      │
│                         │     (1st time only)     │ ─── OAuth token ───▶ │
│                         │                         │                      │
│ STEP 5: Enter amount    │                         │                      │
│  (fees + estimate)      │                         │                      │
│                         │ STEP 6: Sell order ─────┼──────────────────▶  │
│                         │  (coin, amount params)  │                  ① Receive order
│                         │                         │                  ② Market sell
│                         │                         │                  ③ KRW in account
│                         │                         │                      │
│ STEP 7: Progress        │ ◀── KRW settlement ────┼────── 펌뱅킹 ──────  │
│  (status update)        │    (Korbit → COOCON     │    (bank transfer)   │
│                         │     via 펌뱅킹)          │                      │
│ STEP 8: Complete        │                         │                      │
│  balance updated        │ Update Beple Money      │                      │
```

**Service Flow (서비스 플로우):**
1. **충전 요청** — User selects Korbit → asset (USDT/USDC/BTC) + amount
2. **코빗 계정 인증** — Deep link to Korbit app → login + withdrawal consent → OAuth token issued (first time only, skip after)
3. **시장가 매도 실행** — COOCON calls Korbit API → market sell → KRW generated in Korbit account
4. **펌뱅킹 이체** — Korbit transfers KRW to COOCON account via 펌뱅킹 (firm banking)
5. **입금 확인 및 비플머니 충전** — COOCON receives KRW → updates Beple Money balance

**Settlement structure:** Korbit API sell → Korbit KRW created → 펌뱅킹 transfer → COOCON receives → Beple Money updated

---

### API Endpoints

#### Auth & Phone Verification
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/otp/send` | Send OTP to phone number |
| POST | `/api/auth/otp/verify` | Verify OTP code |
| POST | `/api/auth/login` | Login with phone + PIN |
| POST | `/api/auth/signup` | Register new user (phone, name, residenceId) |
| POST | `/api/auth/pin/set` | Set/reset 6-digit PIN |
| POST | `/api/auth/pin/verify` | Verify PIN for transactions |
| GET | `/api/auth/session` | Get current session info |

#### KYC (Passport — Foreigner Only)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/kyc/passport/ocr` | Upload passport image → OCR extract data |
| POST | `/api/kyc/passport/confirm` | Confirm/edit extracted passport data |
| POST | `/api/kyc/face/verify` | Upload face image → liveness + matching |
| POST | `/api/kyc/hikorea/check` | Verify residence status via HiKorea |
| GET | `/api/kyc/status` | Get KYC verification status |

#### Wallet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet/balance` | Get Beple Money balance |
| GET | `/api/wallet/transactions` | List transactions (filters: type, period, status) |
| GET | `/api/wallet/transactions/:id` | Get transaction detail / receipt |

#### Direct Transfer Crypto (Triple-A Integration)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/charge/crypto/address` | Request deposit address (coin + network) → calls Triple-A API |
| GET | `/api/charge/crypto/status/:id` | Check deposit status + confirmations |
| POST | `/api/charge/crypto/confirm` | Confirm charge after Triple-A KRW settlement |
| Webhook | `/webhook/triplea/deposit` | Triple-A notifies deposit detected |
| Webhook | `/webhook/triplea/settlement` | Triple-A notifies KRW settlement complete |

#### Korbit (Domestic Charging)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/korbit/auth/init` | Start Korbit OAuth (generate deep link) |
| POST | `/api/korbit/auth/callback` | Receive OAuth token from Korbit app |
| GET | `/api/korbit/connected` | Check if Korbit is connected |
| GET | `/api/korbit/assets` | Fetch user's Korbit holdings via API |
| POST | `/api/korbit/sell` | Place market sell order via Korbit API |
| GET | `/api/korbit/sell/:id/status` | Check sell order + 펌뱅킹 transfer status |
| Webhook | `/webhook/korbit/settlement` | Korbit notifies 펌뱅킹 KRW transfer complete |

#### Bank Account (Domestic Only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bank/accounts` | List linked bank accounts |
| POST | `/api/bank/register` | Start bank registration (bank, account#, holder) |
| POST | `/api/bank/ars/request` | Request ARS phone verification |
| POST | `/api/bank/ars/verify` | Verify ARS code |
| DELETE | `/api/bank/accounts/:id` | Remove linked bank account |
| PATCH | `/api/bank/accounts/:id/default` | Set as default account |
| POST | `/api/bank/charge` | Charge from bank account (Open Banking transfer) |

#### Payment & ATM
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/qr/decode` | Decode merchant QR → return merchant + amount |
| POST | `/api/payment/confirm` | Confirm payment (deduct balance) |
| GET | `/api/payment/receipt/:id` | Get payment receipt |
| POST | `/api/atm/qr/decode` | Decode ATM QR code |
| POST | `/api/atm/withdraw` | Process ATM withdrawal (amount + 1,300 fee) |
| GET | `/api/atm/daily-limit` | Check remaining daily ATM limit |

---

### External Integration Details

#### Triple-A API (Direct Transfer Crypto)
- **Provider:** Triple-A Pte. Ltd. (Singapore)
- **Role:** Deposit address issuance, stablecoin receipt, USDT/USDC → KRW conversion & settlement
- **Integration:** REST API + Webhooks for deposit/settlement notifications
- **Supported coins:** USDT, USDC
- **Supported networks:** ERC-20, TRC-20, Solana
- **Address validity:** 30 minutes (disposable)

#### Korbit API (Domestic Exchange)
- **Provider:** Korea Bitcoin Exchange Co., Ltd.
- **Base URL:** `https://api.korbit.co.kr`
- **Auth:** API Key + HMAC-SHA256 signature (OAuth token from first-time app auth)
- **Key endpoints:** `/v2/tickers`, `/v2/balance`, `/v2/orders`, `/v2/krw/withdraw`
- **Rate limits:** 50 req/s public, 30 req/s orders
- **Settlement:** 펌뱅킹 (firm banking) transfer to COOCON account
- **First-time:** Korbit app OAuth required; subsequent = API-only

#### Korean Banks (Open Banking)
- **Used for:** Account linking, ARS verification, direct bank charging
- **ARS:** Phone-based real-name verification (2-digit code)
- **펌뱅킹:** Firm banking for Korbit → COOCON KRW transfers

#### HiKorea (Government)
- **Used for:** Foreigner residence status verification during passport KYC
- **Checks:** Registration status, stay period, entry status

---

### State Machines

```
Phone OTP:     idle → sent → verified | expired
KYC (Passport): pending → ocr_scanning → data_confirmed → face_verified → hikorea_checked → completed | failed
Korbit OAuth:  disconnected → app_launched → authenticated → token_stored → connected
Korbit Sell:   order_placed → filled → krw_in_korbit → 펌뱅킹_transfer → coocon_received → wallet_charged
Triple-A:      address_generated → waiting_deposit → deposit_detected → confirming → settled → wallet_charged
Bank Charge:   initiated → ars_verified → transfer_requested → completed | failed
Payment:       qr_scanned → pin_verified → confirmed → settled
ATM:           qr_scanned → amount_set → pin_verified → dispensing → completed
```

---

### Database Entities

| Entity | Key Fields |
|---|---|
| **User** | id, phone, name, residenceId, userType (domestic/foreigner), kycStatus, pinHash, carrier |
| **Wallet** | userId, balance (KRW), currency, updatedAt |
| **BankAccount** | userId, bankName, accountNumber, holderName, isDefault, arsVerified |
| **KorbitConnection** | userId, oauthToken, tokenExpiry, connectedAt, lastUsedAt |
| **Transaction** | id, userId, type (charge/payment/atm/fee), amount, balance, status, method, createdAt |
| **KYCRecord** | userId, passportNo, nationality, surname, givenName, birthDate, faceScore, hikoreaStatus |
| **CryptoDeposit** | id, userId, coin, network, depositAddress, amount, confirmations, tripleaRef, status |
| **KorbitSellOrder** | id, userId, asset, quantity, rate, krwAmount, korbitOrderId, settlementStatus |
| **PaymentRecord** | id, txId, merchantId, merchantName, qrData, approvalNo |
| **ATMWithdrawal** | id, txId, atmId, amount, fee (1300), dailyTotal |

---

### Key Business Rules
1. **Foreigner (passport KYC)** → ONLY Direct Transfer Crypto. Reject Bank/Korbit API calls
2. **Domestic (phone OTP)** → Bank Account + Korbit + Direct Transfer Crypto all available
3. **Korbit OAuth** is one-time — store token, never require app again
4. **COOCON does NOT hold crypto** — only processes KRW settlement
5. **Triple-A handles all crypto** — address generation, on-chain receipt, conversion
6. **ATM fee** (1,300 KRW) logged as separate transaction record
7. **PIN** hashed server-side (bcrypt), never stored in plaintext
8. **Transaction IDs** globally unique (UUID v4) with idempotency keys
9. **Session** — JWT with short expiry + refresh tokens
10. **펌뱅킹** — Korbit → COOCON KRW transfer via firm banking, not user-initiated

---

## Future Potential

- **Merchant dashboard** — Store owners manage payments
- **Cross-border remittance** — Send money internationally
- **Multi-currency wallet** — USD, KHR, JPY alongside KRW
- **AI exchange optimization** — Best rate recommendations
- **Rewards & points** — Cashback on transactions
- **Offline payments** — NFC / contactless support
- **ATM map** — Nearby NICE ATM locations

---

## Design Specification

Based on **비플월렛 UX/UI 상세 설계서 v1.02** covering:
- Target & policy principles for domestic + foreign users
- 71-slide wireframe with all screens
- State & error message catalog
- KYC failure definitions (OCR, face, stay permit)
- Account & coin registration flows

---

*This is a confirmed UI prototype. All data is client-side (sessionStorage). Backend implementation should follow the API and entity specs above.*
