import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { StepIndicator } from '../components/StepIndicator'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { User, Phone, Mail, ChevronRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

type OtpTarget = 'phone' | 'email' | null
type OtpStep = 'idle' | 'sending' | 'input' | 'verifying' | 'done'

export default function SignUp() {
  const navigate = useNavigate()
  const { login, updateProfile } = useStore()
  const t = useT()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  // OTP modal state
  const [otpTarget, setOtpTarget] = useState<OtpTarget>(null)
  const [otpStep, setOtpStep] = useState<OtpStep>('idle')
  const [otpCode, setOtpCode] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpTimer, setOtpTimer] = useState(180)

  const infoValid = fullName.trim().length >= 2
    && phone.trim().length >= 8
    && email.includes('@')

  // OTP countdown timer
  useEffect(() => {
    if (otpStep !== 'input') return
    if (otpTimer <= 0) return
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [otpStep, otpTimer])

  const generateOtp = useCallback(() => {
    return String(Math.floor(100000 + Math.random() * 900000))
  }, [])

  const startOtp = (target: OtpTarget) => {
    if (!target) return
    if (target === 'phone' && phone.trim().length < 8) {
      toast(t('signup_phone_required'), 'error'); return
    }
    if (target === 'email' && !email.includes('@')) {
      toast(t('signup_email_required'), 'error'); return
    }
    setOtpTarget(target)
    setOtpStep('sending')
    setOtpInput('')
    setOtpError('')
    setOtpTimer(180)

    // Simulate sending OTP (1.5s loading)
    const code = generateOtp()
    setTimeout(() => {
      setOtpCode(code)
      setOtpStep('input')
      toast(target === 'phone' ? t('otp_sent_phone') : t('otp_sent_email'), 'success')

      // Auto-fill after 2s (simulating user receiving the code)
      setTimeout(() => {
        setOtpInput(code)
      }, 2000)
    }, 1500)
  }

  const confirmOtp = () => {
    if (otpInput.length < 6) return
    setOtpStep('verifying')

    setTimeout(() => {
      if (otpInput === otpCode) {
        setOtpStep('done')
        if (otpTarget === 'phone') setPhoneVerified(true)
        if (otpTarget === 'email') setEmailVerified(true)
        toast(t('otp_success'), 'success')
        // Auto close after success
        setTimeout(() => {
          setOtpTarget(null)
          setOtpStep('idle')
        }, 1200)
      } else {
        setOtpStep('input')
        setOtpError(t('otp_fail'))
        setTimeout(() => setOtpError(''), 2000)
      }
    }, 800)
  }

  const resendOtp = () => {
    setOtpStep('sending')
    setOtpInput('')
    setOtpError('')
    const code = generateOtp()
    setTimeout(() => {
      setOtpCode(code)
      setOtpStep('input')
      setOtpTimer(180)
      toast(otpTarget === 'phone' ? t('otp_sent_phone') : t('otp_sent_email'), 'success')
      setTimeout(() => setOtpInput(code), 2000)
    }, 1500)
  }

  const handleSubmit = () => {
    if (!fullName.trim()) { toast(t('signup_name_required'), 'error'); return }
    if (!phone.trim()) { toast(t('signup_phone_required'), 'error'); return }
    if (!email.trim()) { toast(t('signup_email_required'), 'error'); return }
    updateProfile({ name: fullName.trim(), phone: phone.trim(), email: email.trim() })
    login(phoneVerified ? 'phone' : emailVerified ? 'email' : 'email')
    navigate('/terms')
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('signup_title')} />

      <div className="flex-1 px-6 pt-5 overflow-y-auto">
        <StepIndicator current={1} />

        <h2 className="text-lg font-bold text-text-dark whitespace-pre-line">{t('signup_heading')}</h2>
        <p className="text-xs text-text-gray mt-1 mb-4">{t('signup_desc')}</p>

        {/* Verification status banner */}
        {(phoneVerified || emailVerified) ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl mb-4">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-xs text-green-700 font-medium">
              {phoneVerified && emailVerified
                ? `${t('otp_phone_title')} + ${t('otp_email_title')} ${t('otp_verified')}`
                : phoneVerified ? `${t('otp_phone_title')} ${t('otp_verified')}`
                : `${t('otp_email_title')} ${t('otp_verified')}`
              }
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl mb-4">
            <ShieldCheck size={14} className="text-text-light" />
            <span className="text-[10px] text-text-light">{t('otp_optional')}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <User size={13} /> {t('signup_fullname')}
            </label>
            <input
              type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder={t('signup_fullname_placeholder')}
              className="w-full px-4 py-3.5 bg-gray-50 border border-border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Phone + Verify */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Phone size={13} /> {t('signup_phone')}
              {phoneVerified && (
                <span className="ml-auto flex items-center gap-0.5 text-green-600 text-[10px] font-medium">
                  <ShieldCheck size={11} /> {t('otp_verified')}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="tel" value={phone}
                onChange={e => { setPhone(e.target.value); setPhoneVerified(false) }}
                placeholder={t('signup_phone_placeholder')}
                disabled={phoneVerified}
                className={`flex-1 px-4 py-3.5 bg-gray-50 border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  phoneVerified ? 'border-green-300 bg-green-50/50' : 'border-border'
                }`}
              />
              <button
                onClick={() => startOtp('phone')}
                disabled={phoneVerified || phone.trim().length < 8}
                className={`px-4 py-3.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  phoneVerified
                    ? 'bg-green-50 text-green-600 cursor-default'
                    : phone.trim().length >= 8
                      ? 'bg-primary text-white active:bg-primary-dark'
                      : 'bg-gray-200 text-text-light cursor-not-allowed'
                }`}
              >
                {phoneVerified ? '✓' : t('otp_verify')}
              </button>
            </div>
          </div>

          {/* Email + Verify */}
          <div>
            <label className="text-xs font-medium text-text-gray mb-1.5 block flex items-center gap-1">
              <Mail size={13} /> {t('signup_email')}
              {emailVerified && (
                <span className="ml-auto flex items-center gap-0.5 text-green-600 text-[10px] font-medium">
                  <ShieldCheck size={11} /> {t('otp_verified')}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailVerified(false) }}
                placeholder={t('signup_email_placeholder')}
                disabled={emailVerified}
                className={`flex-1 px-4 py-3.5 bg-gray-50 border rounded-xl text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  emailVerified ? 'border-green-300 bg-green-50/50' : 'border-border'
                }`}
              />
              <button
                onClick={() => startOtp('email')}
                disabled={emailVerified || !email.includes('@')}
                className={`px-4 py-3.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  emailVerified
                    ? 'bg-green-50 text-green-600 cursor-default'
                    : email.includes('@')
                      ? 'bg-primary text-white active:bg-primary-dark'
                      : 'bg-gray-200 text-text-light cursor-not-allowed'
                }`}
              >
                {emailVerified ? '✓' : t('otp_verify')}
              </button>
            </div>
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

      {/* ===== OTP Verification Modal ===== */}
      <Modal open={otpTarget !== null} onClose={() => { if (otpStep !== 'verifying' && otpStep !== 'sending') { setOtpTarget(null); setOtpStep('idle') } }}>
        <div className="flex flex-col items-center">

          {/* Sending state */}
          {otpStep === 'sending' && (
            <div className="py-8 flex flex-col items-center">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-sm font-semibold text-text-dark">{t('otp_sending')}</p>
              <p className="text-xs text-text-gray mt-1">
                {otpTarget === 'phone' ? phone : email}
              </p>
            </div>
          )}

          {/* OTP Input state */}
          {otpStep === 'input' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                {otpTarget === 'phone'
                  ? <Phone size={28} className="text-primary" />
                  : <Mail size={28} className="text-primary" />
                }
              </div>
              <h3 className="text-base font-semibold text-text-dark mb-1">
                {otpTarget === 'phone' ? t('otp_phone_title') : t('otp_email_title')}
              </h3>
              <p className="text-xs text-text-gray mb-1">
                {otpTarget === 'phone' ? phone : email}
              </p>
              <p className="text-xs text-text-gray mb-5">{t('otp_enter')}</p>

              {/* OTP digit boxes */}
              <div className="flex gap-2 mb-3 w-full justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all ${
                      otpInput[i]
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-gray-50 text-text-light'
                    }`}
                  >
                    {otpInput[i] || ''}
                  </div>
                ))}
              </div>

              {/* Hidden real input for typing */}
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={otpInput}
                onChange={e => { setOtpInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setOtpError('') }}
                autoFocus
                className="w-full px-4 py-2.5 border border-border rounded-lg text-center text-sm font-mono tracking-[0.5em] mb-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="000000"
              />

              {/* Timer + Resend */}
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-xs font-mono ${otpTimer <= 30 ? 'text-error' : 'text-text-gray'}`}>
                  {t('otp_expire')} {formatTimer(otpTimer)}
                </span>
                <button onClick={resendOtp} className="text-xs text-primary font-medium">
                  {t('otp_resend')}
                </button>
              </div>

              {otpError && (
                <p className="text-error text-xs mb-3 animate-fade-in">{otpError}</p>
              )}

              <button
                onClick={confirmOtp}
                disabled={otpInput.length < 6}
                className={`w-full py-3 font-semibold rounded-xl transition-all ${
                  otpInput.length === 6 ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
                }`}
              >
                {t('otp_confirm')}
              </button>
            </>
          )}

          {/* Verifying state */}
          {otpStep === 'verifying' && (
            <div className="py-8 flex flex-col items-center">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-sm font-semibold text-text-dark">{t('otp_confirm')}...</p>
            </div>
          )}

          {/* Done state */}
          {otpStep === 'done' && (
            <div className="py-6 flex flex-col items-center animate-fade-in">
              <div className="animate-bounce-in">
                <CheckCircle size={56} className="text-green-500 mb-3" />
              </div>
              <p className="text-base font-bold text-text-dark">{t('otp_success')}</p>
              <p className="text-xs text-text-gray mt-1">
                {otpTarget === 'phone' ? phone : email}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
