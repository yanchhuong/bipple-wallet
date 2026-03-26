import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Loader2, ExternalLink } from 'lucide-react'

type Step = 'connect' | 'connecting' | 'select' | 'confirm'

const korbitAssets = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.042, rate: 82500000 },
  { symbol: 'ETH', name: 'Ethereum', balance: 1.52, rate: 2400000 },
  { symbol: 'XRP', name: 'Ripple', balance: 5000, rate: 680 },
]

export default function ChargeKorbit() {
  const navigate = useNavigate()
  const { korbitConnected, connectKorbit } = useStore()
  const t = useT()
  const [step, setStep] = useState<Step>(korbitConnected ? 'select' : 'connect')
  const [asset, setAsset] = useState(korbitAssets[0])
  const [qty, setQty] = useState('')
  const numQty = parseFloat(qty || '0')
  const estimatedKrw = Math.floor(numQty * asset.rate)

  useEffect(() => {
    if (step !== 'connecting') return
    const timeoutId = window.setTimeout(() => {
      connectKorbit()
      setStep('select')
    }, 2000)
    return () => window.clearTimeout(timeoutId)
  }, [connectKorbit, step])

  if (step === 'connect') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_connect_title')} />
      <div className="flex-1 px-6 pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center"><span className="text-white text-2xl font-bold">K</span></div>
        </div>
        <h2 className="text-center text-lg font-bold text-text-dark mb-2">{t('korbit_connect_heading')}</h2>
        <p className="text-center text-sm text-text-gray mb-6 whitespace-pre-line">{t('korbit_connect_desc')}</p>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-text-gray">
          <p>• {t('korbit_connect_note1')}</p>
          <p>• {t('korbit_connect_note2')}</p>
          <p>• {t('korbit_connect_note3')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('connecting')} className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <ExternalLink size={18} />{t('korbit_connect_btn')}
        </button>
      </div>
    </div>
  )

  if (step === 'connecting') {
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-sm text-text-gray">{t('korbit_connecting')}</p>
        <p className="text-xs text-text-light mt-1">{t('korbit_connecting_sub')}</p>
      </div>
    )
  }

  if (step === 'select') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_select_title')} />
      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <p className="text-xs text-text-gray mb-3">{t('korbit_select_asset')}</p>
        <div className="space-y-2 mb-6">
          {korbitAssets.map(a => (
            <button key={a.symbol} onClick={() => setAsset(a)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${asset.symbol === a.symbol ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${a.symbol === 'BTC' ? 'bg-orange-500' : a.symbol === 'ETH' ? 'bg-purple-500' : 'bg-gray-500'}`}>{a.symbol[0]}</div>
              <div className="text-left flex-1"><p className="font-semibold text-sm text-text-dark">{a.name} ({a.symbol})</p><p className="text-xs text-text-gray">{t('charge_coin_held')}: {a.balance} {a.symbol}</p></div>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-gray mb-2">{t('korbit_select_qty')}</p>
        <div className="flex items-center gap-2 mb-2">
          <input type="text" value={qty} onChange={e => setQty(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0"
            className="flex-1 text-right text-xl font-bold py-3 border-b-2 border-primary focus:outline-none" />
          <span className="text-sm text-text-gray font-medium">{asset.symbol}</span>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-xs text-text-light">{t('korbit_select_available')}: {asset.balance} {asset.symbol}</p>
          <button onClick={() => setQty(String(asset.balance))} className="text-xs text-primary font-medium">{t('korbit_select_max')}</button>
        </div>
        {numQty > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex justify-between text-sm"><span className="text-text-gray">{t('korbit_select_estimate')}</span><span className="text-primary font-bold">≈ {estimatedKrw.toLocaleString()} {t('won')}</span></div>
            <p className="text-[10px] text-text-light mt-1">{t('korbit_select_notice')}</p>
          </div>
        )}
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('confirm')} disabled={numQty <= 0}
          className={`w-full py-4 font-semibold rounded-xl ${numQty > 0 ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('korbit_select_next')}</button>
      </div>
    </div>
  )

  if (step === 'confirm') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('korbit_confirm_title')} onBack={() => setStep('select')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-5">{t('korbit_confirm_heading')}</h2>
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_asset')}</span><span className="text-text-dark font-medium">{asset.symbol} ({asset.name})</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_qty')}</span><span className="text-text-dark font-medium">{numQty} {asset.symbol}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">{t('korbit_confirm_price')}</span><span className="text-text-dark">{asset.rate.toLocaleString()} KRW</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-3"><span className="text-text-dark">{t('korbit_confirm_amount')}</span><span className="text-primary">{estimatedKrw.toLocaleString()} {t('won')}</span></div>
        </div>
        <div className="mt-4 bg-yellow-50 rounded-xl p-3">
          <p className="text-[11px] text-yellow-700 leading-relaxed whitespace-pre-line">{t('korbit_confirm_agree')}</p>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => navigate('/charge-korbit-processing', {
            state: {
              asset,
              qty: numQty,
              estimatedKrw,
            }
          })}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl"
        >
          {t('korbit_confirm_btn')}
        </button>
      </div>
    </div>
  )
}
