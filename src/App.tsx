import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { LaunchScreen } from './components/LaunchScreen'
import { ToastProvider } from './components/Toast'
import { AuthGuard } from './components/AuthGuard'

// Pages
import LanguageSelect from './pages/LanguageSelect'
import Login from './pages/Login'
import Terms from './pages/Terms'
import PinSetup from './pages/PinSetup'
import UserTypeSelect from './pages/UserTypeSelect'
import KycStart from './pages/KycStart'
import KycPassport from './pages/KycPassport'
import KycConfirm from './pages/KycConfirm'
import KycFace from './pages/KycFace'
import KycVerify from './pages/KycVerify'
import KycSuccess from './pages/KycSuccess'
import Home from './pages/Home'
import Notifications from './pages/Notifications'
import History from './pages/History'
import Receipt from './pages/Receipt'
import ChargeHub from './pages/ChargeHub'
import ChargeBank from './pages/ChargeBank'
import ChargeCoin from './pages/ChargeCoin'
import ChargeTripleA from './pages/ChargeTripleA'
import ChargeKorbit from './pages/ChargeKorbit'
import KorbitProcessing from './pages/KorbitProcessing'
import ChargeComplete from './pages/ChargeComplete'
import PaymentPin from './pages/PaymentPin'
import PaymentScan from './pages/PaymentScan'
import PaymentConfirm from './pages/PaymentConfirm'
import AtmScan from './pages/AtmScan'
import AtmAmount from './pages/AtmAmount'
import AtmConfirm from './pages/AtmConfirm'
import CoinDetail from './pages/CoinDetail'
import Settings from './pages/Settings'
import SettingsTerms from './pages/SettingsTerms'
import SettingsCoins from './pages/SettingsCoins'
import SettingsAccount from './pages/SettingsAccount'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SettingsLanguage from './pages/SettingsLanguage'
import SettingsTheme from './pages/SettingsTheme'

function Protected({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}

export default function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          {/* Public - Onboarding */}
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/pin-setup" element={<PinSetup />} />
          <Route path="/user-type" element={<UserTypeSelect />} />

          {/* Public - KYC Flow (accessible during onboarding) */}
          <Route path="/kyc-start" element={<KycStart />} />
          <Route path="/kyc-passport" element={<KycPassport />} />
          <Route path="/kyc-confirm" element={<KycConfirm />} />
          <Route path="/kyc-face" element={<KycFace />} />
          <Route path="/kyc-verify" element={<KycVerify />} />
          <Route path="/kyc-success" element={<KycSuccess />} />

          {/* Protected - Main */}
          <Route path="/home" element={<Protected><Home /></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications /></Protected>} />

          {/* Protected - History */}
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="/receipt/:id" element={<Protected><Receipt /></Protected>} />

          {/* Protected - Charging */}
          <Route path="/charge-hub" element={<Protected><ChargeHub /></Protected>} />
          <Route path="/charge-bank" element={<Protected><ChargeBank /></Protected>} />
          <Route path="/charge-coin" element={<Protected><ChargeCoin /></Protected>} />
          <Route path="/charge-triplea" element={<Protected><ChargeTripleA /></Protected>} />
          <Route path="/charge-korbit" element={<Protected><ChargeKorbit /></Protected>} />
          <Route path="/charge-korbit-processing" element={<Protected><KorbitProcessing /></Protected>} />
          <Route path="/charge-complete" element={<Protected><ChargeComplete /></Protected>} />

          {/* Protected - Payment */}
          <Route path="/payment-pin" element={<Protected><PaymentPin /></Protected>} />
          <Route path="/payment-scan" element={<Protected><PaymentScan /></Protected>} />
          <Route path="/payment-confirm" element={<Protected><PaymentConfirm /></Protected>} />

          {/* Protected - ATM */}
          <Route path="/atm-scan" element={<Protected><AtmScan /></Protected>} />
          <Route path="/atm-amount" element={<Protected><AtmAmount /></Protected>} />
          <Route path="/atm-confirm" element={<Protected><AtmConfirm /></Protected>} />

          {/* Protected - Coin Detail */}
          <Route path="/coin/:id" element={<Protected><CoinDetail /></Protected>} />

          {/* Protected - Settings */}
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/settings/terms" element={<Protected><SettingsTerms /></Protected>} />
          <Route path="/settings/coins" element={<Protected><SettingsCoins /></Protected>} />
          <Route path="/settings/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/settings/language" element={<Protected><SettingsLanguage /></Protected>} />
          <Route path="/settings/theme" element={<Protected><SettingsTheme /></Protected>} />
          <Route path="/settings/account" element={<Protected><SettingsAccount /></Protected>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <LaunchScreen />
        <ToastProvider />
      </PhoneFrame>
    </BrowserRouter>
  )
}
