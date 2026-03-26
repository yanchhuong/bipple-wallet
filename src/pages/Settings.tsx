import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { BottomNav } from '../components/BottomNav'
import { ChevronRight, CreditCard, Coins, Lock, FileText, Info, LogOut, Globe, Bell, ScanFace, ShieldCheck, ShieldX, Palette } from 'lucide-react'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-[44px] h-[26px] rounded-full p-[2px] transition-colors flex-shrink-0 ${value ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <div
        className={`w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </button>
  )
}

const langLabels: Record<string, string> = { ko: '한국어', en: 'English', zh: '中文' }
const themeLabels: Record<string, Record<string, string>> = {
  light: { ko: '라이트', en: 'Light', zh: '浅色' },
  dark: { ko: '다크', en: 'Dark', zh: '深色' },
  system: { ko: '시스템', en: 'System', zh: '跟随系统' },
}

export default function Settings() {
  const navigate = useNavigate()
  const store = useStore()
  const { language, theme, profile, isKycComplete, userType, notificationsEnabled, setNotificationsEnabled, faceIdEnabled, setFaceIdEnabled, logout } = store
  const t = useT()
  const [logoutModal, setLogoutModal] = useState(false)

  const currentLangLabel = langLabels[language] || 'English'
  const currentThemeLabel = themeLabels[theme]?.[language] || themeLabels[theme]?.en || 'Light'

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-bg-gray">
      <div className="px-5 py-4 bg-white border-b border-border">
        <h1 className="text-lg font-bold text-text-dark">{t('settings_title')}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">

        {/* Profile Card */}
        <button
          onClick={() => navigate('/settings/profile')}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:bg-gray-50 mb-4"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold shadow-md shadow-primary/20 flex-shrink-0">
            {profile.name[0] || 'U'}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-base font-bold text-text-dark">{profile.name}</p>
            <p className="text-xs text-text-gray truncate">{profile.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {userType && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  userType === 'domestic' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {userType === 'domestic' ? t('profile_domestic') : t('profile_foreigner')}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isKycComplete ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {isKycComplete
                  ? <><ShieldCheck size={11} />{t('profile_kyc_verified')}</>
                  : <><ShieldX size={11} />{t('profile_kyc_not')}</>
                }
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-light flex-shrink-0" />
        </button>

        {/* General Section */}
        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('settings_general')}</p>
        <div className="bg-white rounded-2xl overflow-hidden mb-4">
          {/* Language — navigates to page */}
          <button onClick={() => navigate('/settings/language')} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Globe size={18} className="text-primary" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-dark">{t('settings_language')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_language_desc')}</p>
            </div>
            <span className="text-xs text-primary font-medium mr-1">{currentLangLabel}</span>
            <ChevronRight size={16} className="text-text-light" />
          </button>

          {/* Theme — navigates to page */}
          <button onClick={() => navigate('/settings/theme')} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center"><Palette size={18} className="text-violet-500" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-dark">{t('settings_theme')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_theme_desc')}</p>
            </div>
            <span className="text-xs text-primary font-medium mr-1">{currentThemeLabel}</span>
            <ChevronRight size={16} className="text-text-light" />
          </button>

          {/* Notifications Toggle */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Bell size={18} className="text-orange-500" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-dark">{t('settings_notifications')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_notifications_desc')}</p>
            </div>
            <Toggle value={notificationsEnabled} onChange={(v) => { setNotificationsEnabled(v); toast(`${t('settings_notifications')}: ${v ? t('settings_on') : t('settings_off')}`) }} />
          </div>

          {/* Terms */}
          <button onClick={() => navigate('/settings/terms')} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"><FileText size={18} className="text-text-gray" /></div>
            <div className="flex-1 text-left"><p className="text-sm font-medium text-text-dark">{t('settings_terms')}</p></div>
            <ChevronRight size={16} className="text-text-light" />
          </button>
        </div>

        {/* Security Section */}
        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('settings_security')}</p>
        <div className="bg-white rounded-2xl overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center"><ScanFace size={18} className="text-purple-500" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-dark">{t('settings_faceid')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_faceid_desc')}</p>
            </div>
            <Toggle value={faceIdEnabled} onChange={(v) => { setFaceIdEnabled(v); toast(`${t('settings_faceid')}: ${v ? t('settings_on') : t('settings_off')}`) }} />
          </div>
          <button onClick={() => navigate('/pin-setup', { state: { flow: 'reset' } })} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"><Lock size={18} className="text-text-gray" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-dark">{t('settings_pin')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_pin_desc')}</p>
            </div>
            <ChevronRight size={16} className="text-text-light" />
          </button>
        </div>

        {/* Account & Coin Management */}
        <p className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2 px-1">{t('settings_about')}</p>
        <div className="bg-white rounded-2xl overflow-hidden mb-4">
          <button onClick={() => navigate('/settings/account')} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"><CreditCard size={18} className="text-green-600" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-dark">{t('settings_account')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_account_desc')}</p>
            </div>
            <ChevronRight size={16} className="text-text-light" />
          </button>
          <button onClick={() => navigate('/settings/coins')} className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50">
            <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center"><Coins size={18} className="text-yellow-600" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-dark">{t('settings_coins')}</p>
              <p className="text-[10px] text-text-light mt-0.5">{t('settings_coins_desc')}</p>
            </div>
            <ChevronRight size={16} className="text-text-light" />
          </button>
        </div>

        {/* Version */}
        <div className="bg-white rounded-2xl overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"><Info size={18} className="text-text-gray" /></div>
              <span className="text-sm font-medium text-text-dark">{t('settings_version')}</span>
            </div>
            <span className="text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-full">{t('version_number')} {t('settings_latest')}</span>
          </div>
        </div>

        {/* Logout */}
        <button onClick={() => setLogoutModal(true)} className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 active:bg-gray-50 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><LogOut size={18} className="text-error" /></div>
          <span className="text-sm font-medium text-error">{t('settings_logout')}</span>
        </button>
      </div>

      {/* Logout Modal */}
      <Modal open={logoutModal} onClose={() => setLogoutModal(false)}>
        <h3 className="text-base font-semibold text-text-dark text-center mb-2">{t('settings_logout')}</h3>
        <p className="text-sm text-text-gray text-center mb-6">{t('settings_logout_confirm')}</p>
        <div className="flex gap-3">
          <button onClick={() => setLogoutModal(false)} className="flex-1 py-3 bg-gray-100 text-text-gray font-medium rounded-xl">{t('cancel')}</button>
          <button onClick={() => { logout(); navigate('/', { replace: true }) }} className="flex-1 py-3 bg-error text-white font-medium rounded-xl">{t('settings_logout')}</button>
        </div>
      </Modal>

      <BottomNav />
    </div>
  )
}
