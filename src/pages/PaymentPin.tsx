import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { PinInput } from '../components/PinInput'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { PIN_MAX_ATTEMPTS, PIN_LOCKOUT_MS } from '../constants'
import { Lock } from 'lucide-react'

export default function PaymentPin() {
  const navigate = useNavigate()
  const { pin, pinSet } = useStore()
  const t = useT()
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [lockRemaining, setLockRemaining] = useState(0)

  const isLocked = lockedUntil > Date.now()

  // Countdown timer for lockout
  useEffect(() => {
    if (!isLocked) return
    const timer = setInterval(() => {
      const remaining = Math.max(0, lockedUntil - Date.now())
      setLockRemaining(remaining)
      if (remaining <= 0) {
        setAttempts(0)
        setLockedUntil(0)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [lockedUntil, isLocked])

  const handleComplete = (input: string) => {
    if (isLocked) return

    // Security: require PIN to be set
    if (!pinSet || pin === '') {
      navigate('/pin-setup')
      return
    }

    if (input === pin) {
      setAttempts(0)
      navigate('/payment-scan')
    } else {
      const next = attempts + 1
      setAttempts(next)
      if (next >= PIN_MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + PIN_LOCKOUT_MS)
        setLockRemaining(PIN_LOCKOUT_MS)
        setError('')
      } else {
        setError(`${t('pay_pin_error')} (${next}/${PIN_MAX_ATTEMPTS})`)
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  // Locked state
  if (isLocked) {
    const mins = Math.floor(lockRemaining / 60000)
    const secs = Math.floor((lockRemaining % 60000) / 1000)
    return (
      <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
        <Header title={t('pay_pin_title')} />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <Lock size={36} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-text-dark mb-2">{t('pin_locked')}</h2>
          <p className="text-sm text-text-gray text-center mb-4">
            {t('pin_locked_msg')} ({PIN_MAX_ATTEMPTS}/{PIN_MAX_ATTEMPTS})
          </p>
          <div className="bg-red-50 rounded-xl px-6 py-3">
            <span className="text-2xl font-mono font-bold text-red-500">
              {mins}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('pay_pin_title')} />
      <PinInput title={t('pay_pin_enter')} error={error} onComplete={handleComplete} />
    </div>
  )
}
