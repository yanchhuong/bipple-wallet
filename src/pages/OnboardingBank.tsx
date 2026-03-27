import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle, Loader2, Phone, Check, Landmark, BarChart3 } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'

const banks = [
  { id: 'shinhan', name: '신한은행', icon: '🏦' },
  { id: 'kb', name: '국민은행', icon: '🏛️' },
  { id: 'woori', name: '우리은행', icon: '🏗️' },
  { id: 'hana', name: '하나은행', icon: '🏢' },
  { id: 'nh', name: '농협은행', icon: '🌾' },
  { id: 'ibk', name: 'IBK기업은행', icon: '🏭' },
  { id: 'kakao', name: '카카오뱅크', icon: '💬' },
  { id: 'toss', name: '토스뱅크', icon: '📱' },
]

type AccountType = 'bank' | 'korbit'
type Step = 'type-select' | 'bank-select' | 'form' | 'terms' | 'ars' | 'verifying' | 'done' | 'korbit-connect' | 'korbit-verifying' | 'korbit-done'

export default function OnboardingBank() {
  const navigate = useNavigate()
  const { addBankAccount, bankAccounts, connectKorbit } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('type-select')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [selBank, setSelBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [termsChecked, setTermsChecked] = useState(false)
  const [arsCode] = useState(String(Math.floor(Math.random() * 90 + 10)))

  const goNext = () => navigate('/terms')

  const handleBankComplete = () => {
    const bank = banks.find(b => b.id === selBank)
    if (bank) {
      addBankAccount({
        bankName: bank.name,
        accountNumber: accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3'),
        holderName,
        isDefault: bankAccounts.length === 0,
      })
    }
    setStep('done')
  }

  const handleKorbitConnect = () => {
    // Navigate to Korbit OAuth flow (first-time authentication)
    navigate('/charge-korbit')
  }

  // === Type Select (Bank Account or Korbit) ===
  if (step === 'type-select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('onboarding_bank_title')} />
      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <StepIndicator current={2} />
        <h2 className="text-lg font-bold text-text-dark mb-1">{t('onboarding_type_heading')}</h2>
        <p className="text-sm text-text-gray mb-6">{t('onboarding_type_desc')}</p>

        <div className="space-y-3">
          {/* Bank Account */}
          <button onClick={() => setAccountType('bank')}
            className={`w-full flex items-center gap-4 p-5 border-2 rounded-2xl transition-all ${
              accountType === 'bank' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Landmark size={24} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className={`font-semibold text-sm ${accountType === 'bank' ? 'text-primary' : 'text-text-dark'}`}>{t('onboarding_type_bank')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('onboarding_type_bank_desc')}</p>
            </div>
            {accountType === 'bank' && <Check size={20} className="text-primary" />}
          </button>

          {/* Korbit */}
          <button onClick={() => setAccountType('korbit')}
            className={`w-full flex items-center gap-4 p-5 border-2 rounded-2xl transition-all ${
              accountType === 'korbit' ? 'border-[#0052FF] bg-[#0052FF]/5' : 'border-border'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={24} className="text-[#0052FF]" />
            </div>
            <div className="text-left flex-1">
              <p className={`font-semibold text-sm ${accountType === 'korbit' ? 'text-[#0052FF]' : 'text-text-dark'}`}>{t('onboarding_type_korbit')}</p>
              <p className="text-xs text-text-gray mt-0.5">{t('onboarding_type_korbit_desc')}</p>
            </div>
            {accountType === 'korbit' && <Check size={20} className="text-[#0052FF]" />}
          </button>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep(accountType === 'korbit' ? 'korbit-connect' : 'bank-select')} disabled={!accountType}
          className={`w-full py-4 font-semibold rounded-xl ${accountType ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: Select Bank ===
  if (step === 'bank-select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('onboarding_bank_title')} onBack={() => setStep('type-select')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('account_bank_select')}</h2>
        <p className="text-xs text-text-gray mb-5">{t('account_bank_select_desc')}</p>
        <div className="grid grid-cols-2 gap-2">
          {banks.map(bank => (
            <button key={bank.id} onClick={() => setSelBank(bank.id)}
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${
                selBank === bank.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
              <span className="text-xl">{bank.icon}</span>
              <span className={`text-xs font-medium ${selBank === bank.id ? 'text-primary' : 'text-text-dark'}`}>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('form')} disabled={!selBank}
          className={`w-full py-4 font-semibold rounded-xl ${selBank ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: Account Form ===
  if (step === 'form') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('onboarding_bank_title')} onBack={() => setStep('bank-select')} />
      <div className="flex-1 px-6 pt-6">
        <div className="flex items-center gap-2.5 mb-5 bg-gray-50 rounded-xl p-3">
          <span className="text-xl">{banks.find(b => b.id === selBank)?.icon}</span>
          <span className="text-sm font-medium text-text-dark">{banks.find(b => b.id === selBank)?.name}</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('account_number')}</label>
            <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder={t('account_number_placeholder')} maxLength={14}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('account_holder')}</label>
            <input type="text" value={holderName} onChange={e => setHolderName(e.target.value)}
              placeholder={t('account_holder_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('terms')} disabled={!accountNumber || !holderName || accountNumber.length < 8}
          className={`w-full py-4 font-semibold rounded-xl ${accountNumber && holderName && accountNumber.length >= 8 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('next')}
        </button>
      </div>
    </div>
  )

  // === Bank: Terms ===
  if (step === 'terms') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_account_terms')} onBack={() => setStep('form')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-4">{t('settings_account_terms')}</h2>
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
          <button onClick={() => setTermsChecked(!termsChecked)}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${termsChecked ? 'bg-primary' : 'bg-gray-200'}`}>
            {termsChecked && <Check size={12} className="text-white" strokeWidth={3} />}
          </button>
          <span className="text-sm text-text-dark">[{t('terms_required')}] {t('settings_account_terms_check')}</span>
        </label>
        <div className="mt-3 bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
          <p className="text-[10px] text-text-gray leading-relaxed">{t('terms_service_content')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('ars')} disabled={!termsChecked}
          className={`w-full py-4 font-semibold rounded-xl ${termsChecked ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Bank: ARS ===
  if (step === 'ars') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('settings_account_ars')} onBack={() => setStep('terms')} />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Phone size={36} className="text-primary" /></div>
        <p className="text-base font-semibold text-text-dark text-center mb-2">{t('settings_account_ars')}</p>
        <p className="text-sm text-text-gray text-center mb-6">{t('settings_account_ars_desc')}</p>
        <div className="bg-primary/5 rounded-2xl px-8 py-4 mb-4">
          <p className="text-4xl font-bold text-primary text-center tracking-widest">{arsCode}</p>
        </div>
        <p className="text-xs text-text-gray text-center">{t('settings_account_ars_input')}</p>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => { setStep('verifying'); setTimeout(handleBankComplete, 2500) }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('settings_account_ars_btn')}</button>
      </div>
    </div>
  )

  // === Bank: Verifying ===
  if (step === 'verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('settings_account_ars_verifying')}</p>
    </div>
  )

  // === Bank: Done ===
  if (step === 'done') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('settings_account_done')}</p>
        <p className="text-sm text-text-gray mt-1">{t('settings_account_done_msg')}</p>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl">{banks.find(b => b.id === selBank)?.icon}</span>
            <div>
              <p className="text-sm font-semibold text-text-dark">{banks.find(b => b.id === selBank)?.name}</p>
              <p className="text-xs text-text-gray">{accountNumber.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3')} · {holderName}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={goNext} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
      </div>
    </div>
  )

  // === Korbit: Connect ===
  if (step === 'korbit-connect') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title="Korbit" onBack={() => setStep('type-select')} />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center mb-6">
          <BarChart3 size={40} className="text-[#0052FF]" />
        </div>
        <h2 className="text-lg font-bold text-text-dark text-center mb-2">{t('onboarding_korbit_heading')}</h2>
        <p className="text-sm text-text-gray text-center mb-6">{t('onboarding_korbit_desc')}</p>

        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">1</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">2</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0052FF]">3</span>
            </div>
            <span className="text-xs text-text-gray">{t('onboarding_korbit_step3')}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={handleKorbitConnect}
          className="w-full py-4 bg-[#0052FF] text-white font-semibold rounded-xl active:bg-[#0040CC]">{t('onboarding_korbit_connect')}</button>
      </div>
    </div>
  )

  // === Korbit: Verifying ===
  if (step === 'korbit-verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-[#0052FF] animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('onboarding_korbit_connecting')}</p>
    </div>
  )

  // === Korbit: Done ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('onboarding_korbit_done')}</p>
        <p className="text-sm text-text-gray mt-1">{t('onboarding_korbit_done_desc')}</p>
        <div className="mt-4 bg-[#0052FF]/5 rounded-xl p-4 w-full flex items-center gap-3">
          <BarChart3 size={24} className="text-[#0052FF]" />
          <p className="text-sm font-semibold text-text-dark">Korbit</p>
          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-auto">{t('otp_verified')}</span>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={goNext} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('next')}</button>
      </div>
    </div>
  )
}
