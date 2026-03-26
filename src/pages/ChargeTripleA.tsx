import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useT } from '../hooks/useT'
import { AlertTriangle, Copy, Clock, RefreshCw, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from '../components/Toast'

type Step = 'coin' | 'network' | 'address' | 'waiting' | 'done'
type TripleAWaitStepStatus = 'done' | 'active' | 'pending'

export default function ChargeTripleA() {
  const navigate = useNavigate()
  const t = useT()
  const [step, setStep] = useState<Step>('coin')
  const [selectedCoin, setSelectedCoin] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [confirms, setConfirms] = useState(0)

  const requiredConfirmations = 30

  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

  const startWaiting = () => {
    setStep('waiting')
    setConfirms(0)
    const iv = setInterval(() => {
      setConfirms(c => {
        if (c >= requiredConfirmations) return c
        const next = c + 1
        if (next >= requiredConfirmations) {
          clearInterval(iv)
          setTimeout(() => setStep('done'), 500)
          return requiredConfirmations
        }
        return next
      })
    }, 400)
  }

  if (step === 'coin') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('triplea_coin_title')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('triplea_coin_heading')}</h2>
        <p className="text-xs text-text-gray mb-6">{t('triplea_coin_desc')}</p>
        <div className="space-y-3">
          {[{ id: 'USDT', name: 'Tether', color: 'bg-green-500' }, { id: 'USDC', name: 'USD Coin', color: 'bg-blue-500' }].map(coin => (
            <button key={coin.id} onClick={() => setSelectedCoin(coin.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedCoin === coin.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className={`w-10 h-10 rounded-full ${coin.color} text-white font-bold text-sm flex items-center justify-center`}>{coin.id[0]}</div>
              <div className="text-left"><p className="font-semibold text-text-dark">{coin.id}</p><p className="text-xs text-text-gray">{coin.name}</p></div>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-text-gray mt-4 px-1">{t('triplea_coin_notice')}</p>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('network')} disabled={!selectedCoin}
          className={`w-full py-4 font-semibold rounded-xl ${selectedCoin ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  if (step === 'network') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('triplea_net_title')} onBack={() => setStep('coin')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('triplea_net_heading')}</h2>
        <p className="text-xs text-text-gray mb-4">{t('triplea_net_desc')}</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex gap-2">
          <AlertTriangle size={16} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-error leading-relaxed">{t('triplea_net_warning')}</p>
        </div>
        <div className="space-y-2">
          {[{ id: 'ERC-20', name: 'Ethereum Network', note: t('triplea_net_fee_high') },
            { id: 'TRC-20', name: 'Tron Network', note: t('triplea_net_fee_low') },
            { id: 'Solana', name: 'Solana Network', note: t('triplea_net_fast') }].map(net => (
            <button key={net.id} onClick={() => setSelectedNetwork(net.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedNetwork === net.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className="text-left"><p className="font-semibold text-sm text-text-dark">{net.id}</p><p className="text-xs text-text-gray">{net.name} ({net.note})</p></div>
              <div className={`w-5 h-5 rounded-full border-2 ${selectedNetwork === net.id ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center`}>
                {selectedNetwork === net.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('address')} disabled={!selectedNetwork}
          className={`w-full py-4 font-semibold rounded-xl ${selectedNetwork ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  if (step === 'address') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={`${selectedCoin} ${t('triplea_addr_title')}`} onBack={() => setStep('network')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="flex justify-center mb-5">
          <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-border">
            <div className="grid grid-cols-5 gap-1.5 p-4">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-white'}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-text-gray mb-2">{t('triplea_addr_address')}</p>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 mb-3">
          <p className="flex-1 text-xs text-text-dark font-mono break-all">{walletAddress}</p>
          <button onClick={() => { navigator.clipboard?.writeText(walletAddress); toast(t('triplea_addr_copy')) }}
            className="p-2 bg-white rounded-lg border border-border active:bg-gray-100 flex-shrink-0">
            <Copy size={16} className="text-text-gray" />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-3 mb-4">
          <Clock size={16} className="text-warning flex-shrink-0" />
          <p className="text-xs text-warning font-medium">{t('triplea_addr_timer')}: 29:58 {t('triplea_addr_remaining')}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 space-y-1.5">
          <p className="text-[11px] text-error leading-relaxed">• <strong>{selectedNetwork}</strong> {t('triplea_addr_warn1')}</p>
          <p className="text-[11px] text-error leading-relaxed">• {t('triplea_addr_warn2')}</p>
          <p className="text-[11px] text-error leading-relaxed">• {t('triplea_addr_warn3')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={startWaiting} className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark">{t('triplea_addr_check')}</button>
      </div>
    </div>
  )

  if (step === 'waiting') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('triplea_wait_title')} showBack={false} />
      <div className="flex-1 px-6 pt-6">
        {(() => {
          const depositStatus: TripleAWaitStepStatus =
            confirms >= requiredConfirmations ? 'done' : 'active'

          const isCompleted = confirms >= requiredConfirmations
          const exchangeStatus: TripleAWaitStepStatus = isCompleted ? 'done' : 'pending'
          const completeStatus: TripleAWaitStepStatus = isCompleted ? 'done' : 'pending'

          const wavyUnderlineStyle = {
            textDecorationLine: 'underline',
            textDecorationStyle: 'wavy',
            textDecorationColor: '#dc2626',
            textUnderlineOffset: '4px',
          } as const

          const timeline = [
            {
              id: 'transfer' as const,
              title: t('triplea_wait_step_transfer_title'),
              desc: t('triplea_wait_step_transfer_desc'),
              status: 'done' as const,
              markerColor: 'bg-green-600',
              titleColor: 'text-green-700',
            },
            {
              id: 'network' as const,
              title: t('triplea_wait_step_network_title'),
              desc: t('triplea_wait_step_network_desc'),
              status: 'done' as const,
              markerColor: 'bg-blue-500',
              titleColor: 'text-blue-700',
            },
            {
              id: 'deposit' as const,
              title: t('triplea_wait_step_deposit_title'),
              status: depositStatus,
            },
            {
              id: 'exchange' as const,
              title: t('triplea_wait_step_exchange_title'),
              desc: t('triplea_wait_step_exchange_desc'),
              status: exchangeStatus,
              markerColor: 'bg-primary/10',
              titleColor: 'text-text-gray',
            },
            {
              id: 'complete' as const,
              title: t('triplea_wait_step_complete_title'),
              desc: t('triplea_wait_step_complete_desc'),
              status: completeStatus,
              markerColor: 'bg-primary/10',
              titleColor: 'text-text-gray',
            },
          ]

          return (
            <div className="relative pl-8">
              <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-border" />
              <div className="space-y-8">
                {timeline.map(item => {
                  const isActive = item.id === 'deposit' && item.status === 'active'
                  const isDepositDone = item.id === 'deposit' && item.status === 'done'

                  let markerClass =
                    'w-9 h-9 rounded-xl border-2 bg-gray-100 border-border'
                  if (item.id === 'transfer' || item.id === 'network') {
                    markerClass = `w-9 h-9 rounded-xl border-2 border-transparent ${item.markerColor}`
                  } else if (isActive) {
                    markerClass = 'w-9 h-9 rounded-xl border-2 border-error bg-gray-100 flex items-center justify-center'
                  } else if (isDepositDone) {
                    markerClass = 'w-9 h-9 rounded-xl border-2 border-transparent bg-green-600'
                  } else if (item.status === 'done') {
                    markerClass = 'w-9 h-9 rounded-xl border-2 border-transparent bg-green-600'
                  } else {
                    markerClass = 'w-9 h-9 rounded-xl border-2 bg-gray-100 border-border'
                  }

                  const titleClass =
                    item.id === 'transfer'
                      ? `text-base font-semibold ${item.titleColor}`
                      : item.id === 'network'
                        ? `text-base font-semibold ${item.titleColor}`
                        : 'text-base font-semibold text-text-gray'

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-8 flex justify-center pt-0.5">
                        <div className={markerClass}>
                          {isActive ? (
                            <Loader2
                              size={18}
                              className="text-error animate-spin"
                              style={{ animationDuration: '2s' }}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={titleClass}>{item.title}</p>
                        {item.id === 'deposit' ? (
                          <p className="text-xs text-text-gray leading-relaxed mt-1">
                            <span className="text-error font-medium" style={wavyUnderlineStyle}>
                              {t('triplea_wait_step_deposit_check')} ({confirms}/{requiredConfirmations})
                            </span>
                          </p>
                        ) : (
                          <p className="text-xs text-text-gray leading-relaxed mt-1">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                className="mt-8 flex items-center justify-center gap-2 text-sm text-primary"
                onClick={startWaiting}
              >
                <RefreshCw size={14} />
                <span>{t('triplea_wait_refresh')}</span>
              </button>
            </div>
          )
        })()}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={72} className="text-green-500" strokeWidth={1.5} /></div>
        <h2 className="text-xl font-bold text-text-dark mt-6 mb-1">{t('triplea_done_title')}</h2>
        <p className="text-sm text-text-gray mb-6">{t('triplea_done_msg')}</p>
        <div className="text-center mb-6"><p className="text-3xl font-bold text-primary">+ 132,500{t('won')}</p></div>
        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_coin')}</span><span className="text-text-dark">100.00 {selectedCoin}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_rate')}</span><span className="text-text-dark">1 {selectedCoin} = 1,338.50{t('won')}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('triplea_done_fee')}</span><span className="text-error">- 1,350{t('won')}</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-2"><span className="text-text-dark">{t('triplea_done_final')}</span><span className="text-primary">132,500{t('won')}</span></div>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => navigate('/home', { replace: true })} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('triplea_done_home')}</button>
        <button onClick={() => navigate('/history')} className="w-full py-3 text-primary text-sm font-medium">{t('triplea_done_history')}</button>
      </div>
    </div>
  )
}
