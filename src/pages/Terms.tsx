import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Check, ChevronDown, ChevronUp, User } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'

interface TermItem {
  id: string
  label: string
  required: boolean
  content: string
}

const loginIcons: Record<string, string> = {
  google: '🔵',
  apple: '⚫',
  korbit: '🟦',
  email: '✉️',
  phone: '📱',
}

export default function Terms() {
  const navigate = useNavigate()
  const { profile, loginMethod, userType } = useStore()
  const t = useT()

  const loginLabel = loginMethod === 'google' ? t('terms_login_google')
    : loginMethod === 'apple' ? t('terms_login_apple')
    : loginMethod === 'korbit' ? t('terms_login_korbit')
    : loginMethod === 'email' ? t('terms_login_email')
    : loginMethod === 'phone' ? t('terms_login_phone')
    : ''

  const terms: TermItem[] = [
    { id: 'service', label: t('terms_service'), required: true, content: t('terms_service_content') },
    { id: 'privacy', label: t('terms_privacy_collect'), required: true, content: t('terms_privacy_content') },
    { id: 'marketing', label: t('terms_marketing'), required: false, content: t('terms_marketing_content') },
  ]

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const allChecked = terms.every(item => checked.has(item.id))
  const requiredChecked = terms.filter(item => item.required).every(item => checked.has(item.id))

  const toggleAll = () => {
    setChecked(allChecked ? new Set() : new Set(terms.map(item => item.id)))
  }

  const toggle = (id: string) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id); else next.add(id)
    setChecked(next)
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id); else next.add(id)
    setExpanded(next)
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('terms_title')} showBack={true} />

      <div className="flex-1 px-6 pt-4 overflow-y-auto">
        <StepIndicator current={userType === 'foreigner' ? 2 : 3} />

        {/* Login info card */}
        {loginMethod && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl mb-5 border border-primary/10">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {loginMethod === 'korbit' ? (
                <div className="w-7 h-7 rounded-md bg-[#0052FF] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <path d="M6 6h4.5v12H6V6z" fill="white"/>
                    <path d="M12 6l6 6-6 6V6z" fill="white"/>
                  </svg>
                </div>
              ) : loginMethod === 'google' ? (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              ) : loginMethod === 'apple' ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#1f2937">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              ) : (
                <User size={20} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-dark">{profile.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">{loginLabel}</span>
                <span className="text-[10px] text-text-light">{t('terms_login_info')}</span>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-text-dark whitespace-pre-line">{t('terms_heading')}</h2>
        <p className="text-xs text-text-gray mt-1 mb-6">{t('terms_desc')}</p>

        {/* All agree */}
        <button
          onClick={toggleAll}
          className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 mb-4 transition-all ${
            allChecked ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            allChecked ? 'bg-primary' : 'bg-gray-200'
          }`}>
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
          <span className="font-semibold text-text-dark">{t('terms_all')}</span>
        </button>

        {/* Individual terms */}
        <div className="space-y-2">
          {terms.map(term => (
            <div key={term.id} className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <button
                  onClick={() => toggle(term.id)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    checked.has(term.id) ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </button>
                <button onClick={() => toggle(term.id)} className="flex-1 text-left">
                  <span className={`text-xs font-medium ${term.required ? 'text-primary' : 'text-text-gray'}`}>
                    [{term.required ? t('terms_required') : t('terms_optional')}]
                  </span>
                  <span className="text-sm text-text-dark ml-1">{term.label}</span>
                </button>
                <button onClick={() => toggleExpand(term.id)} className="p-1">
                  {expanded.has(term.id) ? <ChevronUp size={16} className="text-text-gray" /> : <ChevronDown size={16} className="text-text-gray" />}
                </button>
              </div>
              {expanded.has(term.id) && (
                <div className="px-4 pb-3 animate-fade-in">
                  <div className="bg-gray-50 rounded-lg p-3 max-h-28 overflow-y-auto text-xs text-text-gray leading-relaxed whitespace-pre-wrap">
                    {term.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => navigate('/pin-setup', { state: { flow: 'signup' } })}
          disabled={!requiredChecked}
          className={`w-full py-4 font-semibold rounded-xl transition-all ${
            requiredChecked
              ? 'bg-primary text-white active:bg-primary-dark'
              : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}
        >
          {t('terms_agree_continue')}
        </button>
      </div>
    </div>
  )
}
