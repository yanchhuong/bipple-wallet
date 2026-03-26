import { useState } from 'react'
import { useStore, type CoinAsset } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { BottomSheet } from '../components/BottomSheet'
import { toast } from '../components/Toast'
import { Plus, ChevronRight, Check, Loader2, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Step = 'list' | 'exchange' | 'coin' | 'terms' | 'api' | 'verifying' | 'success' | 'fail'

const exchanges = [
  { id: 'upbit', name: 'Upbit', icon: 'U', color: 'bg-blue-600' },
  { id: 'korbit', name: 'Korbit', icon: 'K', color: 'bg-blue-500' },
  { id: 'triplea', name: 'Triple-A', icon: 'T', color: 'bg-green-600' },
  { id: 'binance', name: 'Binance', icon: 'B', color: 'bg-yellow-500' },
]

const availableCoins = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'B', color: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'E', color: 'bg-purple-500' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'U', color: 'bg-blue-500' },
  { symbol: 'USDT', name: 'Tether', icon: 'T', color: 'bg-green-500' },
  { symbol: 'XRP', name: 'Ripple', icon: 'X', color: 'bg-gray-600' },
  { symbol: 'SOL', name: 'Solana', icon: 'S', color: 'bg-violet-500' },
]

export default function SettingsCoins() {
  const navigate = useNavigate()
  const { coins, disconnectCoin, addCoin } = useStore()
  const t = useT()

  const [step, setStep] = useState<Step>('list')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const confirmCoin = coins.find(c => c.id === confirmId)
  const detailCoin = coins.find(c => c.id === detailId)

  // Registration flow state
  const [selExchange, setSelExchange] = useState('')
  const [selCoin, setSelCoin] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [termsAll, setTermsAll] = useState(false)
  const [termsRequired, setTermsRequired] = useState(false)
  const [termsMarketing, setTermsMarketing] = useState(false)

  const handleDisconnect = () => {
    if (confirmId) { disconnectCoin(confirmId); setConfirmId(null); toast(t('settings_coins_disconnected')) }
  }

  const startRegister = () => {
    setSelExchange(''); setSelCoin(''); setAccessKey(''); setSecretKey(''); setShowSecret(false)
    setTermsAll(false); setTermsRequired(false); setTermsMarketing(false)
    setStep('exchange')
  }

  const handleTermsAll = () => {
    const next = !termsAll
    setTermsAll(next)
    setTermsRequired(next)
    setTermsMarketing(next)
  }

  const handleRegister = () => {
    setStep('verifying')
    setTimeout(() => {
      // Simulate: 20% chance of API key validation failure
      if (Math.random() < 0.2) {
        setStep('fail')
        return
      }
      const exchange = exchanges.find(e => e.id === selExchange)
      const coin = availableCoins.find(c => c.symbol === selCoin)
      if (exchange && coin) {
        const newCoin: CoinAsset = {
          id: String(Date.now()),
          symbol: coin.symbol,
          name: coin.name,
          balance: Math.random() * 10,
          unit: coin.symbol,
          source: exchange.name,
          krwValue: Math.floor(Math.random() * 500000),
          rate: coin.symbol === 'BTC' ? 82500000 : coin.symbol === 'ETH' ? 2400000 : 1350,
        }
        addCoin(newCoin)
      }
      setStep('success')
    }, 2000)
  }

  const coinColor = (sym: string) =>
    sym === 'USDC' ? 'bg-blue-500' : sym === 'ETH' ? 'bg-purple-500' : sym === 'BTC' ? 'bg-orange-500' :
    sym === 'USDT' ? 'bg-green-500' : sym === 'XRP' ? 'bg-gray-600' : sym === 'SOL' ? 'bg-violet-500' : 'bg-gray-500'

  // === Registration: Exchange Select ===
  if (step === 'exchange') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('coin_register_title')} onBack={() => setStep('list')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('coin_register_exchange')}</h2>
        <p className="text-xs text-text-gray mb-5">{t('coin_register_exchange_desc')}</p>
        <div className="space-y-2">
          {exchanges.map(ex => (
            <button key={ex.id} onClick={() => setSelExchange(ex.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selExchange === ex.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className={`w-10 h-10 rounded-full ${ex.color} text-white font-bold text-sm flex items-center justify-center`}>{ex.icon}</div>
              <span className="font-semibold text-sm text-text-dark flex-1 text-left">{ex.name}</span>
              {selExchange === ex.id && <Check size={18} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('coin')} disabled={!selExchange}
          className={`w-full py-4 font-semibold rounded-xl ${selExchange ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Registration: Coin Select ===
  if (step === 'coin') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('coin_register_title')} onBack={() => setStep('exchange')} />
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('coin_register_coin_select')}</h2>
        <p className="text-xs text-text-gray mb-5">{t('coin_register_coin_desc')}</p>
        <div className="space-y-2">
          {availableCoins.map(c => {
            const already = coins.some(ec => ec.symbol === c.symbol && ec.source === exchanges.find(e => e.id === selExchange)?.name)
            return (
              <button key={c.symbol} onClick={() => !already && setSelCoin(c.symbol)} disabled={already}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  already ? 'border-border opacity-40 cursor-not-allowed' :
                  selCoin === c.symbol ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                <div className={`w-10 h-10 rounded-full ${c.color} text-white font-bold text-sm flex items-center justify-center`}>{c.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-text-dark">{c.name}</p>
                  <p className="text-xs text-text-gray">{c.symbol}</p>
                </div>
                {already && <span className="text-[10px] text-text-light bg-gray-100 px-2 py-0.5 rounded-full">{t('coin_connected')}</span>}
                {selCoin === c.symbol && !already && <Check size={18} className="text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('terms')} disabled={!selCoin}
          className={`w-full py-4 font-semibold rounded-xl ${selCoin ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>{t('next')}</button>
      </div>
    </div>
  )

  // === Registration: Terms Agreement ===
  if (step === 'terms') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('coin_register_title')} onBack={() => setStep('coin')} />
      <div className="flex-1 px-6 pt-6">
        <h2 className="text-base font-semibold text-text-dark mb-1">{t('settings_account_terms')}</h2>
        <p className="text-xs text-text-gray mb-5">{t('terms_desc')}</p>

        {/* Agree All */}
        <label className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl cursor-pointer mb-3 border-2 border-primary/20">
          <button onClick={handleTermsAll}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${termsAll ? 'bg-primary' : 'bg-gray-200'}`}>
            {termsAll && <Check size={12} className="text-white" strokeWidth={3} />}
          </button>
          <span className="text-sm font-semibold text-text-dark">{t('terms_all')}</span>
        </label>

        <div className="space-y-2">
          {/* Required: 3rd party info */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <button onClick={() => { setTermsRequired(!termsRequired); if (termsRequired) setTermsAll(false); else if (termsMarketing) setTermsAll(true) }}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${termsRequired ? 'bg-primary' : 'bg-gray-200'}`}>
              {termsRequired && <Check size={12} className="text-white" strokeWidth={3} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-error bg-red-50 px-1.5 py-0.5 rounded">{t('terms_required')}</span>
                <span className="text-sm text-text-dark">{t('terms_privacy_collect')}</span>
              </div>
            </div>
          </label>

          {/* Optional: Marketing */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <button onClick={() => { setTermsMarketing(!termsMarketing); if (termsMarketing) setTermsAll(false); else if (termsRequired) setTermsAll(true) }}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${termsMarketing ? 'bg-primary' : 'bg-gray-200'}`}>
              {termsMarketing && <Check size={12} className="text-white" strokeWidth={3} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-text-light bg-gray-100 px-1.5 py-0.5 rounded">{t('terms_optional')}</span>
                <span className="text-sm text-text-dark">{t('terms_marketing')}</span>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={() => setStep('api')} disabled={!termsRequired}
          className={`w-full py-4 font-semibold rounded-xl ${termsRequired ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('next')}
        </button>
      </div>
    </div>
  )

  // === Registration: API Key ===
  if (step === 'api') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('coin_register_api_title')} onBack={() => setStep('coin')} />
      <div className="flex-1 px-6 pt-6">
        <div className="flex items-center gap-3 mb-5 bg-gray-50 rounded-xl p-3">
          <div className={`w-8 h-8 rounded-full ${exchanges.find(e => e.id === selExchange)?.color} text-white font-bold text-xs flex items-center justify-center`}>
            {exchanges.find(e => e.id === selExchange)?.icon}
          </div>
          <span className="text-sm font-medium text-text-dark">{exchanges.find(e => e.id === selExchange)?.name}</span>
          <span className="text-xs text-text-light">·</span>
          <span className="text-sm font-medium text-text-dark">{selCoin}</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('coin_register_access_key')}</label>
            <input type="text" value={accessKey} onChange={e => setAccessKey(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('coin_register_secret_key')}</label>
            <div className="relative">
              <input type={showSecret ? 'text' : 'password'} value={secretKey} onChange={e => setSecretKey(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
                className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 pr-12" />
              <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {showSecret ? <EyeOff size={18} className="text-text-gray" /> : <Eye size={18} className="text-text-gray" />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-text-gray mt-4 leading-relaxed">{t('coin_register_api_desc')}</p>
        <button className="text-xs text-primary font-medium mt-2">{t('coin_register_api_help')} →</button>
      </div>
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleRegister} disabled={!accessKey || !secretKey}
          className={`w-full py-4 font-semibold rounded-xl ${accessKey && secretKey ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'}`}>
          {t('coin_register_btn')}
        </button>
      </div>
    </div>
  )

  // === Verifying ===
  if (step === 'verifying') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin mb-4" />
      <p className="text-sm text-text-gray">{t('coin_register_verifying')}</p>
    </div>
  )

  // === Success ===
  if (step === 'success') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><CheckCircle size={64} className="text-green-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('coin_register_success')}</p>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 w-full">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${coinColor(selCoin)} text-white font-bold text-sm flex items-center justify-center`}>{selCoin[0]}</div>
            <div><p className="font-semibold text-sm text-text-dark">{selCoin}</p><p className="text-xs text-text-gray">{exchanges.find(e => e.id === selExchange)?.name}</p></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <button onClick={() => setStep('list')} className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('confirm')}</button>
      </div>
    </div>
  )

  // === Registration: Failed ===
  if (step === 'fail') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in"><XCircle size={64} className="text-red-500" /></div>
        <p className="text-lg font-bold text-text-dark mt-4">{t('coin_register_fail')}</p>
        <p className="text-sm text-text-gray mt-2 text-center">{t('coin_register_api_desc')}</p>
        <div className="mt-4 bg-red-50 rounded-xl p-4 w-full">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${exchanges.find(e => e.id === selExchange)?.color} text-white font-bold text-sm flex items-center justify-center`}>
              {exchanges.find(e => e.id === selExchange)?.icon}
            </div>
            <div>
              <p className="font-semibold text-sm text-text-dark">{exchanges.find(e => e.id === selExchange)?.name} · {selCoin}</p>
              <p className="text-xs text-red-500 mt-0.5">{t('api_key_fail')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => { setAccessKey(''); setSecretKey(''); setStep('api') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">{t('retry')}</button>
        <button onClick={() => setStep('list')}
          className="w-full py-3 text-text-gray text-sm font-medium">{t('cancel')}</button>
      </div>
    </div>
  )

  // === Main List ===
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

                {/* Expanded detail */}
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

      {/* Disconnect Confirm */}
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
