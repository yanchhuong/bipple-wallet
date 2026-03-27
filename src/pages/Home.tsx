import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { AppLogo } from '../components/AppLogo'
import { BottomNav } from '../components/BottomNav'
import { Bell, CreditCard, QrCode, Landmark, TrendingUp, BarChart3, Plus } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const { bippleMoney, notifications, bankAccounts, korbitConnected } = useStore()
  const t = useT()
  const unread = notifications.filter(n => !n.read).length

  const isNewUser = bankAccounts.length === 0 && !korbitConnected

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray">
      <div className="flex items-center justify-between px-5 py-3 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white border border-border/60 flex items-center justify-center overflow-hidden shadow-sm">
            <AppLogo size={36} />
          </div>
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
                className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/15 active:bg-white/25 transition-colors">
                <btn.icon size={20} />
                <span className="text-[11px] font-medium">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Setup cards for new users */}
        {isNewUser && (
          <div className="mx-4 mt-4 space-y-3">
            <button onClick={() => navigate('/settings/account')}
              className="w-full bg-white rounded-2xl p-5 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Landmark size={24} className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-dark">{t('home_setup_bank')}</p>
                  <p className="text-xs text-text-gray mt-0.5">{t('home_setup_bank_desc')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus size={16} className="text-primary" />
                </div>
              </div>
            </button>

            <button onClick={() => navigate('/charge-korbit')}
              className="w-full bg-white rounded-2xl p-5 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center">
                  <BarChart3 size={24} className="text-[#0052FF]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-dark">{t('home_setup_korbit')}</p>
                  <p className="text-xs text-text-gray mt-0.5">{t('home_setup_korbit_desc')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                  <Plus size={16} className="text-[#0052FF]" />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Event Banners - stacked */}
        <div className="mx-4 mt-4 space-y-2">
          <div className="rounded-2xl p-4 bg-gradient-to-r from-green-100 to-green-50 relative overflow-hidden">
            <span className="text-[10px] font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full">{t('banner_new_service')}</span>
            <p className="text-sm font-bold text-text-dark mt-2 whitespace-pre-line leading-snug">{t('banner_new_service_title')}</p>
            <div className="absolute right-3 bottom-2 text-3xl">💰</div>
          </div>

          <button onClick={() => navigate('/settings/account')}
            className="w-full rounded-2xl p-4 bg-gradient-to-r from-blue-100 to-blue-50 relative overflow-hidden text-left">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">{t('banner_event')}</span>
            <p className="text-sm font-bold text-text-dark mt-2 whitespace-pre-line leading-snug">{t('banner_register_title')}</p>
            <div className="absolute right-3 bottom-2 bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-primary">{t('banner_register_reward')}</span>
            </div>
          </button>

          <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-100 to-amber-50 relative overflow-hidden">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">{t('banner_event')}</span>
            <p className="text-sm font-bold text-text-dark mt-2 whitespace-pre-line leading-snug">{t('banner_sns_title')}</p>
            <div className="absolute right-3 bottom-2 text-3xl">☕</div>
          </div>
        </div>

        {/* Quick actions - only for existing users */}
        {!isNewUser && (
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
        )}
      </div>

      <BottomNav />
    </div>
  )
}
