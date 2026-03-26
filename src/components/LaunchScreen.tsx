import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '../hooks/useT'

const SPLASH_KEY = 'bipple_splash_v1'

type Ripple = { id: number; x: number; y: number }

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

function BippleLogoMark({
  parallax,
  reducedMotion,
}: {
  parallax: { x: number; y: number }
  reducedMotion: boolean
}) {
  const t = reducedMotion ? 'none' : `translate(${parallax.x}px, ${parallax.y}px)`
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ transform: t, transition: reducedMotion ? undefined : 'transform 0.2s ease-out' }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="launch-brackets-in"
        aria-hidden
      >
        <defs>
          <linearGradient id="launchBracketAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Corner brackets */}
        <g stroke="#1a56db" strokeWidth="3.5" fill="none" strokeLinecap="square">
          <path d="M 18 42 L 18 18 L 42 18" />
          <path d="M 158 18 L 182 18 L 182 42" />
          <path d="M 18 158 L 18 182 L 42 182" />
          <path d="M 182 158 L 182 182 L 158 182" />
        </g>
        <circle cx="18" cy="18" r="3" fill="url(#launchBracketAccent)" />
        <circle cx="182" cy="18" r="3" fill="url(#launchBracketAccent)" />
        <circle cx="18" cy="182" r="3" fill="url(#launchBracketAccent)" />
        <circle cx="182" cy="182" r="3" fill="url(#launchBracketAccent)" />

        {/* Stylized b + play */}
        <g transform="translate(100, 102)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#1a56db"
            fontSize="86"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ letterSpacing: '-0.02em' }}
          >
            b
          </text>
          <polygon points="18,-8 18,12 32,2" fill="#1a56db" />
          <rect
            x="38"
            y="-38"
            width="44"
            height="20"
            rx="10"
            fill="#1a56db"
          />
          <text
            x="60"
            y="-24"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Pay
          </text>
        </g>
      </svg>
    </div>
  )
}

export function LaunchScreen() {
  const t = useT()
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_KEY)
    } catch {
      return true
    }
  })
  const [exiting, setExiting] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const dismiss = useCallback(() => {
    if (exiting) return
    try {
      sessionStorage.setItem(SPLASH_KEY, '1')
    } catch {
      /* ignore */
    }
    setExiting(true)
    window.setTimeout(() => setVisible(false), 420)
  }, [exiting])

  useEffect(() => {
    if (!visible || exiting) return
    const t = window.setTimeout(dismiss, reducedMotion ? 1200 : 2800)
    return () => window.clearTimeout(t)
  }, [visible, exiting, dismiss, reducedMotion])

  const addRipple = (clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const id = ++rippleId.current
    setRipples(prev => [...prev, { id, x: clientX - r.left, y: clientY - r.top }])
    window.setTimeout(() => {
      setRipples(prev => prev.filter(x => x.id !== id))
    }, 700)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    addRipple(e.clientX, e.clientY)
    dismiss()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (reducedMotion) return
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = (e.clientX - cx) / (r.width / 2)
    const dy = (e.clientY - cy) / (r.height / 2)
    const max = 10
    setParallax({
      x: Math.max(-max, Math.min(max, dx * max)),
      y: Math.max(-max, Math.min(max, dy * max)),
    })
  }

  const onPointerLeave = () => {
    setParallax({ x: 0, y: 0 })
  }

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      role="presentation"
      className={`absolute inset-0 z-[280] flex flex-col items-center justify-center bg-white overflow-hidden cursor-pointer touch-manipulation ${
        exiting ? 'launch-screen-exit' : 'launch-screen-enter'
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="launch-ripple pointer-events-none absolute rounded-full bg-primary/25"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      <div className="flex flex-col items-center px-6 -mt-16">
        <BippleLogoMark parallax={parallax} reducedMotion={reducedMotion} />

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-primary tracking-tight">비플월렛</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-slate-400">BIPPLE WALLET</p>
        </div>

        <div
          className="mt-14 flex gap-2"
          aria-hidden
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full bg-primary/35 ${reducedMotion ? '' : 'launch-dot'}`}
              style={reducedMotion ? {} : { animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>

        <p className="mt-8 text-[11px] text-text-light">{t('launch_tap_hint')}</p>
      </div>
    </div>
  )
}
