import { useState, useEffect, useMemo } from 'react'
import { useStore, type CoinAsset } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { BottomSheet } from '../components/BottomSheet'
import { toast } from '../components/Toast'
import { Plus, ChevronRight, Check, Loader2, CheckCircle, XCircle, Copy, AlertCircle, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Step = 'list' | 'coin' | 'wc-terms' | 'wc-code' | 'wc-confirm' | 'verifying' | 'success' | 'fail'

const allCoins = [
  { symbol: 'PCI', ko: '페이코인', en: 'PayCoin', icon: '▶', color: 'bg-blue-500', paySupport: true, available: true },
  { symbol: 'BTC', ko: '비트코인', en: 'Bitcoin', icon: 'B', color: 'bg-orange-500', paySupport: true, available: true },
  { symbol: 'ETH', ko: '이더리움', en: 'Ethereum', icon: 'Ξ', color: 'bg-blue-600', paySupport: true, available: true },
  { symbol: 'XRP', ko: '리플', en: 'Ripple', icon: 'X', color: 'bg-gray-800', paySupport: false, available: true },
  { symbol: 'USDT', ko: '테더', en: 'Tether', icon: 'T', color: 'bg-green-500', paySupport: false, available: true },
  { symbol: 'SOL', ko: '솔라나', en: 'Solana', icon: 'S', color: 'bg-violet-500', paySupport: false, available: true },
  { symbol: 'POL', ko: '폴리곤 에코시스템 토큰', en: 'Polygon Ecosystem Token', icon: '⬡', color: 'bg-purple-600', paySupport: false, available: false },
]

const coinRates: Record<string, number> = {
  PCI: 350, BTC: 82500000, ETH: 2400000, XRP: 850, USDT: 1350, SOL: 180000, POL: 700,
}

function generateCode() { return String(Math.floor(10000000 + Math.random() * 90000000)) }
function fakeWallet() { return 'PCI0298C33376771B335DCC30C8D8CA946FA344CFCBDFC849938F' }

export default function SettingsCoins() {
  const navigate = useNavigate()
  const { coins, disconnectCoin, addCoin, connectKorbit, profile, language } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('list')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const confirmCoin = coins.find(c => c.id === confirmId)

  // Wallet Connect state
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsPrivacy, setTermsPrivacy] = useState(false)
  const [termsThird, setTermsThird] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(180)
  const [infoConfirmed, setInfoConfirmed] = useState(false)

  const selectableCoins = useMemo(() =>
    allCoins.filter(c => !coins.some(ec => ec.symbol === c.symbol && ec.source === 'Korbit')),
  [coins])
  const availableSelectable = selectableCoins.filter(c => c.available)
  const allSelected = availableSelectable.length > 0 && availableSelectable.every(c => selected.has(c.symbol))

  const toggleCoin = (sym: string) => {
    const next = new Set(selected)
    if (next.has(sym)) next.delete(sym); else next.add(sym)
    setSelected(next)
  }
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(availableSelectable.map(c => c.symbol)))
  }

  const handleDisconnect = () => {
    if (confirmId) { disconnectCoin(confirmId); setConfirmId(null); toast(t('settings_coins_disconnected')) }
  }

  const startRegister = () => {
    setSelected(new Set()); setTermsPrivacy(false); setTermsThird(false)
    setPrivacyAgreed(false); setInfoConfirmed(false)
    setStep('coin')
  }

  // Timer for wc-code
  useEffect(() => {
    if (step !== 'wc-code') return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setVerifyCode(generateCode()); return 180 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  const handleVerifyComplete = () => {
    setStep('verifying')
    setTimeout(() => {
      if (Math.random() < 0.05) { setStep('fail'); return }
      connectKorbit()
      selected.forEach((sym, i) => {
        const coin = allCoins.find(c => c.symbol === sym)
        if (coin) {
          const nc: CoinAsset = {
            id: String(Date.now()) + i, symbol: coin.symbol, name: coin.en,
            balance: +(Math.random() * (sym === 'BTC' ? 0.5 : sym === 'ETH' ? 2 : 100)).toFixed(4),
            unit: coin.symbol, source: 'Korbit', krwValue: 0, rate: coinRates[sym] || 1350,
          }
          nc.krwValue = Math.floor(nc.balance * nc.rate)
          addCoin(nc)
        }
      })
      setStep('success')
    }, 2000)
  }

  const coinColor = (sym: string) => allCoins.find(c => c.symbol === sym)?.color || 'bg-gray-500'
  const coinName = (c: typeof allCoins[0]) => language === 'ko' ? c.ko : c.en
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  // ① Coin Select (multi-select, 전체 선택, payment badges)
  if (step === 'coin') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('wc_asset_title')} onBack={() => setStep('list')} />
      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-text-dark">{t('wc_asset_heading')}</h2>
            <p className="text-xs text-text-gray mt-0.5">{t('wc_asset_desc')}</p>
          </div>
          <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${allSelected ? 'bg-primary' : 'bg-gray-200'}`}>
              {allSelected && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            {t('wc_select_all')}
          </button>
        </div>
        <div className="space-y-2">
          {selectableCoins.map(c => {
            const sel = selected.has(c.symbol)
            return (
              <button key={c.symbol} onClick={() => c.available && toggleCoin(c.symbol)} disabled={!c.available}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  !c.available ? 'border-border opacity-50 cursor-not-allowed' :
                  sel ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                <div className={`w-10 h-10 rounded-full ${c.color} text-white font-bold text-sm flex items-center justify-center`}>{c.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-text-dark">{coinName(c)} ({c.symbol})</p>
                </div>
                {c.paySupport && c.available && <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t('wc_pay_support')}</span>}
                {!c.available && <span className="text-[10px] font-medium text-text-light bg-gray-100 px-2 py-0.5 rounded-full">{t('wc_not_available')}</span>}
                {sel && c.available && <Check size={18} className="text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => { setTermsPrivacy(false); setTermsThird(false); setTermsOpen(true) }} disabled={selected.size === 0}
          className={`w-full py-4 font-semibold rounded-xl ${selected.size > 0 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('wc_start')}
        </button>
      </div>

      {/* ② Terms Popup */}
      <BottomSheet open={termsOpen} onClose={() => setTermsOpen(false)}>
        <div className="px-6 py-5">
          <button onClick={() => { const n = !(termsPrivacy && termsThird); setTermsPrivacy(n); setTermsThird(n) }}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl mb-4 transition-colors ${
              termsPrivacy && termsThird ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 border-2 border-border'
            }`}>
            <Check size={18} className={termsPrivacy && termsThird ? 'text-primary' : 'text-text-light'} />
            <span className={`font-semibold text-sm ${termsPrivacy && termsThird ? 'text-primary' : 'text-text-dark'}`}>{t('wc_terms_all')}</span>
          </button>
          <div className="space-y-3 mb-6">
            <button onClick={() => setTermsPrivacy(!termsPrivacy)} className="w-full flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${termsPrivacy ? 'bg-primary' : 'bg-gray-200'}`}>
                {termsPrivacy && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-text-dark flex-1 text-left">{t('wc_terms_privacy')}</span>
              <ChevronRight size={16} className="text-text-light" />
            </button>
            <button onClick={() => setTermsThird(!termsThird)} className="w-full flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${termsThird ? 'bg-primary' : 'bg-gray-200'}`}>
                {termsThird && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-text-dark flex-1 text-left">{t('wc_terms_third')}</span>
              <ChevronRight size={16} className="text-text-light" />
            </button>
          </div>
          <button onClick={() => { setTermsOpen(false); setStep('wc-terms') }} disabled={!termsPrivacy || !termsThird}
            className={`w-full py-4 font-semibold rounded-xl ${termsPrivacy && termsThird ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
            {t('wc_terms_agree')}
          </button>
        </div>
      </BottomSheet>
    </div>
  )

  // ③ Wallet Connect Terms + Privacy
  if (step === 'wc-terms') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title="Wallet Connect" onBack={() => setStep('coin')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-text-dark leading-snug whitespace-pre-line">{t('wc_heading')}</h2>
        <p className="text-xs text-text-gray mt-2">{t('wc_safe_notice')}</p>
        <div className="flex items-center gap-2 mt-3 mb-6">
          <Lock size={14} className="text-green-600" />
          <span className="text-xs text-green-600 font-medium">https://korbit.co.kr</span>
        </div>
        <p className="text-sm text-text-dark leading-relaxed mb-6">{t('wc_instruction')}</p>

        {/* Code illustration */}
        <div className="bg-gray-50 border border-border rounded-xl p-5 mb-6">
          <p className="text-xs font-medium text-text-gray text-center mb-1">{t('wc_code_label')}</p>
          <p className="text-[10px] text-text-light text-center mb-4 whitespace-pre-line">{t('wc_code_input_desc')}</p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-7 h-9 rounded border-2 border-primary/30 bg-white ${i === 3 ? 'mr-2' : ''}`} />
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle size={14} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">{t('wc_notice_title')}</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-yellow-700 leading-relaxed">
            <li>• {t('wc_notice_1')}</li>
            <li>• {t('wc_notice_2')}</li>
            <li>• {t('wc_notice_3')}</li>
          </ul>
        </div>

        <button onClick={() => setPrivacyAgreed(!privacyAgreed)} className="flex items-center gap-3 mb-4">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${privacyAgreed ? 'bg-primary' : 'bg-gray-200'}`}>
            {privacyAgreed && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-text-dark">{t('wc_privacy_agree')}</span>
        </button>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => { setVerifyCode(generateCode()); setTimeLeft(180); setStep('wc-code') }} disabled={!privacyAgreed}
          className={`w-full py-4 font-semibold rounded-xl ${privacyAgreed ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('confirm')}
        </button>
      </div>
    </div>
  )

  // ④ Verification Code
  if (step === 'wc-code') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title="Wallet Connect" onBack={() => setStep('wc-terms')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-text-dark leading-snug whitespace-pre-line">{t('wc_code_heading')}</h2>
        <p className="text-xs text-text-gray mt-2">{t('wc_safe_notice')}</p>
        <div className="flex items-center gap-2 mt-3 mb-8">
          <Lock size={14} className="text-green-600" />
          <span className="text-xs text-green-600 font-medium">https://korbit.co.kr</span>
        </div>

        <div className="text-center mb-2">
          <span className="text-sm font-medium text-primary">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
        </div>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-primary tracking-[0.15em]">{verifyCode.slice(0, 4)} {verifyCode.slice(4)}</p>
        </div>
        <div className="flex justify-center mb-8">
          <button onClick={() => { navigator.clipboard.writeText(verifyCode); toast(t('wc_code_copied'), 'success') }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary text-xs font-medium rounded-full">
            <Copy size={14} />{t('wc_code_copy')}
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {[t('wc_step_1'), t('wc_step_2'), t('wc_step_3'), t('wc_step_4')].map((text, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-xs text-text-gray leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle size={14} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">{t('wc_notice_title')}</span>
          </div>
          <p className="text-[11px] text-yellow-700">• {t('wc_notice_1')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => { setInfoConfirmed(false); setStep('wc-confirm') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('wc_complete')}</button>
      </div>
    </div>
  )

  // ⑤ Connection Info Review
  if (step === 'wc-confirm') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title="Wallet Connect" onBack={() => setStep('wc-code')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-text-dark mb-1">{t('wc_confirm_heading')}</h2>
        <p className="text-xs text-text-gray mb-6">{t('wc_confirm_desc')}</p>

        {/* User info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-text-gray mb-3">{t('wc_confirm_user_info')}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-gray">{t('wc_confirm_name_ko')}</span>
              <span className="text-text-dark font-medium flex items-center gap-1">{profile.name} <Check size={14} className="text-green-500" /></span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">{t('wc_confirm_name_en')}</span>
              <span className="text-text-dark font-medium flex items-center gap-1">{profile.name.toUpperCase()} <Check size={14} className="text-green-500" /></span>
            </div>
          </div>
        </div>

        {/* Connected wallet info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-text-gray mb-3">{t('wc_confirm_wallet_info')}</p>
          {[...selected].map(sym => {
            const c = allCoins.find(x => x.symbol === sym)
            return c ? (
              <div key={sym} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-full ${c.color} text-white font-bold text-[10px] flex items-center justify-center`}>{c.icon}</div>
                  <span className="text-sm font-medium text-text-dark">{c.symbol} ({coinName(c)})</span>
                </div>
                <div className="pl-8 space-y-1 text-xs">
                  <div><span className="text-text-gray">{t('wc_confirm_address')}</span></div>
                  <p className="text-[10px] text-text-dark font-mono break-all">{fakeWallet()}</p>
                </div>
              </div>
            ) : null
          })}
        </div>

        {/* Korbit exchange wallet info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-text-gray mb-3">{t('wc_confirm_korbit_info')}</p>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">K</div>
            <span className="text-sm font-medium text-text-dark">Korbit</span>
          </div>
          <div className="pl-8 space-y-1 text-xs">
            <div><span className="text-text-gray">{t('wc_confirm_address')}</span></div>
            <p className="text-[10px] text-text-dark font-mono break-all">{fakeWallet()}</p>
          </div>
        </div>

        {/* Confirm checkbox */}
        <button onClick={() => setInfoConfirmed(!infoConfirmed)} className="flex items-center gap-3 mb-4">
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${infoConfirmed ? 'bg-primary' : 'bg-gray-200'}`}>
            {infoConfirmed && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-text-dark">{t('wc_confirm_checkbox')}</span>
        </button>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleVerifyComplete} disabled={!infoConfirmed}
          className={`w-full py-4 font-semibold rounded-xl ${infoConfirmed ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('wc_confirm_btn')}
        </button>
      </div>
    </div>
  )

  // Verifying
  if (step === 'verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('coin_register_verifying')}</p>
    </div>
  )

  // ⑥ Success
  if (step === 'success') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('coin_register_success')}</p>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 w-full space-y-2">
          {[...selected].map(sym => {
            const c = allCoins.find(x => x.symbol === sym)
            return c ? (
              <div key={sym} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${c.color} text-white font-bold text-xs flex items-center justify-center`}>{c.icon}</div>
                <p className="font-medium text-sm text-text-dark">{coinName(c)} ({c.symbol})</p>
              </div>
            ) : null
          })}
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => setStep('list')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('confirm')}</button>
      </div>
    </div>
  )

  // Fail
  if (step === 'fail') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><XCircle size={64} className="text-red-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('coin_register_fail')}</p>
        <p className="text-sm text-text-gray mt-2 text-center">{t('wc_notice_3')}</p>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => { setVerifyCode(generateCode()); setTimeLeft(180); setStep('wc-code') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('retry')}</button>
        <button onClick={() => setStep('list')} className="w-full py-3 text-text-gray text-sm font-medium">{t('cancel')}</button>
      </div>
    </div>
  )

  // Main List
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray animate-slide-in">
      <Header title={t('settings_coins_title')} />
      <div className="flex-1 overflow-y-auto p-4">
        {coins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-4xl mb-3">🪙</p>
            <p className="text-sm text-text-gray">{t('settings_coins_empty')}</p>
            <p className="text-xs text-text-light mt-1 mb-4">{t('settings_coins_empty_desc')}</p>
            <button onClick={startRegister} className="px-6 py-2.5 bg-primary text-white text-sm rounded-xl font-medium">{t('settings_coins_add')}</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {coins.map((coin, i) => (
              <div key={coin.id} className={`${i < coins.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center px-4 py-4">
                  <button onClick={() => setDetailId(detailId === coin.id ? null : coin.id)} className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${coinColor(coin.symbol)}`}>{coin.symbol[0]}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-text-dark">{coin.symbol}</p>
                        <span className="text-[10px] text-text-light bg-gray-100 px-1.5 py-0.5 rounded">{coin.source}</span>
                      </div>
                      <p className="text-xs text-text-gray mt-0.5">{coin.balance.toFixed(coin.symbol === 'BTC' ? 4 : 2)} {coin.unit} · ≈ {coin.krwValue.toLocaleString()}원</p>
                    </div>
                  </button>
                  <ChevronRight size={16} className={`text-text-light transition-transform ${detailId === coin.id ? 'rotate-90' : ''}`} />
                </div>
                {detailId === coin.id && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                      <div className="flex justify-between"><span className="text-text-gray">{t('coin_detail_info')}</span></div>
                      <div className="flex justify-between"><span className="text-text-gray">{t('coin_balance_label')}</span><span className="text-text-dark font-medium">{coin.balance.toFixed(4)} {coin.unit}</span></div>
                      <div className="flex justify-between"><span className="text-text-gray">{t('coin_source_label')}</span><span className="text-text-dark">{coin.source}</span></div>
                      <div className="flex justify-between"><span className="text-text-gray">{t('coin_rate_label')}</span><span className="text-text-dark">1 {coin.symbol} = {coin.rate.toLocaleString()}원</span></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => navigate(`/coin/${coin.id}`)} className="flex-1 py-2.5 bg-primary/10 text-primary text-xs font-medium rounded-xl">{t('coin_detail')}</button>
                      <button onClick={() => setConfirmId(coin.id)} className="flex-1 py-2.5 bg-red-50 text-error text-xs font-medium rounded-xl">{t('settings_coins_disconnect')}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button onClick={startRegister} className="w-full mt-3 flex items-center justify-center gap-2 bg-white rounded-2xl p-4 active:bg-gray-50">
          <Plus size={18} className="text-primary" /><span className="text-sm font-medium text-primary">{t('settings_coins_add')}</span>
        </button>
      </div>

      <BottomSheet open={!!confirmId} onClose={() => setConfirmId(null)}>
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold text-text-dark text-center mb-2">{t('settings_coins_confirm_title')}</h3>
          <p className="text-sm text-text-gray text-center mb-1">{confirmCoin?.symbol} ({confirmCoin?.source})</p>
          <p className="text-xs text-text-gray text-center mb-6 whitespace-pre-line">{t('settings_coins_confirm_msg')}</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmId(null)} className="flex-1 py-3.5 bg-gray-100 text-text-gray font-medium rounded-xl">{t('cancel')}</button>
            <button onClick={handleDisconnect} className="flex-1 py-3.5 bg-error text-white font-medium rounded-xl">{t('settings_coins_disconnect')}</button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
