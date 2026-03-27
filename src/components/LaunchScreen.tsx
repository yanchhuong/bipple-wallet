import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { AppLogo } from './AppLogo'
import { UserPlus, LogIn } from 'lucide-react'

const SPLASH_KEY = 'bipple_splash_v1'

type Ripple = { id: number; x: number; y: number }
type Phase = 'splash' | 'choose'

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

export function LaunchScreen() {
  const t = useT()
  const navigate = useNavigate()
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_KEY)
    } catch {
      return true
    }
  })
  const [exiting, setExiting] = useState(false)
  const [phase, setPhase] = useState<Phase>('splash')
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  // Auto-transition from splash to choose after 2.5s
  useEffect(() => {
    if (!visible || phase !== 'splash') return
    // Auth check: if already signed in, skip everything
    const { isLoggedIn, pinSet } = useStore.getState()
    if (isLoggedIn && pinSet) {
      try { sessionStorage.setItem(SPLASH_KEY, '1') } catch { /* ignore */ }
      setExiting(true)
      window.setTimeout(() => {
        setVisible(false)
        navigate('/home', { replace: true })
      }, 420)
      return
    }
    const timer = window.setTimeout(() => setPhase('choose'), reducedMotion ? 1000 : 2500)
    return () => window.clearTimeout(timer)
  }, [visible, phase, reducedMotion, navigate])

  const dismiss = useCallback((path: string) => {
    if (exiting) return
    try { sessionStorage.setItem(SPLASH_KEY, '1') } catch { /* ignore */ }
    setExiting(true)
    window.setTimeout(() => {
      setVisible(false)
      navigate(path, { replace: true })
    }, 420)
  }, [exiting, navigate])

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
    if (phase === 'splash') {
      addRipple(e.clientX, e.clientY)
      setPhase('choose')
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (reducedMotion || phase !== 'splash') return
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

  const handleExistingUser = () => {
    // Load demo data for existing user
    const s = useStore.setState
    s({
      isLoggedIn: true,
      isKycComplete: true,
      userType: 'domestic',
      loginMethod: 'phone',
      pin: '123456',
      pinSet: true,
      korbitConnected: true,
      bippleMoney: 150000,
      profile: {
        name: '홍길동', email: 'hong@bipple.com', phone: '010-1234-5678',
        avatar: '', passportNo: '', nationality: '', birthDate: '', residenceId: '900101-1234567',
      },
      coins: [
        { id: '1', symbol: 'USDC', name: 'USD Coin', balance: 50.0, unit: 'USDC', source: 'Triple-A', krwValue: 67500, rate: 1350 },
        { id: '2', symbol: 'ETH', name: 'Ethereum', balance: 0.05, unit: 'ETH', source: 'Korbit', krwValue: 120000, rate: 2400000 },
        { id: '3', symbol: 'BTC', name: 'Bitcoin', balance: 0.002, unit: 'BTC', source: 'Korbit', krwValue: 165000, rate: 82500000 },
      ],
      transactions: [
        { id: '1', type: 'payment', title: '스타벅스 강남점', subtitle: '결제', amount: -5200, balance: 150000, date: '2026.03.20', time: '14:30:22', status: 'completed', paymentMethod: 'bipple' },
        { id: '2', type: 'charge', title: '비플머니 충전', subtitle: 'Triple-A', amount: 50000, balance: 155200, date: '2026.03.19', time: '10:15:05', status: 'completed', paymentMethod: 'bipple' },
        { id: '3', type: 'atm', title: 'NICE ATM 출금', subtitle: 'ATM', amount: -10000, balance: 105200, date: '2026.03.18', time: '18:45:11', status: 'completed', paymentMethod: 'bipple' },
        { id: '4', type: 'charge', title: '비플머니 충전', subtitle: '은행', amount: 30000, balance: 116500, date: '2026.03.17', time: '09:20:00', status: 'completed', paymentMethod: 'bipple' },
        { id: '5', type: 'payment', title: 'CU 역삼점', subtitle: '결제', amount: -3500, balance: 86500, date: '2026.03.16', time: '12:10:33', status: 'completed', paymentMethod: 'bipple' },
        { id: '6', type: 'charge', title: 'Korbit 매도 충전', subtitle: 'Korbit', amount: 100000, balance: 105000, date: '2026.03.14', time: '11:05:30', status: 'completed', paymentMethod: 'bipple' },
      ],
      notifications: [
        { id: '1', type: 'payment', title: '결제 완료', message: '스타벅스 강남점에서 5,200원 결제가 완료되었습니다.', date: '2026.03.20 14:30', read: false },
        { id: '2', type: 'charge', title: '충전 완료', message: 'Triple-A를 통해 100 USDT 충전이 완료되었습니다.', date: '2026.03.19 10:15', read: false },
        { id: '3', type: 'notice', title: '공지사항', message: '비플월렛 정식 서비스 오픈 안내', date: '2026.03.18 09:00', read: true },
      ],
      bankAccounts: [
        { id: 'b1', bankName: '신한은행', accountNumber: '110-345-678901', holderName: '홍길동', isDefault: true },
      ],
    })
    dismiss('/home')
  }

  const handleNewUser = () => {
    // Reset to fresh state for new user
    useStore.getState().logout()
    dismiss('/')
  }

  if (!visible) return null

  const parallaxT = reducedMotion ? 'none' : `translate(${parallax.x}px, ${parallax.y}px)`

  return (
    <div
      ref={containerRef}
      role="presentation"
      className={`absolute inset-0 z-[280] bg-primary overflow-hidden touch-manipulation ${
        exiting ? 'launch-screen-exit' : 'launch-screen-enter'
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="launch-ripple pointer-events-none absolute rounded-full bg-white/25"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col justify-end px-6 overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
        {/* Logo + Branding */}
        <div className="flex-1 flex items-end pb-6">
          <div className="w-full">
            <div
              className="select-none"
              style={{
                transform: parallaxT,
                transition: reducedMotion ? undefined : 'transform 0.2s ease-out',
              }}
            >
              <div className="inline-flex rounded-[18px] bg-white p-3 shadow-lg shadow-black/10">
                <AppLogo size={72} />
              </div>
            </div>

            <p className="mt-5 text-[22px] sm:text-[26px] font-extrabold leading-[1.25] tracking-[-0.02em] text-white">
              비플월렛,{'\n'}스마트한 결제에 자유를 더하다
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className={`pb-6 space-y-3 transition-all duration-500 ${
          phase === 'choose' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <button onClick={handleExistingUser}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-primary font-semibold rounded-xl active:bg-white/90 transition-colors">
            <LogIn size={20} />
            <span>{t('launch_existing_user')}</span>
          </button>
          <button onClick={handleNewUser}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white/15 text-white font-semibold rounded-xl active:bg-white/25 transition-colors border border-white/30">
            <UserPlus size={20} />
            <span>{t('launch_new_user')}</span>
          </button>

          {/* Spacer for mobile browser nav bar */}
          <div className="h-4 sm:h-0" />
        </div>
      </div>
    </div>
  )
}
