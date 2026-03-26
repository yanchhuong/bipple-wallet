import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'
import { Wallet, UserPlus, Phone, Mail, ScanFace, Lock, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import { PIN_MAX_ATTEMPTS } from '../constants'

type AuthMode = 'idle' | 'pin' | 'face-scanning' | 'face-done' | 'success'

export default function Login() {
  const store = useStore()
  const { login, profile, pin, pinSet, faceIdEnabled } = store
  const navigate = useNavigate()
  const t = useT()

  const [credential, setCredential] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('idle')
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [attempts, setAttempts] = useState(0)

  // Detect if this is a returning user (has saved profile with PIN)
  const isReturning = pinSet && pin !== '' && profile.name !== '홍길동'
  const credentialType: 'phone' | 'email' | null =
    credential.includes('@') ? 'email' :
    credential.replace(/[^0-9]/g, '').length >= 8 ? 'phone' : null

  const canLogin = credentialType !== null

  const handleSocialLogin = (method: 'google' | 'apple') => {
    login(method)
    navigate('/terms')
  }

  const handleCredentialLogin = () => {
    if (!canLogin) return
    // Check if Face ID is on → go to face scan, otherwise PIN
    if (faceIdEnabled) {
      setAuthMode('face-scanning')
      // Simulate face scan (2s)
      setTimeout(() => {
        setAuthMode('face-done')
        setTimeout(() => {
          setAuthMode('success')
          login(credentialType!)
          setTimeout(() => navigate('/home', { replace: true }), 600)
        }, 800)
      }, 2000)
    } else {
      setAuthMode('pin')
    }
  }

  const handlePinKey = (key: string) => {
    if (key === 'del') {
      setPinInput(p => p.slice(0, -1))
      setPinError('')
      return
    }
    if (pinInput.length >= 6) return
    const next = pinInput + key
    setPinInput(next)

    if (next.length === 6) {
      setTimeout(() => {
        if (next === pin) {
          setAuthMode('success')
          login(credentialType!)
          toast(t('otp_success'), 'success')
          setTimeout(() => navigate('/home', { replace: true }), 600)
        } else {
          const nextAttempts = attempts + 1
          setAttempts(nextAttempts)
          setPinInput('')
          if (nextAttempts >= PIN_MAX_ATTEMPTS) {
            setPinError(`PIN locked (${PIN_MAX_ATTEMPTS}/${PIN_MAX_ATTEMPTS})`)
            setTimeout(() => { setAuthMode('idle'); setPinError(''); setAttempts(0) }, 5000)
          } else {
            setPinError(`${t('pay_pin_error')} (${nextAttempts}/${PIN_MAX_ATTEMPTS})`)
            setTimeout(() => setPinError(''), 2000)
          }
        }
      }, 200)
    }
  }

  const pinKeys = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <div className="flex-1 flex flex-col items-center px-6 pt-12 overflow-y-auto">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
          <Wallet size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark mb-1">{t('login_title')}</h1>
        <p className="text-sm text-text-gray mb-8">{t('login_subtitle')}</p>

        {/* Phone or Email Login */}
        <div className="w-full mb-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {credentialType === 'email'
                ? <Mail size={18} className="text-primary" />
                : credentialType === 'phone'
                  ? <Phone size={18} className="text-primary" />
                  : <Phone size={18} className="text-text-light" />
              }
            </div>
            <input
              type="text"
              value={credential}
              onChange={e => setCredential(e.target.value)}
              placeholder={t('login_phone') + ' / ' + t('login_email')}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {credentialType && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                  credentialType === 'phone' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {credentialType === 'phone' ? t('signup_phone') : t('signup_email')}
                </span>
              </div>
            )}
          </div>

          {/* Login button - appears when valid credential */}
          {canLogin && (
            <button
              onClick={handleCredentialLogin}
              className="w-full mt-3 flex items-center justify-center gap-2 py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark transition-all animate-fade-in"
            >
              {faceIdEnabled ? <ScanFace size={20} /> : <Lock size={18} />}
              <span>{t('login_signin')}</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-light">{t('login_or')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="w-full space-y-3 mt-2">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-white border-2 border-border rounded-xl active:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="font-medium text-text-dark">{t('login_google')}</span>
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-black text-white rounded-xl active:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <span className="font-medium">{t('login_apple')}</span>
          </button>

          {/* Sign Up */}
          <button
            onClick={() => navigate('/signup')}
            className="w-full flex items-center gap-3 px-5 py-4 bg-primary/5 border-2 border-primary/20 rounded-xl active:bg-primary/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus size={18} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium text-primary block">{t('login_signup')}</span>
              <span className="text-[10px] text-text-gray">{t('login_signup_desc')}</span>
            </div>
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-text-light px-10 pb-6">
        {t('login_agree')}
      </p>

      {/* ===== PIN Input Modal ===== */}
      <Modal open={authMode === 'pin'} onClose={() => { setAuthMode('idle'); setPinInput(''); setPinError('') }}>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Lock size={28} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-text-dark mb-1">{t('pay_pin_enter')}</h3>
          <p className="text-xs text-text-gray mb-5">{credential}</p>

          {/* PIN dots */}
          <div className="flex gap-3 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                i < pinInput.length ? 'bg-primary scale-110' : 'bg-gray-200'
              }`} />
            ))}
          </div>

          {pinError && <p className="text-error text-xs mb-3 animate-fade-in">{pinError}</p>}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-0 w-full -mx-6">
            {pinKeys.map((key, i) => (
              <button
                key={i}
                onClick={() => key && handlePinKey(key)}
                disabled={!key}
                className={`h-14 flex items-center justify-center text-xl font-medium transition-colors ${
                  key === '' ? '' : 'active:bg-gray-100 rounded-lg'
                } ${key === 'del' ? 'text-text-gray text-base' : 'text-text-dark'}`}
              >
                {key === 'del' ? t('pin_delete') : key}
              </button>
            ))}
          </div>

          {/* Switch to Face ID if available */}
          {faceIdEnabled && (
            <button onClick={() => {
              setPinInput(''); setPinError(''); setAuthMode('idle')
              setTimeout(() => handleCredentialLogin(), 100)
            }} className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
              <ScanFace size={14} /> Face ID
            </button>
          )}
        </div>
      </Modal>

      {/* ===== Face ID Modal ===== */}
      <Modal open={authMode === 'face-scanning' || authMode === 'face-done'} onClose={() => {}}>
        <div className="flex flex-col items-center py-4">
          {authMode === 'face-scanning' && (
            <>
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center mb-4 animate-pulse-slow">
                <ScanFace size={48} className="text-primary" />
              </div>
              <p className="text-base font-semibold text-text-dark">{t('kyc_face_scanning')}</p>
              <p className="text-xs text-text-gray mt-1">{credential}</p>
              <Loader2 size={20} className="text-primary animate-spin mt-4" />
            </>
          )}
          {authMode === 'face-done' && (
            <>
              <div className="w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center mb-4 animate-bounce-in">
                <ScanFace size={48} className="text-green-500" />
              </div>
              <p className="text-base font-semibold text-green-600">{t('kyc_face_done')}</p>
            </>
          )}
        </div>
      </Modal>

      {/* ===== Success Modal ===== */}
      <Modal open={authMode === 'success'} onClose={() => {}}>
        <div className="flex flex-col items-center py-4 animate-fade-in">
          <div className="animate-bounce-in">
            <CheckCircle size={56} className="text-green-500 mb-3" />
          </div>
          <p className="text-base font-bold text-text-dark">{t('login_signin')}</p>
          <p className="text-xs text-text-gray mt-1">{credential}</p>
        </div>
      </Modal>
    </div>
  )
}
