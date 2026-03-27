import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ATM_FEE } from '../constants'

// Utility: format date consistently
function formatDateKR() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function formatTimeKR() {
  return new Date().toLocaleTimeString('ko-KR', { hour12: false })
}

// Unique ID generator (avoids millisecond collision)
let idCounter = 0
function uniqueId() {
  return `${Date.now()}-${++idCounter}`
}

export type Language = 'ko' | 'en' | 'zh'
export type Theme = 'light' | 'dark' | 'system'

export interface CoinAsset {
  id: string
  symbol: string
  name: string
  balance: number
  unit: string
  source: string
  krwValue: number
  rate: number
}

export interface Transaction {
  id: string
  type: 'payment' | 'charge' | 'atm' | 'fee' | 'exchange'
  title: string
  subtitle: string
  amount: number
  balance: number
  date: string
  time: string
  status: 'completed' | 'pending' | 'failed'
  paymentMethod: 'bipple' | 'coin'
}

export interface Notification {
  id: string
  type: 'payment' | 'charge' | 'notice' | 'event'
  title: string
  message: string
  date: string
  read: boolean
}

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  holderName: string
  isDefault: boolean
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  passportNo: string
  nationality: string
  birthDate: string
  residenceId: string
}

interface AppState {
  // App state
  language: Language
  isLoggedIn: boolean
  isKycComplete: boolean
  userType: 'domestic' | 'foreigner' | null
  loginMethod: 'google' | 'apple' | 'email' | 'phone' | 'korbit' | null
  pin: string
  pinSet: boolean
  hasCrypto: boolean

  // Profile
  profile: UserProfile

  // Settings
  theme: Theme
  notificationsEnabled: boolean
  faceIdEnabled: boolean

  // Wallet
  bippleMoney: number
  coins: CoinAsset[]
  transactions: Transaction[]
  notifications: Notification[]

  // KYC data
  kycData: {
    surname: string
    givenName: string
    birthDate: string
    passportNo: string
    nationality: string
  }

  // Connected accounts
  bankAccounts: BankAccount[]
  korbitConnected: boolean

  // Actions
  setLanguage: (lang: Language) => void
  login: (method?: AppState['loginMethod']) => void
  setUserType: (type: 'domestic' | 'foreigner') => void
  setHasCrypto: (val: boolean) => void
  setPin: (pin: string) => void
  completeKyc: () => void
  setKycData: (data: Partial<AppState['kycData']>) => void
  updateProfile: (data: Partial<UserProfile>) => void
  setTheme: (theme: Theme) => void
  setNotificationsEnabled: (v: boolean) => void
  setFaceIdEnabled: (v: boolean) => void
  chargeBippleMoney: (amount: number) => void
  payBippleMoney: (amount: number, merchant: string) => void
  withdrawAtm: (amount: number) => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  markNotificationRead: (id: string) => void
  connectKorbit: () => void
  disconnectCoin: (id: string) => void
  addCoin: (coin: CoinAsset) => void
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => void
  removeBankAccount: (id: string) => void
  setDefaultBank: (id: string) => void
  logout: () => void
}

const initialState = {
  language: 'ko' as Language,
  isLoggedIn: false,
  isKycComplete: false,
  userType: null as 'domestic' | 'foreigner' | null,
  loginMethod: null as AppState['loginMethod'],
  pin: '',
  pinSet: false,
  hasCrypto: false,

  profile: {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    passportNo: '',
    nationality: '',
    birthDate: '',
    residenceId: '',
  },

  theme: 'light' as Theme,
  notificationsEnabled: true,
  faceIdEnabled: false,

  bippleMoney: 0,
  coins: [] as CoinAsset[],
  transactions: [] as Transaction[],
  notifications: [] as Notification[],

  kycData: { surname: '', givenName: '', birthDate: '', passportNo: '', nationality: '' },
  bankAccounts: [] as BankAccount[],
  korbitConnected: false,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      login: (method) => set({ isLoggedIn: true, loginMethod: method || null, korbitConnected: method === 'korbit' }),
      setUserType: (type) => set({ userType: type }),
      setHasCrypto: (val) => set({ hasCrypto: val }),
      setPin: (pin) => set({ pin, pinSet: true }),
      completeKyc: () => set({ isKycComplete: true }),
      setKycData: (data) => set((s) => ({ kycData: { ...s.kycData, ...data } })),
      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setFaceIdEnabled: (v) => set({ faceIdEnabled: v }),

      chargeBippleMoney: (amount) => {
        const newBalance = get().bippleMoney + amount
        set({ bippleMoney: newBalance })
        get().addTransaction({
          type: 'charge', title: '비플머니 충전', subtitle: '충전',
          amount, balance: newBalance,
          date: formatDateKR(), time: formatTimeKR(),
          status: 'completed', paymentMethod: 'bipple'
        })
      },

      payBippleMoney: (amount, merchant) => {
        const newBalance = get().bippleMoney - amount
        set({ bippleMoney: newBalance })
        get().addTransaction({
          type: 'payment', title: merchant, subtitle: '결제',
          amount: -amount, balance: newBalance,
          date: formatDateKR(), time: formatTimeKR(),
          status: 'completed', paymentMethod: 'bipple'
        })
      },

      withdrawAtm: (amount) => {
        const fee = ATM_FEE
        const balanceAfterWithdraw = get().bippleMoney - amount
        const newBalance = balanceAfterWithdraw - fee
        set({ bippleMoney: newBalance })
        const date = formatDateKR()
        const time = formatTimeKR()
        // Log withdrawal transaction
        get().addTransaction({
          type: 'atm', title: 'NICE ATM 출금', subtitle: 'ATM',
          amount: -amount, balance: balanceAfterWithdraw,
          date, time, status: 'completed', paymentMethod: 'bipple'
        })
        // Log fee transaction
        get().addTransaction({
          type: 'fee', title: 'ATM 출금 수수료', subtitle: '수수료',
          amount: -fee, balance: newBalance,
          date, time, status: 'completed', paymentMethod: 'bipple'
        })
      },

      addTransaction: (tx) => set((s) => ({
        transactions: [{ ...tx, id: uniqueId() }, ...s.transactions]
      })),

      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      connectKorbit: () => set({ korbitConnected: true }),

      disconnectCoin: (id) => set((s) => ({
        coins: s.coins.filter(c => c.id !== id)
      })),

      addCoin: (coin) => set((s) => ({
        coins: [...s.coins, coin]
      })),

      addBankAccount: (bank) => set((s) => {
        const newBank = { ...bank, id: 'b' + Date.now() }
        const accounts = bank.isDefault
          ? s.bankAccounts.map(b => ({ ...b, isDefault: false })).concat(newBank)
          : [...s.bankAccounts, newBank]
        return { bankAccounts: accounts }
      }),

      removeBankAccount: (id) => set((s) => {
        const removed = s.bankAccounts.find(b => b.id === id)
        const remaining = s.bankAccounts.filter(b => b.id !== id)
        // If deleted account was default, promote first remaining to default
        if (removed?.isDefault && remaining.length > 0) {
          remaining[0] = { ...remaining[0], isDefault: true }
        }
        return { bankAccounts: remaining }
      }),

      setDefaultBank: (id) => set((s) => ({
        bankAccounts: s.bankAccounts.map(b => ({ ...b, isDefault: b.id === id }))
      })),

      logout: () => set({ ...initialState }),
    }),
    {
      name: 'bipple-wallet-storage',
      version: 1,
      // Use sessionStorage: each browser tab gets its own isolated state.
      // New tab = fresh onboarding. Closing tab = data wiped.
      // Refresh in same tab = state preserved.
      storage: {
        getItem: (name) => {
          const v = sessionStorage.getItem(name)
          return v ? JSON.parse(v) : null
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([, v]) => typeof v !== 'function')
        ) as unknown as AppState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as object),
        profile: {
          ...(currentState as AppState).profile,
          ...((persistedState as Partial<AppState>)?.profile || {}),
        },
        kycData: {
          ...(currentState as AppState).kycData,
          ...((persistedState as Partial<AppState>)?.kycData || {}),
        },
      }),
    }
  )
)
