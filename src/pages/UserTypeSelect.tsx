import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useT } from '../hooks/useT'
import { Header } from '../components/Header'
import { User, Globe, ShieldCheck, CreditCard } from 'lucide-react'
import { StepIndicator } from '../components/StepIndicator'

export default function UserTypeSelect() {
  const navigate = useNavigate()
  const { setUserType, updateProfile, completeKyc } = useStore()
  const t = useT()

  const handleDomestic = () => {
    setUserType('domestic')
    // Domestic users get real-name verified via ARS, simulate with sample data
    updateProfile({
      residenceId: '900101-1234567',
    })
    completeKyc()
    navigate('/home')
  }

  const handleForeigner = () => {
    setUserType('foreigner')
    navigate('/kyc-start')
  }

  return (
    <div className="flex flex-col h-[calc(100%-44px)] bg-white animate-slide-in">
      <Header title={t('usertype_title')} showBack={true} />

      <div className="flex-1 px-6 pt-5">
        <h2 className="text-lg font-bold text-text-dark mb-1">{t('usertype_heading')}</h2>
        <p className="text-sm text-text-gray mb-8">{t('usertype_desc')}</p>

        <div className="space-y-4">
          {/* Domestic */}
          <button
            onClick={handleDomestic}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-primary active:bg-primary/5 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User size={28} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('usertype_domestic')}</p>
              <p className="text-xs text-text-gray mt-1">{t('usertype_domestic_desc')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <ShieldCheck size={10} />{t('usertype_domestic_auth')}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-light">
                  <CreditCard size={10} />2,000,000 KRW
                </span>
              </div>
            </div>
          </button>

          {/* Foreigner */}
          <button
            onClick={handleForeigner}
            className="w-full flex items-center gap-4 p-5 border-2 border-border rounded-2xl active:border-green-500 active:bg-green-50/50 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Globe size={28} className="text-green-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-dark">{t('usertype_foreigner')}</p>
              <p className="text-xs text-text-gray mt-1">{t('usertype_foreigner_desc')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-green-600">
                  <ShieldCheck size={10} />{t('usertype_foreigner_auth')}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-light">
                  <CreditCard size={10} />1,000,000 KRW
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
