import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'
import { Header } from '../components/Header'
import { StepIndicator } from '../components/StepIndicator'
import { Phone, ChevronRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

type OtpState = 'idle' | 'sending' | 'input' | 'verifying' | 'done'

export default function Login() {
  const { login, updateProfile, pinSet, pin, userType } = useStore()
  const navigate = useNavigate()
  const t = useT()

  const [phone, setPhone] = useState('')
  const [carrier, setCarrier] = useState('')
  const [idFront, setIdFront] = useState('')  // YYMMDD
  const [idBack, setIdBack] = useState('')   // first digit only (rest masked)
  const [name, setName] = useState('')
  const [otpState, setOtpState] = useState<OtpState>('idle')
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [phoneVerified, setPhoneVerified] = useState(false)

  const phoneDigits = phone.replace(/[^0-9]/g, '')
  const phoneValid = phoneDigits.length >= 10
  const nationalId = idFront && idBack ? `${idFront}-${idBack}000000` : ''

  // Format phone: 010-0000-0000
  const formatPhone = (raw: string) => {
    const d = raw.replace(/[^0-9]/g, '').slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }
  const canProceed = name.trim().length > 0 && phoneVerified

  // Returning user check
  const isReturning = pinSet && pin !== '' && userType
  if (isReturning) {
    // Auto-redirect returning users
    login('phone')
    navigate('/home', { replace: true })
    return null
  }

  const sendOtp = () => {
    if (!phoneValid) return
    setOtpState('sending')
    setTimeout(() => {
      setOtpState('input')
      setOtpTimer(180)
      // Auto-fill OTP after 2s (simulation)
      setTimeout(() => setOtpCode('123456'), 2000)
      // Start countdown
      const interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  // Random Korean names for demo
  const randomNames = ['홍길동', '김민수', '이수진', '박지현', '강수민', '최영호', '정하나', '조은비']
  const randomId = () => {
    const y = String(Math.floor(Math.random() * 30) + 70).padStart(2, '0')
    const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const g = String(Math.floor(Math.random() * 4) + 1)
    return { front: `${y}${m}${d}`, back: g }
  }

  const verifyOtp = () => {
    if (otpCode.length < 4) return
    setOtpState('verifying')
    setTimeout(() => {
      setOtpState('done')
      setPhoneVerified(true)
      toast(t('otp_success'), 'success')
      // Auto-fill carrier, name and national ID after verification
      const id = randomId()
      const carriers = ['SKT', 'KT', 'LG U+', '알뜰폰 SKT', '알뜰폰 KT', '알뜰폰 LG U+']
      setTimeout(() => {
        setCarrier(carriers[Math.floor(Math.random() * carriers.length)])
        setName(randomNames[Math.floor(Math.random() * randomNames.length)])
        setIdFront(id.front)
        setIdBack(id.back)
      }, 500)
      setTimeout(() => setOtpState('idle'), 800)
    }, 1000)
  }

  const { setUserType } = useStore()

  const handleNext = () => {
    login('phone')
    updateProfile({ name: name.trim(), phone, residenceId: nationalId })
    // Domestic → Bank setup, Foreigner → KYC passport
    if (userType === 'domestic') {
      navigate('/onboarding-bank')
    } else {
      setUserType('foreigner')
      navigate('/kyc-start')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('profile_basic_info')} />
      <div className="flex-1 flex flex-col px-6 pt-4 overflow-y-auto">
        <StepIndicator current={1} />

        {/* 1. Phone Number */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-primary mb-1.5 block">{t('signup_phone')}</label>
          <div className="relative">
            <input
              type="tel"
              value={formatPhone(phone)}
              onChange={e => { setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11)); setPhoneVerified(false) }}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full pr-24 py-3.5 border-b-2 border-border text-base text-text-dark focus:border-primary focus:outline-none transition-all tracking-wide"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {phoneVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full">
                  <CheckCircle size={12} />{t('otp_verified')}
                </span>
              ) : (
                <button onClick={sendOtp} disabled={!phoneValid || otpState === 'sending'}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                    phoneValid ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
                  }`}>
                  {otpState === 'sending' ? <Loader2 size={14} className="animate-spin" /> : t('otp_send')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Mobile Carrier */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('mobile_carrier')}</label>
          <select
            value={carrier}
            onChange={e => setCarrier(e.target.value)}
            className="w-full py-3.5 border-b-2 border-border text-sm text-text-dark focus:border-primary focus:outline-none transition-all bg-transparent appearance-none cursor-pointer"
          >
            <option value="">{t('mobile_carrier_select')}</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG U+">LG U+</option>
            <option value="알뜰폰 SKT">{t('carrier_mvno')} SKT</option>
            <option value="알뜰폰 KT">{t('carrier_mvno')} KT</option>
            <option value="알뜰폰 LG U+">{t('carrier_mvno')} LG U+</option>
          </select>
        </div>

        {/* 3. National ID (split: YYMMDD - X ●●●●●●) */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('national_id')}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={idFront}
              onChange={e => setIdFront(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="YYMMDD"
              className="flex-1 py-3.5 border-b-2 border-border text-base text-text-dark font-mono focus:border-primary focus:outline-none transition-all text-left tracking-wider"
            />
            <span className="text-text-light text-lg font-bold">-</span>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={idBack}
                onChange={e => setIdBack(e.target.value.replace(/[^0-9]/g, '').slice(0, 1))}
                placeholder="0"
                className="w-10 py-3.5 border-b-2 border-border text-base text-text-dark font-mono focus:border-primary focus:outline-none transition-all text-center"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-text-dark" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Name */}
        <div className="w-full mb-4">
          <label className="text-xs font-medium text-text-gray mb-1.5 block">{t('signup_fullname')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('signup_fullname_placeholder')}
            className="w-full py-3.5 border-b-2 border-border text-base text-text-dark focus:border-primary focus:outline-none transition-all"
          />
        </div>

        {/* Verified badge */}
        {phoneVerified && (
          <div className="w-full flex items-center gap-2 px-1 mb-2 animate-fade-in">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-xs text-green-600 font-medium">{t('otp_phone_verified')}</span>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="px-6 pb-8 pt-4">
        <button onClick={handleNext} disabled={!canProceed}
          className={`w-full flex items-center justify-center gap-2 py-4 font-semibold rounded-xl transition-all ${
            canProceed ? 'bg-primary text-white active:bg-primary-dark' : 'bg-gray-200 text-text-light'
          }`}>
          <span>{t('next')}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* OTP Input Modal */}
      <Modal open={otpState === 'input' || otpState === 'verifying' || otpState === 'done'} onClose={() => { if (otpState === 'input') setOtpState('idle') }}>
        <div className="flex flex-col items-center">
          {otpState === 'done' ? (
            <div className="py-4 animate-fade-in">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <p className="text-base font-bold text-text-dark text-center">{t('otp_success')}</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Phone size={28} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-dark mb-1">{t('otp_enter')}</h3>
              <p className="text-xs text-text-gray mb-1">{phone}</p>
              {otpTimer > 0 && (
                <p className="text-xs text-primary font-medium mb-4">
                  {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                </p>
              )}

              <input
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-border rounded-xl text-center text-lg font-mono font-bold text-text-dark tracking-[0.3em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
              />

              <button onClick={verifyOtp} disabled={otpCode.length < 4 || otpState === 'verifying'}
                className={`w-full py-3.5 font-semibold rounded-xl ${
                  otpCode.length >= 4 && otpState !== 'verifying' ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
                }`}>
                {otpState === 'verifying' ? <Loader2 size={20} className="animate-spin mx-auto" /> : t('otp_verify')}
              </button>

              <button onClick={() => { setOtpCode(''); sendOtp() }} className="mt-3 text-xs text-primary font-medium">
                {t('otp_resend')}
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
