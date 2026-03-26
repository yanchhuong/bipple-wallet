import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { useT } from '../hooks/useT'
import { Camera, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react'

type ScanState = 'ready' | 'scanning' | 'captured' | 'failed' | 'retry-loop'

export default function KycPassport() {
  const navigate = useNavigate()
  const t = useT()
  const [state, setState] = useState<ScanState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [showFaq, setShowFaq] = useState(false)

  const handleCapture = () => {
    setState('scanning')
    setTimeout(() => {
      // Simulate: 30% chance of OCR failure for first 2 attempts
      const willFail = failCount < 2 && Math.random() < 0.3
      if (willFail) {
        const newCount = failCount + 1
        setFailCount(newCount)
        setState(newCount >= 3 ? 'retry-loop' : 'failed')
      } else {
        setState('captured')
        setTimeout(() => navigate('/kyc-confirm'), 800)
      }
    }, 2500)
  }

  const handleRetry = () => {
    setState('ready')
  }

  // === OCR Recognition Failed ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('kyc_passport_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={36} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-text-dark mb-2">{t('kyc_ocr_fail_title')}</h2>
        <p className="text-sm text-text-gray text-center whitespace-pre-line mb-2">
          {t('kyc_ocr_fail_msg')}
        </p>
        <p className="text-xs text-text-light mb-8">({failCount}/3 {t('attempt_count')})</p>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={handleRetry}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <Camera size={18} />
          {t('kyc_ocr_retry_btn')}
        </button>
        <button onClick={() => navigate(-1)}
          className="w-full py-3 text-text-gray text-sm font-medium">
          {t('cancel')}
        </button>
      </div>
    </div>
  )

  // === Retry Loop (3+ failures) ===
  if (state === 'retry-loop') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('kyc_passport_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <AlertCircle size={36} className="text-amber-500" />
        </div>
        <h2 className="text-base font-bold text-text-dark mb-2">{t('kyc_ocr_retry_title')}</h2>
        <div className="bg-amber-50 rounded-xl p-4 mb-6 w-full">
          <p className="text-sm text-amber-800 text-center whitespace-pre-line">
            {t('kyc_ocr_retry_msg')}
          </p>
        </div>
        {/* Passport guide illustration */}
        <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
          <svg viewBox="0 0 320 200" className="w-full">
            <rect x="10" y="10" width="300" height="180" rx="8" fill="#1a2332" />
            <rect x="20" y="20" width="80" height="100" rx="4" fill="#2a3a4d" stroke="#4a6a8d" strokeWidth="1" />
            <circle cx="60" cy="55" r="20" fill="#3a4a5d" />
            <rect x="40" y="82" width="40" height="6" rx="2" fill="#4a6a8d" />
            <rect x="115" y="25" width="120" height="6" rx="2" fill="#4a6a8d" />
            <rect x="115" y="40" width="80" height="5" rx="2" fill="#3a5a7d" />
            <rect x="115" y="55" width="100" height="5" rx="2" fill="#3a5a7d" />
            <rect x="115" y="70" width="90" height="5" rx="2" fill="#3a5a7d" />
            <rect x="115" y="85" width="110" height="5" rx="2" fill="#3a5a7d" />
            {/* MRZ zone - highlighted */}
            <rect x="20" y="135" width="280" height="45" rx="2" fill="#0a1520" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="28" y="143" width="264" height="6" rx="1" fill="#2a4a6d" />
            <rect x="28" y="155" width="264" height="6" rx="1" fill="#2a4a6d" />
            <rect x="28" y="167" width="180" height="6" rx="1" fill="#2a4a6d" />
            <text x="160" y="132" textAnchor="middle" fill="#FFD700" fontSize="8" fontFamily="monospace">▼ MRZ Zone ▼</text>
          </svg>
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={() => { setFailCount(0); handleRetry() }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl">
          {t('kyc_ocr_guide_btn')}
        </button>
        <button onClick={() => setShowFaq(true)}
          className="w-full py-3 text-text-gray text-sm font-medium flex items-center justify-center gap-1">
          <HelpCircle size={14} />
          {t('kyc_support_faq')}
        </button>
      </div>

      {/* Support FAQ Modal */}
      <Modal open={showFaq} onClose={() => setShowFaq(false)}>
        <div className="flex flex-col items-center">
          <HelpCircle size={32} className="text-primary mb-3" />
          <h3 className="text-base font-semibold text-text-dark mb-2">{t('kyc_support_title')}</h3>
          <p className="text-sm text-text-gray text-center mb-4">{t('kyc_support_msg')}</p>
          <div className="w-full space-y-2 text-sm text-text-gray">
            <div className="bg-gray-50 rounded-lg p-3">• {t('kyc_face_tip_light')}</div>
            <div className="bg-gray-50 rounded-lg p-3">• {t('kyc_passport_guide')}</div>
            <div className="bg-gray-50 rounded-lg p-3">• {t('kyc_passport_auto_fail')}</div>
          </div>
          <button onClick={() => setShowFaq(false)}
            className="w-full mt-4 py-3 bg-primary text-white font-medium rounded-xl">
            {t('close')}
          </button>
        </div>
      </Modal>
    </div>
  )

  // === Camera / Scanning View ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-black animate-slide-in">
      <Header title={t('kyc_passport_title')} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Simulated camera viewfinder with passport sample */}
        <div className="w-full aspect-[1.4/1] relative rounded-2xl overflow-hidden bg-gray-900 border-2 border-white/20">
          {/* Sample passport image (SVG illustration) */}
          <svg viewBox="0 0 360 260" className="absolute inset-0 w-full h-full">
            {/* Background - simulated camera feed */}
            <defs>
              <linearGradient id="camBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" />
                <stop offset="100%" stopColor="#16213e" />
              </linearGradient>
            </defs>
            <rect width="360" height="260" fill="url(#camBg)" />

            {/* Passport document */}
            <rect x="30" y="20" width="300" height="220" rx="8" fill="#1e3a5f" />
            <rect x="32" y="22" width="296" height="216" rx="7" fill="#0a1929" stroke="#2a5a8a" strokeWidth="0.5" />

            {/* Header: PASSPORT */}
            <text x="180" y="46" textAnchor="middle" fill="#c0a060" fontSize="11" fontWeight="bold" fontFamily="serif" letterSpacing="3">PASSPORT</text>

            {/* Photo area */}
            <rect x="48" y="58" width="85" height="108" rx="4" fill="#1a2e44" stroke="#3a6a9a" strokeWidth="0.8" />
            {/* Face silhouette */}
            <circle cx="90" cy="90" r="24" fill="#2a3e54" />
            <ellipse cx="90" cy="82" rx="16" ry="18" fill="#3a5a7a" />
            <rect x="72" y="120" width="36" height="18" rx="4" fill="#3a5a7a" />
            <rect x="60" y="144" width="60" height="8" rx="2" fill="#2a4a6a" />
            <text x="90" y="160" textAnchor="middle" fill="#5a8aba" fontSize="6">PHOTO</text>

            {/* Data fields */}
            <text x="150" y="72" fill="#6a9aca" fontSize="7" fontFamily="monospace">Type / 타입</text>
            <text x="150" y="84" fill="#a0c4e4" fontSize="10" fontWeight="bold" fontFamily="monospace">P</text>

            <text x="210" y="72" fill="#6a9aca" fontSize="7" fontFamily="monospace">Country / 국가</text>
            <text x="210" y="84" fill="#a0c4e4" fontSize="10" fontWeight="bold" fontFamily="monospace">USA</text>

            <text x="150" y="102" fill="#6a9aca" fontSize="7" fontFamily="monospace">Surname / 성</text>
            <text x="150" y="114" fill="#e0e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace">SMITH</text>

            <text x="150" y="130" fill="#6a9aca" fontSize="7" fontFamily="monospace">Given Name / 이름</text>
            <text x="150" y="142" fill="#e0e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace">JOHN</text>

            <text x="150" y="158" fill="#6a9aca" fontSize="7" fontFamily="monospace">Date of Birth</text>
            <text x="150" y="170" fill="#a0c4e4" fontSize="9" fontFamily="monospace">15 MAY 1990</text>

            <text x="260" y="158" fill="#6a9aca" fontSize="7" fontFamily="monospace">Passport No.</text>
            <text x="260" y="170" fill="#a0c4e4" fontSize="9" fontFamily="monospace">M12345678</text>

            {/* MRZ Zone */}
            <rect x="38" y="185" width="284" height="48" rx="2" fill="#0a1520" />
            <text x="45" y="200" fill="#4a7aaa" fontSize="8" fontFamily="monospace">P&lt;USASMITH&lt;&lt;JOHN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
            <text x="45" y="212" fill="#4a7aaa" fontSize="8" fontFamily="monospace">M12345678&lt;0USA9005153M2612159&lt;&lt;&lt;&lt;&lt;&lt;</text>
            <text x="45" y="224" fill="#4a7aaa" fontSize="8" fontFamily="monospace">SMITH&lt;&lt;JOHN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
          </svg>

          {/* Corner guides */}
          <div className="absolute top-3 left-3 w-10 h-10 border-t-3 border-l-3 border-primary rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-10 h-10 border-t-3 border-r-3 border-primary rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-3 border-l-3 border-primary rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-3 border-r-3 border-primary rounded-br-lg" />

          {/* Scanning animation */}
          {state === 'scanning' && (
            <div className="absolute inset-0">
              <div className="absolute left-4 right-4 h-0.5 bg-primary"
                style={{ animation: 'scanLine 2s linear infinite' }} />
              <div className="absolute inset-0 bg-primary/5 animate-pulse-slow" />
            </div>
          )}

          {/* Captured success overlay */}
          {state === 'captured' && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-bounce-in">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Status text */}
        <p className="text-white text-sm mt-6 text-center">
          {state === 'scanning' ? t('kyc_passport_scanning') :
           state === 'captured' ? t('kyc_passport_done') :
           t('kyc_passport_guide')}
        </p>
        <p className="text-white/40 text-xs mt-1">{t('kyc_passport_auto_fail')}</p>

        {/* Fail count indicator */}
        {failCount > 0 && state === 'ready' && (
          <p className="text-amber-400 text-xs mt-2">⚠ {failCount}/3 {t('attempt_count')}</p>
        )}
      </div>

      <div className="px-6 pb-8 flex gap-3">
        <button onClick={() => navigate(-1)} className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
          <RotateCcw size={20} className="text-white" />
        </button>
        <button
          onClick={handleCapture}
          disabled={state === 'scanning' || state === 'captured'}
          className="flex-1 h-14 bg-primary text-white font-semibold rounded-full flex items-center justify-center gap-2 active:bg-primary-dark disabled:opacity-50"
        >
          <Camera size={20} />
          <span>{state === 'scanning' ? t('kyc_passport_scanning_btn') : t('kyc_passport_capture')}</span>
        </button>
      </div>
    </div>
  )
}
