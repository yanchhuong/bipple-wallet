import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '../hooks/useT'
import { AppLogo } from './AppLogo'

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

function BepleLogoMark({
  parallax,
  reducedMotion,
}: {
  parallax: { x: number; y: number }
  reducedMotion: boolean
}) {
  const t = reducedMotion ? 'none' : `translate(${parallax.x}px, ${parallax.y}px)`
  return (
    <div
      className="relative flex select-none launch-brackets-in"
      style={{ transform: t, transition: reducedMotion ? undefined : 'transform 0.2s ease-out' }}
    >
      <div className="rounded-[22px] bg-white p-3.5 shadow-lg shadow-black/20">
        <AppLogo
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
          aria-hidden
        />
      </div>
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
      className={`absolute inset-0 z-[280] flex flex-col justify-center bg-primary overflow-hidden cursor-pointer touch-manipulation ${
        exiting ? 'launch-screen-exit' : 'launch-screen-enter'
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="launch-ripple pointer-events-none absolute rounded-full bg-white/35"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      <div className="flex w-full flex-col items-stretch px-6 sm:px-8">
        <div className="mx-auto w-full max-w-[300px] flex flex-col items-start">
          <BepleLogoMark parallax={parallax} reducedMotion={reducedMotion} />

          <p className="mt-6 text-left text-lg font-bold text-white leading-snug tracking-tight whitespace-pre-line">
            {t('launch_tagline')}
          </p>
        </div>
      </div>
    </div>
  )
}
