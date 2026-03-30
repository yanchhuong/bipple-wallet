import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { MOCK_RATES, COIN_CHARGE_FEE_RATE } from '../constants'
import { AlertTriangle, Copy, Clock, CheckCircle, Loader2, Wallet, Send, Search, CircleCheck, ArrowRight, Check, Smartphone, ExternalLink } from 'lucide-react'
import { toast } from '../components/Toast'

type Step = 'guide' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5'

// Step progress bar
function StepProgress({ current }: { current: number }) {
  const steps = [
    { num: 1, icon: Wallet },
    { num: 2, icon: Send },
    { num: 3, icon: Copy },
    { num: 4, icon: Search },
    { num: 5, icon: CircleCheck },
  ]
  return (
    <div className="flex items-center gap-0.5 mb-5">
      {steps.map((s, i) => {
        const done = s.num < current
        const active = s.num === current
        const Icon = s.icon
        return (
          <div key={s.num} className="flex items-center gap-0.5 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              done ? 'bg-green-500' : active ? 'bg-primary' : 'bg-gray-200'
            }`}>
              {done
                ? <Check size={14} className="text-white" strokeWidth={3} />
                : <Icon size={13} className={active ? 'text-white' : 'text-text-light'} />
              }
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-[2px] ${done ? 'bg-green-500' : active ? 'bg-primary/30' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ChargeTripleA() {
  const navigate = useNavigate()
  const { chargeBippleMoney } = useStore()
  const t = useT()
  const [step, setStep] = useState<Step>(sessionStorage.getItem('dtc-guide-skip') ? 'step1' : 'guide')
  const [selectedCoin, setSelectedCoin] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [confirms, setConfirms] = useState(0)
  const [timer, setTimer] = useState(1800) // 30 min
  const chargedRef = useRef(false)
  const [transferSim, setTransferSim] = useState<0 | 1 | 2 | 3 | 4 | 5>(0) // 0=hidden, 1-4=steps, 5=done
  const [transferReady, setTransferReady] = useState(false) // true after sim finishes

  const requiredConfirmations = 30
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

  // Calculate amounts based on selected coin
  const depositAmount = 100 // simulated 100 coins deposited
  const rate = MOCK_RATES[selectedCoin] || 1350
  const grossKRW = Math.floor(depositAmount * rate)
  const fee = Math.floor(grossKRW * COIN_CHARGE_FEE_RATE)
  const finalAmount = grossKRW - fee

  // Timer countdown for step3
  useEffect(() => {
    if (step !== 'step3') return
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(iv)
  }, [step])

  const startWaiting = () => {
    setStep('step4')
    setConfirms(0)
    const iv = setInterval(() => {
      setConfirms(c => {
        if (c >= requiredConfirmations) return c
        const next = c + 1
        if (next >= requiredConfirmations) {
          clearInterval(iv)
          setTimeout(() => {
            if (!chargedRef.current) {
              chargedRef.current = true
              chargeBippleMoney(finalAmount)
              toast(t('state_charge_success'), 'success')
            }
            setStep('step5')
          }, 500)
          return requiredConfirmations
        }
        return next
      })
    }, 400)
  }

  const guideSteps = [
    { num: 1, icon: Wallet, label: t('dtc_guide_step1'), color: 'text-primary bg-primary/10' },
    { num: 2, icon: Send, label: t('dtc_guide_step2'), color: 'text-green-600 bg-green-50' },
    { num: 3, icon: Copy, label: t('dtc_guide_step3'), color: 'text-blue-600 bg-blue-50' },
    { num: 4, icon: Search, label: t('dtc_guide_step4'), color: 'text-amber-600 bg-amber-50' },
    { num: 5, icon: CircleCheck, label: t('dtc_guide_step5'), color: 'text-green-600 bg-green-50' },
  ]

  const fmtTimer = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`

  const senderAddr = '0x4FA01d3B8fc77eD2a5C92E94bA3F9c12d8AbC9eF'
  const simAmount = selectedCoin === 'USDT' ? '100.00' : '0.05'
  const simFee = selectedNetwork === 'ERC-20' ? '$0.38' : selectedNetwork === 'TRC-20' ? '$0.02' : '$0.01'
  const simSpeed = selectedNetwork === 'ERC-20' ? '~12 sec' : selectedNetwork === 'TRC-20' ? '~3 sec' : '~1 sec'

  const handleCopyAndTransfer = () => {
    navigator.clipboard?.writeText(walletAddress)
    toast(t('triplea_addr_copy'), 'success')
    // Start MetaMask-like simulation
    setTransferSim(1)
    setTimeout(() => setTransferSim(2), 1500)  // step 2: To address
    setTimeout(() => setTransferSim(3), 3000)  // step 3: Amount
    setTimeout(() => setTransferSim(4), 4500)  // step 4: Review + Confirm
    setTimeout(() => {
      setTransferSim(5) // done
      setTimeout(() => {
        setTransferSim(0)
        setTransferReady(true)
      }, 1200)
    }, 6500)
  }

  // ===== Guide Page =====
  if (step === 'guide') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('dtc_guide_title')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('dtc_guide_heading')}</h2>
        <p className="text-xs text-text-gray mb-6">{t('dtc_guide_desc')}</p>
        <div className="space-y-3">
          {guideSteps.map(s => {
            const Icon = s.icon
            return (
              <div key={s.num} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color.split(' ')[1]}`}>
                  <Icon size={20} className={s.color.split(' ')[0]} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-dark">{s.label}</p>
                </div>
                <span className="text-xs font-bold text-text-light bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center">{s.num}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-1 mt-6 text-text-light">
          {guideSteps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1">
              <span className="text-[10px] font-bold bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center">{s.num}</span>
              {i < guideSteps.length - 1 && <ArrowRight size={12} />}
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" onChange={(e) => {
            if (e.target.checked) sessionStorage.setItem('dtc-guide-skip', '1')
            else sessionStorage.removeItem('dtc-guide-skip')
          }} className="w-4 h-4 rounded border-border text-primary accent-primary" />
          <span className="text-xs text-text-gray">{t('dtc_guide_skip')}</span>
        </label>
      </div>
      <div className="px-6 pb-8 pt-3">
        <button onClick={() => setStep('step1')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark">{t('next')}</button>
      </div>
    </div>
  )

  // ===== Step 1: 받는 주소 생성 요청 (Select Coin + Network → Generate) =====
  if (step === 'step1') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('dtc_guide_step1')} onBack={() => setStep('guide')} />
      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <StepProgress current={1} />

        {/* Coin Selection */}
        <p className="text-xs font-medium text-text-gray mb-2">{t('triplea_coin_heading')}</p>
        <div className="space-y-2 mb-5">
          {[{ id: 'USDT', name: 'Tether', color: 'bg-green-500' }, { id: 'USDC', name: 'USD Coin', color: 'bg-blue-500' }].map(coin => (
            <button key={coin.id} onClick={() => setSelectedCoin(coin.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedCoin === coin.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className={`w-10 h-10 rounded-full ${coin.color} text-white font-bold text-sm flex items-center justify-center`}>{coin.id[0]}</div>
              <div className="text-left"><p className="font-semibold text-text-dark">{coin.id}</p><p className="text-xs text-text-gray">{coin.name}</p></div>
              {selectedCoin === coin.id && <Check size={18} className="text-primary ml-auto" />}
            </button>
          ))}
        </div>

        {/* Network Selection (shown after coin selected) */}
        {selectedCoin && (
          <div className="animate-fade-in">
            <p className="text-xs font-medium text-text-gray mb-2">{t('triplea_net_heading')}</p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex gap-2">
              <AlertTriangle size={14} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-error leading-relaxed">{t('triplea_net_warning')}</p>
            </div>
            <div className="space-y-2">
              {[{ id: 'ERC-20', name: 'Ethereum', note: t('triplea_net_fee_high') },
                { id: 'TRC-20', name: 'Tron', note: t('triplea_net_fee_low') },
                { id: 'Solana', name: 'Solana', note: t('triplea_net_fast') }].map(net => (
                <button key={net.id} onClick={() => setSelectedNetwork(net.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${selectedNetwork === net.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="text-left"><p className="font-medium text-sm text-text-dark">{net.id}</p><p className="text-[10px] text-text-gray">{net.name} · {net.note}</p></div>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedNetwork === net.id ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center`}>
                    {selectedNetwork === net.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('step2')} disabled={!selectedCoin || !selectedNetwork}
          className={`w-full py-4 font-semibold rounded-xl flex items-center justify-center gap-2 ${
            selectedCoin && selectedNetwork ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
          }`}>
          <Wallet size={18} />
          {t('dtc_step1_generate')}
        </button>
      </div>
    </div>
  )

  // ===== Step 2: 가상자산 보유 앱 실행 (Open your external wallet) =====
  if (step === 'step2') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('dtc_guide_step2')} onBack={() => setStep('step1')} />
      <div className="flex-1 px-6 pt-4">
        <StepProgress current={2} />

        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mb-6">
            <Smartphone size={40} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-text-dark text-center mb-2">{t('dtc_step2_heading')}</h2>
          <p className="text-sm text-text-gray text-center mb-6 whitespace-pre-line">{t('dtc_step2_desc')}</p>

          {/* Selected coin + network summary */}
          <div className="w-full bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-gray">{t('triplea_coin_title')}</span>
              <span className="text-sm font-semibold text-text-dark">{selectedCoin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-gray">{t('triplea_net_title')}</span>
              <span className="text-sm font-semibold text-text-dark">{selectedNetwork}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-gray">{t('triplea_addr_address')}</span>
              <span className="text-xs font-mono text-primary">{walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-text-light">
            <ExternalLink size={14} />
            <span>{t('dtc_step2_hint')}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => { setTimer(1800); setStep('step3') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark flex items-center justify-center gap-2">
          <Send size={18} />
          {t('next')}
        </button>
      </div>
    </div>
  )

  // ===== Step 3: 받는 주소 복사 후 Transfer =====
  if (step === 'step3') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('dtc_guide_step3')} onBack={() => setStep('step2')} />
      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <StepProgress current={3} />

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="w-44 h-44 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-border">
            <div className="grid grid-cols-5 gap-1.5 p-3">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-5 h-5 rounded-sm ${[0,1,4,5,6,9,10,14,15,16,19,20,21,24].includes(i) ? 'bg-gray-800' : 'bg-white'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Address + Copy */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-text-gray">{t('triplea_addr_address')}</p>
          {!transferReady && (
            <div className="flex items-center gap-1 animate-pulse-slow">
              <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">Tap Copy</span>
              <span className="text-primary">↓</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 mb-3">
          <p className="flex-1 text-xs text-text-dark font-mono break-all">{walletAddress}</p>
          <button onClick={handleCopyAndTransfer}
            className="p-2 bg-white rounded-lg border-2 border-primary active:bg-gray-100 flex-shrink-0 shadow-md shadow-primary/20">
            <Copy size={16} className="text-primary" />
          </button>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-3 mb-4">
          <Clock size={16} className="text-warning flex-shrink-0" />
          <p className="text-xs text-warning font-medium">{t('triplea_addr_timer')}: {fmtTimer} {t('triplea_addr_remaining')}</p>
        </div>

        {/* Network + Coin badge */}
        <div className="flex gap-2 mb-4">
          <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">{selectedCoin}</span>
          <span className="text-xs font-medium bg-gray-100 text-text-gray px-3 py-1.5 rounded-full">{selectedNetwork}</span>
        </div>

        {/* Warnings */}
        <div className="bg-red-50 rounded-xl p-3 space-y-1.5">
          <p className="text-[11px] text-error leading-relaxed">• <strong>{selectedNetwork}</strong> {t('triplea_addr_warn1')}</p>
          <p className="text-[11px] text-error leading-relaxed">• {t('triplea_addr_warn2')}</p>
          <p className="text-[11px] text-error leading-relaxed">• {t('triplea_addr_warn3')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={startWaiting} disabled={!transferReady}
          className={`w-full py-4 font-semibold rounded-xl flex items-center justify-center gap-2 ${
            transferReady ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}>
          <Search size={18} />
          {t('triplea_addr_check')}
        </button>
      </div>

      {/* ===== Crypto Wallet Transfer Simulation ===== */}
      {transferSim > 0 && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 animate-fade-in">
          <div className="w-full max-w-[393px] bg-[#141618] rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up" style={{ maxHeight: '85%' }}>

            {/* Wallet Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2d31]">
              <div className="flex items-center gap-2">
                {/* Fox logo SVG (MetaMask-style) */}
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M22.5 5.2L13.4 1.1 4.3 5.2 2 10.7l2.3 5.5 9.1 6.7 9.1-6.7 2.3-5.5z" fill="#E8821E" opacity="0.9"/>
                  <path d="M13.4 1.1L4.3 5.2l3.4 5.5h11.4l3.4-5.5z" fill="#F5A623" opacity="0.8"/>
                  <path d="M7.7 10.7L4.3 5.2 2 10.7l5.7 0z" fill="#D87C30"/>
                  <path d="M19.1 10.7l3.4-5.5 2.3 5.5h-5.7z" fill="#D87C30"/>
                  <path d="M7.7 10.7L2 10.7l2.3 5.5 5.4-5.5z" fill="#E8821E"/>
                  <path d="M19.1 10.7h5.7l-2.3 5.5-3.4-5.5z" fill="#E8821E"/>
                  <path d="M4.3 16.2l9.1 6.7V10.7H7.7z" fill="#F5A623" opacity="0.7"/>
                  <path d="M22.5 16.2l-9.1 6.7V10.7h5.7z" fill="#F5A623" opacity="0.7"/>
                </svg>
                <span className="text-white/80 font-semibold text-sm">
                  {transferSim <= 3 ? 'Send' : transferSim === 4 ? 'Review' : 'Confirmed'}
                </span>
              </div>
              {transferSim === 4 && (
                <div className="w-7 h-7 rounded-lg bg-[#2a2d31] flex items-center justify-center">
                  <span className="text-gray-400 text-xs">⚙</span>
                </div>
              )}
            </div>

            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 52px)' }}>

              {/* ── Step 1: Select Account ── */}
              {transferSim === 1 && (
                <div className="animate-fade-in space-y-5">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">From</p>
                  <div className="flex items-center gap-3 bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-emerald-300 to-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-white text-sm font-semibold">Account 1</p>
                        <span className="text-gray-600 text-[10px]">▼</span>
                      </div>
                      <p className="text-gray-500 text-[11px] font-mono mt-0.5">{senderAddr.slice(0, 8)}...{senderAddr.slice(-4)} 📋</p>
                    </div>
                  </div>
                  <div className="bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <p className="text-white text-2xl font-bold">$77.74 <span className="text-gray-500 text-sm">USD</span></p>
                    <p className="text-green-400 text-xs mt-1">+$0.5 (+0.65%)</p>
                  </div>
                  <div className="flex justify-center pt-2"><Loader2 size={22} className="text-blue-500 animate-spin" /></div>
                </div>
              )}

              {/* ── Step 2: To Address ── */}
              {transferSim === 2 && (
                <div className="animate-fade-in space-y-5">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">From</p>
                  <div className="flex items-center gap-3 bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-emerald-300 to-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-semibold">Account 1</p>
                      <p className="text-gray-500 text-[11px] font-mono">{senderAddr.slice(0, 8)}...{senderAddr.slice(-4)}</p>
                    </div>
                    <span className="ml-auto text-gray-600 text-sm">▼</span>
                  </div>

                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">To</p>
                  <div className="bg-[#1e2025] rounded-2xl p-4 border-2 border-blue-500/50">
                    <p className="text-blue-400 text-xs font-mono break-all">{walletAddress}</p>
                  </div>
                  <div className="flex justify-center pt-2"><Loader2 size={22} className="text-blue-500 animate-spin" /></div>
                </div>
              )}

              {/* ── Step 3: Amount ── */}
              {transferSim === 3 && (
                <div className="animate-fade-in space-y-4">
                  {/* Coin selector + amount */}
                  <div className="flex items-center gap-3 bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        selectedCoin === 'USDT' ? 'bg-green-500' : 'bg-blue-500'
                      }`}>{selectedCoin[0]}</div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-[#1e2025]" />
                    </div>
                    <div>
                      <span className="text-white text-sm font-medium">{selectedCoin}</span>
                      <span className="text-gray-600 text-xs ml-1">▼</span>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-white font-mono text-sm">{simAmount} {selectedCoin}</p>
                      <p className="text-gray-500 text-[10px]">${selectedCoin === 'USDT' ? '100.00' : '162.50'}</p>
                    </div>
                    <div className="text-gray-600 text-xs">⇅</div>
                  </div>
                  <div className="flex justify-between px-1">
                    <span className="text-gray-600 text-[10px]">Balance: {simAmount}</span>
                    <span className="text-blue-400 text-[10px] font-medium">Max</span>
                  </div>

                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">To</p>
                  <div className="flex items-center gap-3 bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}</p>
                    </div>
                    <span className="ml-auto text-gray-600">×</span>
                  </div>
                  <div className="flex justify-center pt-2"><Loader2 size={22} className="text-blue-500 animate-spin" /></div>
                </div>
              )}

              {/* ── Step 4: Review & Confirm ── */}
              {transferSim === 4 && (
                <div className="animate-fade-in space-y-4">
                  {/* Amount display */}
                  <div className="flex flex-col items-center py-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 ring-4 ring-[#2a2d31] ${
                      selectedCoin === 'USDT' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>{selectedCoin[0]}</div>
                    <p className="text-white text-xl font-bold">{simAmount} {selectedCoin}</p>
                    <p className="text-gray-500 text-xs">${selectedCoin === 'USDT' ? '100.00' : '162.50'}</p>
                  </div>

                  {/* From → To */}
                  <div className="bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-[10px]">From</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-red-400" />
                          <span className="text-white text-xs">Account 1</span>
                        </div>
                      </div>
                      <span className="text-gray-600 text-lg">›</span>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <p className="text-gray-500 text-[10px]">To</p>
                          <span className="text-yellow-500 text-[10px]">⚠ Alert ›</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-white text-xs font-mono">{walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network */}
                  <div className="bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31] flex justify-between">
                    <span className="text-gray-400 text-xs">Network</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-blue-600" />
                      <span className="text-white text-xs">{selectedNetwork === 'ERC-20' ? 'Ethereum Mainnet' : selectedNetwork === 'TRC-20' ? 'Tron Network' : 'Solana'}</span>
                    </div>
                  </div>

                  {/* Fee + Speed */}
                  <div className="bg-[#1e2025] rounded-2xl p-4 border border-[#2a2d31] space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">Network fee</span>
                        <span className="text-gray-600 text-[10px]">ⓘ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[10px]">✏</span>
                        <span className="text-white text-xs font-medium">{simFee}</span>
                        <span className="text-gray-600 text-[10px]">▼</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-xs">Speed</span>
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 text-xs">🟢 Market {simSpeed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm button area */}
                  <div className="flex gap-3 pt-2">
                    <div className="flex-1 py-3 bg-[#2a2d31] text-gray-400 font-medium rounded-full text-center text-sm">Cancel</div>
                    <div className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-full text-center text-sm flex items-center justify-center gap-1.5">
                      <Loader2 size={14} className="animate-spin" />
                      Confirm
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: Transaction Sent ── */}
              {transferSim === 5 && (
                <div className="animate-fade-in flex flex-col items-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-bounce-in">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <p className="text-white text-lg font-bold">Transaction Sent</p>
                  <p className="text-gray-500 text-xs mt-2 font-mono">{simAmount} {selectedCoin}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600 text-[10px]">→</span>
                    <span className="text-blue-400 text-[10px] font-mono">{walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}</span>
                  </div>
                  <p className="text-green-400 text-[10px] mt-3">Confirmed ✓</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ===== Step 4: 입금 확인 대기 =====
  if (step === 'step4') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('dtc_guide_step4')} showBack={false} />
      <div className="flex-1 px-6 pt-4">
        <StepProgress current={4} />

        <div className="flex flex-col items-center py-6">
          {/* Spinner */}
          <div className="relative w-24 h-24 mb-6">
            <svg className="w-24 h-24 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle cx="48" cy="48" r="42" fill="none" stroke="#1a56db" strokeWidth="4"
                strokeDasharray={264} strokeDashoffset={264 - (264 * confirms / requiredConfirmations)}
                strokeLinecap="round" transform="rotate(-90 48 48)"
                style={{ transition: 'stroke-dashoffset 0.3s' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{confirms}/{requiredConfirmations}</span>
            </div>
          </div>

          <h2 className="text-base font-bold text-text-dark mb-1">{t('triplea_wait_heading')}</h2>
          <p className="text-xs text-text-gray text-center mb-6">{t('triplea_wait_desc')}</p>

          {/* Transaction info */}
          <div className="w-full bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-text-gray">{t('triplea_wait_coin')}</span>
              <span className="text-text-dark font-medium">{selectedCoin} ({selectedNetwork})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-gray">{t('triplea_wait_confirm')}</span>
              <span className={`font-mono font-bold ${confirms >= requiredConfirmations ? 'text-green-600' : 'text-primary'}`}>
                {confirms}/{requiredConfirmations}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ===== Step 5: 완료 =====
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 px-6 pt-4">
        <StepProgress current={5} />

        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-bounce-in"><CheckCircle size={72} className="text-green-500" strokeWidth={1.5} /></div>
          <h2 className="text-xl font-bold text-text-dark mt-6 mb-1">{t('triplea_done_title')}</h2>
          <p className="text-sm text-text-gray mb-6">{t('triplea_done_msg')}</p>
          <div className="text-center mb-6"><p className="text-3xl font-bold text-primary">+ {finalAmount.toLocaleString()}{t('won')}</p></div>
          <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_coin')}</span><span className="text-text-dark">{depositAmount.toFixed(2)} {selectedCoin}</span></div>
            <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_rate')}</span><span className="text-text-dark">1 {selectedCoin} = {rate.toLocaleString()}{t('won')}</span></div>
            <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_fee')}</span><span className="text-error">- {fee.toLocaleString()}{t('won')}</span></div>
            <div className="flex justify-between font-semibold border-t border-border pt-2"><span className="text-text-dark">{t('triplea_done_final')}</span><span className="text-primary">{finalAmount.toLocaleString()}{t('won')}</span></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => navigate('/home', { replace: true })} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('triplea_done_home')}</button>
        <button onClick={() => navigate('/history')} className="w-full py-3 text-primary text-sm font-medium">{t('triplea_done_history')}</button>
      </div>
    </div>
  )
}
