# Beple Wallet — Implementation Status vs Requirements

Cross-reference of 베플월렛 개발 메타 프롬프트 requirements against current prototype.

> Legend: ✅ Implemented | ⚠️ Partial | ❌ Not Yet | 🔲 Backend Only (N/A for UI prototype)

---

## A. Service Overview (서비스 개요)

| Requirement | Status | Detail |
|---|---|---|
| Service one-line definition | ✅ | DESCRIPTION.md |
| Value Proposition | ✅ | DESCRIPTION.md |
| Domestic user scenario | ✅ | UserTypeSelect → ARS → Home → Pay/ATM |
| Foreigner user scenario | ✅ | UserTypeSelect → KYC → Home → Pay/ATM |
| Player definitions (User, Merchant, Operator, KYC, Triple-A, Korbit, Banking, Settlement, CS) | ⚠️ | User/Korbit/Triple-A defined; Merchant/Settlement/CS/Admin not in UI |

---

## B. User Journey & UX Design (사용자 여정 및 UX 설계)

| Requirement | Status | Detail |
|---|---|---|
| End-to-End User Journey Map | ✅ | Language → Login → Terms → PIN → Type → KYC → Home |
| Domestic user flow | ✅ | Google/Apple login → ARS verify → Home |
| Foreigner user flow | ✅ | Login → Passport → Face → HiKorea → Home |
| Charge flow - Fiat | ✅ | ChargeBank.tsx (bank account transfer) |
| Charge flow - Triple-A stablecoin | ✅ | ChargeTripleA.tsx (USDT/USDC → KRW) |
| Charge flow - Korbit exchange | ✅ | ChargeKorbit.tsx (sell crypto → KRW) |
| Payment flow | ✅ | PaymentPin → PaymentScan → PaymentConfirm |
| Refund/Cancel flow | ❌ | No refund or cancellation mechanism |
| KYC fail / retry / re-review flow | ✅ | KycVerify failure states + retry buttons |
| Transaction fail / charge fail flows | ✅ | Toast errors, KYC failure screens, API key fail |
| Customer support / FAQ flow | ⚠️ | FAQ modal in KycPassport only; no full CS page |
| Transaction history view | ✅ | History.tsx with advanced filtering |

---

## C. Mobile App UI/UX Detailed Design (모바일 앱 UI/UX 상세 설계)

### Screen List (화면 목록)

| Screen | Status | File |
|---|---|---|
| Splash | ❌ | No splash screen |
| Onboarding | ❌ | No onboarding tutorial slides |
| Language Select | ✅ | LanguageSelect.tsx |
| Login | ✅ | Login.tsx (Google, Apple) |
| Sign Up | ✅ | SignUp.tsx (Email + Phone + PIN) |
| Terms & Conditions | ✅ | Terms.tsx |
| PIN Setup | ✅ | PinSetup.tsx |
| User Type Select | ✅ | UserTypeSelect.tsx |
| Domestic KYC (ARS) | ✅ | Auto-verified on type select |
| Foreigner Passport Scan | ✅ | KycPassport.tsx (SVG sample passport) |
| Foreigner Face Recognition | ✅ | KycFace.tsx (SVG face, oval guide, liveness) |
| Foreigner KYC Verify | ✅ | KycVerify.tsx (HiKorea check + cancel) |
| KYC Success | ✅ | KycSuccess.tsx |
| Home Dashboard | ✅ | Home.tsx (balance, coins, quick actions) |
| Balance / Asset Overview | ✅ | Home.tsx + CoinDetail.tsx |
| Charge Method Select | ✅ | ChargeHub.tsx |
| Fiat Charge | ✅ | ChargeBank.tsx |
| Stablecoin Charge (Triple-A) | ✅ | ChargeTripleA.tsx (4-step flow) |
| Korbit Connect | ✅ | ChargeKorbit.tsx (connect + sell) |
| Exchange Asset View | ✅ | ChargeKorbit.tsx (asset list + balance) |
| Sell Order Confirm | ✅ | ChargeKorbit.tsx (confirm step) |
| KRW Withdrawal Account | ⚠️ | Bank account managed in Settings, not in Korbit flow |
| Open Banking Charge Confirm | ⚠️ | Simulated — no real banking integration |
| QR Payment Screen | ✅ | PaymentScan.tsx |
| Payment Complete | ✅ | PaymentConfirm.tsx (done state) |
| ATM QR Scan | ✅ | AtmScan.tsx |
| ATM Amount Input | ✅ | AtmAmount.tsx |
| ATM Confirm + Done | ✅ | AtmConfirm.tsx (4 states) |
| Transaction History | ✅ | History.tsx (filters, grouped by date) |
| Receipt | ✅ | Receipt.tsx |
| Refund / Cancel | ❌ | Not implemented |
| Notifications | ✅ | Notifications.tsx |
| Settings | ✅ | Settings.tsx |
| Profile | ✅ | Profile.tsx (user type, KYC badges) |
| Bank Account Management | ✅ | SettingsAccount.tsx (8-bank, ARS flow) |
| Coin Management | ✅ | SettingsCoins.tsx (exchange + API key) |
| Terms View | ✅ | SettingsTerms.tsx |
| Customer Support | ❌ | No dedicated CS page |
| FAQ | ⚠️ | Only in KYC passport retry |
| Coin Detail | ✅ | CoinDetail.tsx |
| Charge Complete | ✅ | ChargeComplete.tsx |

### UI/UX Requirements

| Requirement | Status | Detail |
|---|---|---|
| IA (Information Architecture) | ✅ | 3-tab nav (Home/History/Settings) |
| Menu structure | ✅ | Tab-based with nested settings |
| Navigation design | ✅ | BottomNav + Header back buttons |
| Wireframes | ✅ | Full pixel-perfect implementation |
| UX writing (Korean) | ✅ | 600+ i18n keys |
| Accessibility | ⚠️ | Touch targets OK; no screen reader support |
| Multi-language | ✅ | KO, EN, ZH |
| Input error prevention | ✅ | Validation on all forms |
| Foreigner-friendly UI | ✅ | English/Chinese translations, passport-based KYC |

---

## D. Server & Backend Function Design (서버 및 백엔드 기능 설계)

> This is a **frontend prototype** — no real backend exists. All marked 🔲 are backend-only.

| Domain | Status | Detail |
|---|---|---|
| Auth / Session | ⚠️ | Login state persisted; no real auth tokens |
| KYC / AML | 🔲 | Simulated in UI only |
| Wallet / Balance | ✅ | Zustand store with persist |
| Charging | ✅ | All 4 methods simulated |
| Payment | ✅ | QR payment flow simulated |
| Transaction History | ✅ | Full CRUD in store |
| Korbit Integration | ⚠️ | UI flow complete; no real API calls |
| Triple-A Integration | ⚠️ | UI flow complete; no real API calls |
| Open Banking | ⚠️ | ARS flow simulated; no real banking |
| Settlement / Accounting | 🔲 | Not applicable for UI prototype |
| Risk / Fraud Detection | 🔲 | Not applicable for UI prototype |
| Notifications | ⚠️ | In-app list only; no push notifications |
| Admin Portal | ❌ | No admin interface |
| API Design | 🔲 | No backend APIs; all client-side state |
| Event-based Processing | 🔲 | N/A |
| Batch / Settlement | 🔲 | N/A |
| Webhook Processing | 🔲 | N/A |
| External Failure Retry | ⚠️ | KYC retry implemented; others simulated |

---

## E. System Architecture (시스템 아키텍처 설계)

| Requirement | Status | Detail |
|---|---|---|
| Overall architecture diagram | ❌ | No architecture documentation |
| MSA decision | 🔲 | Backend decision |
| Architecture patterns | ⚠️ | Client: Zustand + React Router |
| External integrations (Triple-A, Korbit, Banking, KYC) | ⚠️ | All simulated in UI |
| Data flow description | ⚠️ | Unidirectional: Action → Store → UI |
| Failure resilience | ⚠️ | LocalStorage persistence; no backend resilience |
| Logging / Monitoring / Audit | ❌ | No logging system |

---

## F. Data & State Design (데이터 및 상태 설계)

| Entity | Status | Detail |
|---|---|---|
| User | ✅ | `profile` in store |
| KYC Profile | ✅ | `kycData` in store |
| Wallet | ✅ | `bippleMoney` + `coins[]` |
| Topup Transaction | ✅ | `transactions[]` type='charge' |
| Crypto Sell Order | ⚠️ | Simulated in ChargeKorbit flow |
| Settlement Record | 🔲 | N/A for prototype |
| Payment Transaction | ✅ | `transactions[]` type='payment' |
| Refund Transaction | ❌ | Not implemented |
| Linked Exchange Account | ✅ | `korbitConnected` + coins by source |
| Linked Bank Account | ✅ | `bankAccounts[]` |
| Merchant Payment Record | ⚠️ | Stored as transaction only |
| Notification | ✅ | `notifications[]` |

### State Machines (상태 제어)

| State Machine | Status | Detail |
|---|---|---|
| KYC status | ✅ | ready → scanning → captured/failed → verified |
| Charge status | ✅ | input → processing → complete/failed |
| Payment status | ⚠️ | Only completed/failed; no pending→complete flow |
| Refund status | ❌ | Not implemented |
| Korbit sell status | ✅ | connect → select → confirm → processing → done |
| Banking deposit status | ⚠️ | Simulated ARS only |
| Idempotency | ⚠️ | Double-click prevention on ChargeBank; others missing |
| Duplicate prevention | ⚠️ | Unique transaction IDs with counter |

---

## G. Security & Compliance (보안 및 컴플라이언스)

| Requirement | Status | Detail |
|---|---|---|
| Auth/Authorization | ⚠️ | AuthGuard for routes; no real tokens |
| FIDO / Biometric | ⚠️ | Face ID toggle (UI only) |
| PIN security | ✅ | 6-digit, 5 attempts, 5-min lockout |
| Personal data protection | ⚠️ | Residence ID masked; PIN in plain text localStorage |
| Transaction anomaly detection | ❌ | Not implemented |
| AML / Fraud detection | 🔲 | Backend responsibility |
| API Key / OAuth management | ⚠️ | API key input UI exists; no real validation |
| Audit logs | ❌ | Not implemented |
| Admin access control | ❌ | No admin system |
| Korean e-finance regulations | ⚠️ | KYC limits follow 전금법 (1M foreigner limit) |
| Foreigner KYC (passport, stay, face, sanctions) | ✅ | Passport OCR + Face + HiKorea check |
| Session timeout | ⚠️ | Constant defined (10min) but not enforced |

---

## H. Admin/Operations Functions (운영/관리자 기능 설계)

| Requirement | Status | Detail |
|---|---|---|
| Operations dashboard | ❌ | Not implemented |
| KYC review screen | ❌ | Not implemented |
| Transaction monitoring | ❌ | Not implemented |
| Fraud detection dashboard | ❌ | Not implemented |
| Customer inquiry handling | ❌ | Not implemented |
| Refund approval/rejection | ❌ | Not implemented |
| Limit adjustment | ❌ | Constants in code only |
| Notice/Banner/Terms management | ❌ | Not implemented |
| Role-based admin | ❌ | Not implemented |

---

## I. Payment & Charging Policy (결제 및 충전 정책 설계)

| Policy | Status | Detail |
|---|---|---|
| Daily/Monthly charge limits | ⚠️ | Daily max enforced; no monthly tracking |
| User type limits | ✅ | 2M domestic, 1M foreigner |
| KYC level limits | ✅ | Minimal-KYC = 1M |
| Foreigner stay-period policy | ⚠️ | HiKorea check exists; no stay-period limit logic |
| Fee policy | ✅ | ATM 1,300 KRW; Coin 1%; constants.ts |
| Refund policy | ❌ | Not implemented |
| Cancel conditions | ❌ | Not implemented |
| Exchange rate display | ✅ | Shown in ChargeCoin and ChargeKorbit |
| Stablecoin/Fiat mixed use | ✅ | Separate charging methods, unified Bipple Money |

---

## J. Exception & Risk Scenarios (예외 및 리스크 시나리오)

| Scenario | Status | User Message | System Handling |
|---|---|---|---|
| Korbit API failure | ✅ | Maintenance modal | MaintenanceModal in ChargeHub |
| Sell order delay | ⚠️ | Processing spinner | Simulated 2s delay |
| KRW withdrawal fail | ❌ | Not handled | — |
| Banking deposit delay | ❌ | Not handled | — |
| Triple-A delay/failure | ⚠️ | Timer + waiting state | ChargeTripleA wait step |
| KYC frame failure | ✅ | Error messages | 3 failure types + retry |
| Passport OCR fail | ✅ | "여권 정보를 인식할 수 없습니다" | Retry loop + FAQ |
| Face recognition fail | ✅ | "얼굴이 일치하지 않습니다" | Score display + tips |
| Duplicate charge request | ⚠️ | Loading guard on ChargeBank | Others unprotected |
| Network disconnect during payment | ❌ | Not handled | — |
| Settlement mismatch | 🔲 | Backend responsibility | — |

---

## Summary Score

| Category | Items | ✅ Done | ⚠️ Partial | ❌ Missing | 🔲 Backend |
|---|---|---|---|---|---|
| A. Service Overview | 5 | 4 | 1 | 0 | 0 |
| B. User Journey | 12 | 9 | 1 | 2 | 0 |
| C. UI/UX Screens | 38 | 31 | 3 | 4 | 0 |
| D. Backend Functions | 17 | 3 | 5 | 1 | 8 |
| E. Architecture | 7 | 0 | 3 | 2 | 2 |
| F. Data & State | 18 | 11 | 4 | 2 | 1 |
| G. Security | 12 | 2 | 6 | 3 | 1 |
| H. Admin | 9 | 0 | 0 | 9 | 0 |
| I. Policy | 9 | 5 | 2 | 2 | 0 |
| J. Exceptions | 11 | 4 | 3 | 3 | 1 |
| **TOTAL** | **138** | **69 (50%)** | **28 (20%)** | **28 (20%)** | **13 (10%)** |

### UI Prototype Coverage: **70%** (✅ + ⚠️ of non-backend items)

---

## Top Priority Missing Items (for next phase)

### Must Have (MVP gaps)
1. **Refund/Cancel flow** — No cancellation or refund mechanism
2. **Splash screen** — No app loading screen
3. **Session timeout** — Constant defined but not enforced
4. **Customer support page** — Only FAQ in KYC retry
5. **Network error handling** — No offline/disconnect recovery

### Should Have (Phase 2)
6. **Admin portal** — KYC review, transaction monitoring, refund approval
7. **Onboarding tutorial** — First-time user guide slides
8. **Transaction search** — Text search in history
9. **Receipt share/export** — Email or image export
10. **Audit logging** — Transaction audit trail

### Nice to Have (Phase 3)
11. **Dark mode** — Theme toggle
12. **Biometric PIN** — Real fingerprint/Face ID
13. **Coin price chart** — Historical price display
14. **Push notifications** — Real FCM/APNs
15. **ATM map** — Nearby ATM locations
