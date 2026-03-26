import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { User, Phone, Mail, ChevronRight } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'

export default function SignUp() {
  const navigate = useNavigate()
  const { login, updateProfile } = useStore()
  const t = useT()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const infoValid = fullName.trim().length >= 2 && phone.trim().length >= 8 && email.includes('@')

  const handleSubmit = () => {
    if (!fullName.trim()) { toast(t('signup_name_required'), 'error'); return }
    if (!phone.trim()) { toast(t('signup_phone_required'), 'error'); return }
    if (!email.trim()) { toast(t('signup_email_required'), 'error'); return }
    updateProfile({ name: fullName.trim(), phone: phone.trim(), email: email.trim() })
    login('email')
    navigate('/terms')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('signup_title')} />

      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <StepIndicator current={1} />

        <h2 className="text-lg font-bold text-text-dark whitespace-pre-line">{t('signup_heading')}</h2>
        <p className="text-xs text-text-gray mt-1 mb-6">{t('signup_desc')}</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <User size={13} /> {t('signup_fullname')}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={t('signup_fullname_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Phone size={13} /> {t('signup_phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('signup_phone_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Mail size={13} /> {t('signup_email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('signup_email_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleSubmit}
          disabled={!infoValid}
          className={`w-full py-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
            infoValid ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light cursor-not-allowed'
          }`}
        >
          {t('signup_next')} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
