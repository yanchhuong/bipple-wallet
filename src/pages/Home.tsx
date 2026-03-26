import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { BottomNav } from '../components/BottomNav'
import { AppLogo } from '../components/AppLogo'
import { Bell, CreditCard, QrCode, Landmark, ChevronRight, TrendingUp, Globe, BarChart3 } from 'lucide-react'

const sourceStyle: Record<string, { icon: typeof Globe; gradient: string; iconBg: string }> = {
  'Triple-A': { icon: Globe, gradient: 'from-green-500 to-emerald-600', iconBg: 'bg-green-500' },
  'Korbit': { icon: BarChart3, gradient: 'from-[#0052FF] to-blue-700', iconBg: 'bg-[#0052FF]' },
}

export default function Home() {
  const navigate = useNavigate()
  const { bippleMoney, coins, notifications } = useStore()
  const t = useT()
  const unread = notifications.filter(n => !n.read).length
  const totalCoinValue = coins.reduce((sum, c) => sum + c.krwValue, 0)

  // Group coins by source (Triple-A / Korbit)
  const wallets = useMemo(() => {
    const map: Record<string, { source: string; coins: typeof coins; totalKrw: number }> = {}
    for (const coin of coins) {
      if (!map[coin.source]) map[coin.source] = { source: coin.source, coins: [], totalKrw: 0 }
      map[coin.source].coins.push(coin)
      map[coin.source].totalKrw += coin.krwValue
    }
    return Object.values(map)
  }, [coins])

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray">
      <div className="flex items-center justify-between px-5 py-3 bg-white">
        <div className="flex items-center gap-2">
          <AppLogo className="h-9 w-9 shrink-0 rounded-lg" aria-hidden />
          <span className="font-bold text-text-dark">{t('app_name')}</span>
        </div>
        <button onClick={() => navigate('/notifications')} className="relative p-2">
          <Bell size={22} className="text-text-dark" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unread}</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-2">
        {/* Balance Card */}
        <div className="mx-4 mt-3 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
          <p className="text-xs text-white/70 mb-1">{t('home_balance')}</p>
          <p className="text-3xl font-bold tracking-tight">
            {bippleMoney.toLocaleString()}<span className="text-lg ml-1">{t('won')}</span>
          </p>
          <div className="flex gap-2 mt-5">
            {[
              { label: t('home_charge'), icon: TrendingUp, path: '/charge-hub' },
              { label: t('home_pay'), icon: QrCode, path: '/payment-pin' },
              { label: t('home_atm'), icon: Landmark, path: '/atm-scan' },
            ].map(btn => (
              <button key={btn.label} onClick={() => navigate(btn.path)}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 bg-white/15 rounded-xl active:bg-white/25 transition-colors">
                <btn.icon size={20} />
                <span className="text-[11px] font-medium">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallets grouped by source */}
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-dark">{t('home_coins')}</h3>
            <span className="text-xs text-text-gray">≈ {totalCoinValue.toLocaleString()}{t('won')}</span>
          </div>

          {wallets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🪙</p>
              <p className="text-sm text-text-gray">{t('home_no_coins')}</p>
              <p className="text-xs text-text-light mt-1">{t('home_no_coins_desc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map(wallet => {
                const style = sourceStyle[wallet.source] || sourceStyle['Triple-A']
                const Icon = style.icon
                return (
                  <div key={wallet.source} className="bg-white rounded-2xl overflow-hidden">
                    {/* Wallet header */}
                    <div className={`bg-gradient-to-r ${style.gradient} p-4 flex items-center gap-3`}>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        {wallet.source === 'Korbit' ? (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path d="M6 6h4.5v12H6V6z" fill="white"/>
                            <path d="M12 6l6 6-6 6V6z" fill="white"/>
                          </svg>
                        ) : (
                          <Icon size={20} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{wallet.source}</p>
                        <p className="text-white/70 text-xs">{wallet.coins.length} {t('asset_count')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">≈ {wallet.totalKrw.toLocaleString()}</p>
                        <p className="text-white/60 text-[10px]">{t('won')}</p>
                      </div>
                    </div>

                    {/* Individual coins inside */}
                    {wallet.coins.map((coin, i) => (
                      <button
                        key={coin.id}
                        onClick={() => navigate(`/coin/${coin.id}`)}
                        className={`w-full flex items-center px-4 py-3 active:bg-gray-50 ${
                          i < wallet.coins.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-text-dark">{coin.name}</p>
                          <p className="text-[10px] text-text-gray mt-0.5">
                            {coin.balance.toFixed(coin.symbol === 'BTC' ? 4 : 2)} {coin.symbol}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-text-dark mr-2">
                          ≈ {coin.krwValue.toLocaleString()}{t('won')}
                        </p>
                        <ChevronRight size={14} className="text-text-light" />
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl p-4">
          <div className="flex gap-3">
            <button onClick={() => navigate('/history')}
              className="flex-1 flex items-center gap-2 py-3 px-4 bg-gray-50 rounded-xl active:bg-gray-100">
              <CreditCard size={18} className="text-text-gray" />
              <span className="text-xs font-medium text-text-dark">{t('home_usage')}</span>
            </button>
            <button onClick={() => navigate('/charge-hub')}
              className="flex-1 flex items-center gap-2 py-3 px-4 bg-primary/5 rounded-xl active:bg-primary/10">
              <TrendingUp size={18} className="text-primary" />
              <span className="text-xs font-medium text-primary">{t('home_charge_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
