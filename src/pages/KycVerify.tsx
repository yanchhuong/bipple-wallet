import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { Check, Loader2, XCircle, RotateCcw, AlertTriangle } from 'lucide-react'

type FailReason = 'passport' | 'face' | 'stay' | 'timeout' | null

export default function KycVerify() {
  const navigate = useNavigate()
  const t = useT()
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState<FailReason>(null)
  const [cancelModal, setCancelModal] = useState(false)

  const steps = [
    { label: t('kyc_verify_step1'), done: true },
    { label: t('kyc_verify_step2'), done: true },
    { label: t('kyc_verify_step3'), done: false },
  ]

  useEffect(() => {
    if (failed) return
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(() => navigate('/kyc-success'), 500)
          return 100
        }
        return p + 2
      })
    }, 80)
    return () => clearInterval(timer)
  }, [navigate, failed])

  const handleSimulateFail = (reason: FailReason) => {
    setFailed(reason)
    if (reason === 'timeout') {
      toast(t('kyc_verify_timeout'), 'error')
    }
  }

  const handleRetry = () => {
    setFailed(null)
    setProgress(0)
  }

  const handleCancel = () => {
    setCancelModal(true)
  }

  const handleConfirmCancel = () => {
    setCancelModal(false)
    navigate('/kyc-start', { replace: true })
  }

  const getFailMessage = () => {
    switch (failed) {
      case 'passport': return t('state_kyc_passport_fail')
      case 'face': return t('state_kyc_face_fail')
      case 'stay': return t('state_kyc_stay_expired')
      case 'timeout': return t('kyc_verify_timeout')
      default: return ''
    }
  }

  // === Failed State ===
  if (failed) return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('state_kyc_fail_title')} showBack={false} />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 animate-bounce-in">
          {failed === 'timeout'
            ? <AlertTriangle size={48} className="text-amber-500" strokeWidth={1.5} />
            : <XCircle size={48} className="text-red-500" strokeWidth={1.5} />
          }
        </div>
        <h2 className="text-lg font-bold text-text-dark mb-2">{t('state_kyc_fail_title')}</h2>
        <p className="text-sm text-text-gray text-center whitespace-pre-line mb-8">{getFailMessage()}</p>

        <div className="w-full space-y-3">
          {steps.map((step, i) => {
            const isFailed = (failed === 'passport' && i === 0) ||
                            (failed === 'face' && i === 1) ||
                            (failed === 'stay' && i === 2) ||
                            (failed === 'timeout' && i === 2)
            const isPassed = !isFailed && (step.done || (i === 2 && !isFailed))
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                isFailed ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                {isFailed ? (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <XCircle size={14} className="text-white" strokeWidth={3} />
                  </div>
                ) : isPassed ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                )}
                <span className={`text-sm ${isFailed ? 'text-red-600 font-medium' : 'text-text-dark'}`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={handleRetry}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          {t('state_kyc_fail_retry')}
        </button>
        <button onClick={() => navigate('/home', { replace: true })}
          className="w-full py-3 text-text-gray text-sm font-medium">
          {t('state_kyc_fail_home')}
        </button>
      </div>
    </div>
  )

  // === Verifying State ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('kyc_verify_title')} showBack={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Circular spinner */}
        <div className="relative w-24 h-24 mb-6">
          <svg className="w-24 h-24 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle cx="48" cy="48" r="42" fill="none" stroke="#1a56db" strokeWidth="4"
              strokeDasharray={264} strokeDashoffset={264 - (264 * progress / 100)}
              strokeLinecap="round" transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.3s' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{progress}%</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-text-dark mb-1">{t('kyc_verify_wait')}</h2>
        <p className="text-sm text-text-gray text-center mb-2">{t('kyc_verify_checking')}</p>
        <p className="text-xs text-text-light text-center whitespace-pre-line mb-8">{t('kyc_verify_hikorea_desc')}</p>

        {/* Step indicators */}
        <div className="w-full space-y-3">
          {steps.map((step, i) => {
            const isActive = i === 2 && progress < 100
            const isDone = step.done || (i === 2 && progress >= 100)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                ) : isActive ? (
                  <Loader2 size={22} className="text-primary animate-spin" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                )}
                <span className={`text-sm ${isDone ? 'text-text-dark' : 'text-text-gray'}`}>
                  {isDone && i === 2 ? t('kyc_verify_step3_done') : step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Demo simulate failure buttons */}
        <div className="w-full mt-6 pt-4 border-t border-border">
          <p className="text-[10px] text-text-light text-center mb-2">{t('demo_simulate')}</p>
          <div className="flex gap-2">
            <button onClick={() => handleSimulateFail('passport')}
              className="flex-1 py-2 text-[10px] bg-red-50 text-red-500 rounded-lg">
              {t('demo_passport')}
            </button>
            <button onClick={() => handleSimulateFail('face')}
              className="flex-1 py-2 text-[10px] bg-red-50 text-red-500 rounded-lg">
              {t('demo_face')}
            </button>
            <button onClick={() => handleSimulateFail('stay')}
              className="flex-1 py-2 text-[10px] bg-red-50 text-red-500 rounded-lg">
              {t('demo_stay')}
            </button>
            <button onClick={() => handleSimulateFail('timeout')}
              className="flex-1 py-2 text-[10px] bg-amber-50 text-amber-500 rounded-lg">
              {t('demo_timeout')}
            </button>
          </div>
        </div>
      </div>

      {/* Cancel button */}
      <div className="px-6 pb-8">
        <button onClick={handleCancel}
          className="w-full py-4 bg-gray-100 text-text-gray font-semibold rounded-xl">
          {t('kyc_verify_cancel')}
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)}>
        <div className="flex flex-col items-center">
          <AlertTriangle size={32} className="text-amber-500 mb-3" />
          <h3 className="text-base font-semibold text-text-dark text-center mb-2">
            {t('kyc_verify_cancel')}
          </h3>
          <p className="text-sm text-text-gray text-center whitespace-pre-line mb-6">
            {t('kyc_verify_cancel_confirm')}
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={() => setCancelModal(false)}
              className="flex-1 py-3 bg-gray-100 text-text-gray font-medium rounded-xl">
              {t('back')}
            </button>
            <button onClick={handleConfirmCancel}
              className="flex-1 py-3 bg-error text-white font-medium rounded-xl">
              {t('kyc_verify_cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
