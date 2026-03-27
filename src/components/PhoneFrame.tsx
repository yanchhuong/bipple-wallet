import React, { useEffect, useState } from 'react'
import { Signal, Wifi, Battery } from 'lucide-react'
import { useStore } from '../store/useStore'

function useApplyTheme() {
  const theme = useStore(s => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
      const listener = (e: MediaQueryListEvent) => root.classList.toggle('dark', e.matches)
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 500)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 500)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

export function StatusBar() {
  return (
    <div className="phone-status-bar flex items-center justify-between px-6 pt-10 pb-1 text-xs font-medium text-text-dark bg-white relative z-50">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  )
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  useApplyTheme()
  const isMobile = useIsMobile()

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900">
      <div className="phone-frame">
        {!isMobile && <div className="phone-notch" />}
        <div className="screen bg-white relative">
          {!isMobile && <StatusBar />}
          {children}
        </div>
      </div>
    </div>
  )
}
