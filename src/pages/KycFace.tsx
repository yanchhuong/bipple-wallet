import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useT } from '../hooks/useT'
import { toast } from '../components/Toast'
import { RotateCcw, AlertCircle } from 'lucide-react'

type FaceState = 'ready' | 'scanning' | 'done' | 'failed'

export default function KycFace() {
  const navigate = useNavigate()
  const t = useT()
  const [state, setState] = useState<FaceState>('ready')
  const [failCount, setFailCount] = useState(0)
  const [matchScore, setMatchScore] = useState(0)

  const handleStart = () => {
    setState('scanning')
    // Animate score during scanning
    let score = 0
    const scoreTimer = setInterval(() => {
      score += Math.random() * 8 + 2
      if (score > 95) score = 97
      setMatchScore(Math.floor(score))
    }, 200)

    setTimeout(() => {
      clearInterval(scoreTimer)
      // Simulate: 20% chance of face match failure
      setMatchScore(97)
      setState('done')
      setTimeout(() => navigate('/kyc-verify'), 800)
    }, 2500)
  }

  const handleRetry = () => {
    setState('ready')
    setMatchScore(0)
  }

  // === Failed State ===
  if (state === 'failed') return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-black animate-fade-in">
      <Header title={t('kyc_face_title')} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Error overlay on oval */}
        <div className="relative w-56 h-72 mb-6">
          {/* Dimmed background */}
          <div className="absolute inset-0 bg-black/40 rounded-xl" />
          {/* Oval guide - red */}
          <div className="absolute inset-0 rounded-[50%] border-4 border-red-400" />
          {/* Face silhouette */}
          <svg viewBox="0 0 224 288" className="absolute inset-0 w-full h-full">
            <ellipse cx="112" cy="130" rx="55" ry="65" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
            <ellipse cx="112" cy="115" rx="38" ry="45" fill="rgba(239,68,68,0.15)" />
            <circle cx="96" cy="108" r="5" fill="rgba(239,68,68,0.25)" />
            <circle cx="128" cy="108" r="5" fill="rgba(239,68,68,0.25)" />
            <ellipse cx="112" cy="130" rx="8" ry="5" fill="rgba(239,68,68,0.2)" />
            <path d="M100 145 Q112 155 124 145" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="2" />
          </svg>
          {/* X mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/80 flex items-center justify-center">
              <AlertCircle size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Error banner */}
        <div className="bg-red-500/20 rounded-xl px-4 py-3 mb-4 w-full">
          <p className="text-red-400 text-sm text-center whitespace-pre-line">
            {t('kyc_face_fail_msg')}
          </p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white/50 text-xs">{t('kyc_face_score')}:</span>
          <span className="text-red-400 font-mono text-sm font-bold">{matchScore}%</span>
          <span className="text-red-400 text-xs">({t('min_score')})</span>
        </div>

        {/* Tips */}
        <div className="w-full space-y-2 mb-4">
          {[t('kyc_face_tip_light'), t('kyc_face_tip_clear'), t('kyc_face_tip_straight')].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <span className="text-white/30 text-xs">💡</span>
              <span className="text-white/60 text-xs">{tip}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 space-y-2">
        <button onClick={handleRetry}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          {t('kyc_face_retry')}
        </button>
      </div>
    </div>
  )

  // === Camera / Normal States ===
  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-black animate-slide-in">
      <Header title={t('kyc_face_title')} />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Face oval guide with sample illustration */}
        <div className="relative w-56 h-72">
          {/* Dimmed background overlay (outside oval) */}
          <svg viewBox="0 0 224 288" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <defs>
              <mask id="ovalMask">
                <rect width="224" height="288" fill="white" />
                <ellipse cx="112" cy="144" rx="90" ry="120" fill="black" />
              </mask>
            </defs>
            <rect width="224" height="288" fill="rgba(0,0,0,0.6)" mask="url(#ovalMask)" rx="16" />
          </svg>

          {/* Oval border */}
          <div className={`absolute inset-0 rounded-[50%] border-4 transition-all duration-500 ${
            state === 'done' ? 'border-green-400' :
            state === 'scanning' ? 'border-yellow-400' :
            'border-white/40'
          }`}
          style={state === 'ready' ? { borderStyle: 'dashed' } : {}}
          />

          {/* Face illustration */}
          <svg viewBox="0 0 224 288" className="absolute inset-0 w-full h-full">
            {/* Realistic face shape */}
            <defs>
              <radialGradient id="skinGrad" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#d4a574" />
                <stop offset="100%" stopColor="#b8845a" />
              </radialGradient>
              <radialGradient id="hairGrad" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#3a2a1a" />
                <stop offset="100%" stopColor="#2a1a0a" />
              </radialGradient>
            </defs>

            {/* Hair */}
            <ellipse cx="112" cy="95" rx="52" ry="50" fill="url(#hairGrad)" />
            <rect x="60" y="85" width="104" height="20" rx="0" fill="url(#hairGrad)" />

            {/* Face */}
            <ellipse cx="112" cy="130" rx="45" ry="55" fill="url(#skinGrad)" />

            {/* Eyes */}
            <ellipse cx="94" cy="118" rx="8" ry="5" fill="white" />
            <circle cx="94" cy="118" r="3.5" fill="#3a2a1a" />
            <circle cx="95" cy="117" r="1.2" fill="white" />

            <ellipse cx="130" cy="118" rx="8" ry="5" fill="white" />
            <circle cx="130" cy="118" r="3.5" fill="#3a2a1a" />
            <circle cx="131" cy="117" r="1.2" fill="white" />

            {/* Eyebrows */}
            <path d="M82 108 Q94 103 104 108" fill="none" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M120 108 Q130 103 142 108" fill="none" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Nose */}
            <path d="M108 125 Q112 140 116 125" fill="none" stroke="#b07040" strokeWidth="1.5" />

            {/* Mouth */}
            <path d="M98 150 Q112 158 126 150" fill="none" stroke="#c07050" strokeWidth="2" strokeLinecap="round" />

            {/* Ears */}
            <ellipse cx="67" cy="128" rx="8" ry="14" fill="#c09060" />
            <ellipse cx="157" cy="128" rx="8" ry="14" fill="#c09060" />

            {/* Neck */}
            <rect x="98" y="178" width="28" height="30" rx="4" fill="url(#skinGrad)" />

            {/* Shoulders hint */}
            <path d="M70 220 Q112 200 154 220" fill="none" stroke="#4a4a5a" strokeWidth="3" />
          </svg>

          {/* Scanning line animation */}
          {state === 'scanning' && (
            <div className="absolute inset-0 rounded-[50%] overflow-hidden z-20">
              <div className="absolute left-0 right-0 h-1 bg-yellow-400/60"
                style={{ animation: 'scanLine 1.5s linear infinite' }} />
            </div>
          )}

          {/* Success checkmark */}
          {state === 'done' && (
            <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/80 flex items-center justify-center animate-bounce-in">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
          )}

          {/* Score overlay during scanning */}
          {state === 'scanning' && matchScore > 0 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-mono text-xs font-bold">{matchScore}%</span>
            </div>
          )}
        </div>

        {/* Status text */}
        <p className="text-white text-base font-medium mt-8">
          {state === 'ready' && t('kyc_face_ready')}
          {state === 'scanning' && t('kyc_face_scanning')}
          {state === 'done' && t('kyc_face_done')}
        </p>
        <p className="text-white/40 text-xs mt-2 text-center">
          {state === 'ready' && t('kyc_face_ready_sub')}
          {state === 'scanning' && t('kyc_face_matching')}
          {state === 'done' && t('kyc_face_done_sub')}
        </p>

        {/* Score display for done state */}
        {state === 'done' && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-white/50 text-xs">{t('kyc_face_score')}:</span>
            <span className="text-green-400 font-mono text-sm font-bold">{matchScore}%</span>
          </div>
        )}

        {/* Fail count warning */}
        {failCount > 0 && state === 'ready' && (
          <p className="text-amber-400 text-xs mt-3">⚠ {failCount} {t('attempt_count')}</p>
        )}
      </div>

      <div className="px-6 pb-8">
        {state === 'ready' && (
          <button onClick={handleStart} className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark">
            {failCount > 0 ? t('kyc_face_retry') : t('kyc_face_start')}
          </button>
        )}
        {state === 'scanning' && (
          <div className="w-full py-4 bg-white/10 text-white/60 font-semibold rounded-xl text-center">
            {t('kyc_face_processing')}
          </div>
        )}
      </div>
    </div>
  )
}
