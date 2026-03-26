import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw } from 'lucide-react'
import { Header } from '../components/Header'
import { useT } from '../hooks/useT'
import { useStore } from '../store/useStore'

type TimelineStatus = 'done' | 'active' | 'pending'

type KorbitAsset = {
  symbol: string
  name: string
  balance: number
  rate: number
}

type LocationState = {
  asset: KorbitAsset
  qty: number
  estimatedKrw: number
}

function clampToNonNegativeInteger(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.floor(n))
}

export default function KorbitProcessing() {
  const navigate = useNavigate()
  const location = useLocation()
  const t = useT()
  const { chargeBippleMoney } = useStore()

  const state = (location.state || {}) as Partial<LocationState>
  const estimatedKrw = clampToNonNegativeInteger(state.estimatedKrw)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick(v => v + 1), 550)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (estimatedKrw <= 0) return
    if (tick < 6) return
    chargeBippleMoney(estimatedKrw)
    navigate('/charge-complete', {
      replace: true,
      state: { amount: estimatedKrw, method: 'Korbit' },
    })
  }, [chargeBippleMoney, estimatedKrw, navigate, tick])

  const timeline = useMemo(() => {
    const requestStatus: TimelineStatus = tick >= 2 ? 'done' : 'active'
    const processingStatus: TimelineStatus =
      tick >= 4 ? 'done' : tick >= 2 ? 'active' : 'pending'
    const completeStatus: TimelineStatus = tick >= 6 ? 'done' : 'pending'

    return [
      {
        id: 'request',
        title: t('korbit_process_step_request_title'),
        desc: t('korbit_process_step_request_desc'),
        status: requestStatus,
      },
      {
        id: 'processing',
        title: t('korbit_process_step_processing_title'),
        desc: t('korbit_process_step_processing_desc'),
        status: processingStatus,
      },
      {
        id: 'complete',
        title: t('korbit_process_step_complete_title'),
        desc: t('korbit_process_step_complete_desc'),
        status: completeStatus,
      },
    ] as const
  }, [t, tick])

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <Header title={t('korbit_process_title')} showBack={false} />

      <div className="flex-1 px-6 pt-6">
        <div className="relative pl-8">
          <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-border" />

          <div className="space-y-8">
            {timeline.map(item => {
              const isActive = item.status === 'active'
              const isDone = item.status === 'done'

              const markerClass = isDone
                ? 'w-9 h-9 rounded-xl border-2 border-transparent bg-green-600'
                : isActive
                  ? 'w-9 h-9 rounded-xl border-2 border-primary bg-gray-100 flex items-center justify-center'
                  : 'w-9 h-9 rounded-xl border-2 bg-gray-100 border-border'

              const titleClass = isActive
                ? 'text-base font-semibold text-primary'
                : isDone
                  ? 'text-base font-semibold text-green-700'
                  : 'text-base font-semibold text-text-gray'

              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-8 flex justify-center pt-0.5">
                    <div className={markerClass}>
                      {isActive ? (
                        <Loader2
                          size={18}
                          className="text-primary animate-spin"
                          style={{ animationDuration: '2s' }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={titleClass}>{item.title}</p>
                    <p className="text-xs text-text-gray leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="mt-8 flex items-center justify-center gap-2 text-sm text-primary"
            onClick={() => setTick(0)}
          >
            <RefreshCw size={14} />
            <span>{t('korbit_process_refresh')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

