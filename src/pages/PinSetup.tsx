import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { PinInput } from '../components/PinInput'
import { StepIndicator } from '../components/StepIndicator'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

export default function PinSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPin, pinSet } = useStore()
  const t = useT()
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')

  // Show step indicator only during signup flow (not when resetting from Settings)
  const isSignupFlow = !pinSet

  const handleComplete = (pin: string) => {
    if (step === 'create') {
      setFirstPin(pin)
      setStep('confirm')
      setError('')
    } else {
      if (pin === firstPin) {
        setPin(pin)
        if (isSignupFlow) {
          navigate('/user-type')
        } else {
          navigate(-1)
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
          <StepIndicator current={3} />
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
