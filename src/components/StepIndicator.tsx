import { Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'

// Foreigner (Passport): 3 steps
const foreignerSteps = [
  { key: 'profile_basic_info' },
  { key: 'terms_title' },
  { label: 'PIN' },
] as const

// Domestic (Phone): 4 steps
const domesticSteps = [
  { key: 'profile_basic_info' },
  { key: 'step_bank_setup' },
  { key: 'terms_title' },
  { label: 'PIN' },
] as const

export function StepIndicator({ current }: { current: number }) {
  const t = useT()
  const userType = useStore(s => s.userType)
  const steps = userType === 'foreigner' ? foreignerSteps : domesticSteps

  return (
    <div className="flex items-center gap-1 mb-5">
      {steps.map((step, i) => {
        const num = i + 1
        const isDone = num < current
        const isActive = num === current
        const label = 'key' in step ? t(step.key) : step.label

        return (
          <div key={num} className="flex items-center gap-1 flex-1 min-w-0">
            {i > 0 && (
              <div className={`flex-shrink-0 w-4 h-px ${isDone || isActive ? 'bg-primary' : 'bg-border'}`} />
            )}
            <div className="flex items-center gap-1 min-w-0">
              {isDone ? (
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
              ) : (
                <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
                }`}>
                  {num}
                </div>
              )}
              <span className={`text-[10px] truncate ${
                isDone ? 'text-green-600' : isActive ? 'text-primary font-medium' : 'text-text-light'
              }`}>
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
