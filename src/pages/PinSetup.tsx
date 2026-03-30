import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { PinInput } from '../components/PinInput'
import { StepIndicator } from '../components/StepIndicator'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet, userType } = useStore()
  const t = useT()
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')

  const navState = (location.state || {}) as { flow?: 'signup' | 'reset' }
  const flow = navState.flow
  const isSignupFlow = flow === 'signup' ? true : flow === 'reset' ? false : !pinSet

  const handleComplete = (pin: string) => {
    if (step === 'create') {
      setFirstPin(pin)
      setStep('confirm')
      setError('')
    } else {
      if (pin === firstPin) {
        setPin(pin)
        if (flow === 'signup') {
          navigate('/home', { replace: true })
        } else if (flow === 'reset') {
          navigate(-1)
        } else if (location.state?.from === 'payment') {
          navigate('/payment-pin', { replace: true })
        } else if (location.state?.from === 'settings') {
          navigate(-1)
        } else if (isSignupFlow) {
          navigate('/home', { replace: true })
        } else {
          // Default fallback to keep users in the app
          navigate('/home', { replace: true })
        }
      } else {
        setError(t('pin_mismatch'))
        setTimeout(() => setError(''), 2000)
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('pin_title')} />
      {isSignupFlow && (
        <div className="px-6 pt-3">
          <StepIndicator current={userType === 'foreigner' ? 3 : 4} />
        </div>
      )}
      <PinInput
        title={step === 'create' ? t('pin_enter') : t('pin_reenter')}
        subtitle={step === 'create' ? t('pin_used_for') : t('pin_reenter_desc')}
        error={error}
        onComplete={handleComplete}
      />
    </div>
  )
}
