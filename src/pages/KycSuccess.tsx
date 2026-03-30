import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { CheckCircle } from 'lucide-react'

export default function KycSuccess() {
  const navigate = useNavigate()
  const { completeKyc } = useStore()
  const t = useT()

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="animate-bounce-in">
          <CheckCircle size={80} className="text-green-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-text-dark mt-6 mb-2">{t('kyc_success_title')}</h2>
        <p className="text-sm text-text-gray text-center leading-relaxed whitespace-pre-line">{t('kyc_success_msg')}</p>

        <div className="w-full mt-8 bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-gray">{t('kyc_success_limit')}</span>
            <span className="text-lg font-bold text-primary">1,000,000 KRW</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-gray">{t('kyc_success_grade')}</span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Minimal-KYC</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={() => { completeKyc(); navigate('/terms') }}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark"
        >
          {t('kyc_success_go_home')}
        </button>
      </div>
    </div>
  )
}
