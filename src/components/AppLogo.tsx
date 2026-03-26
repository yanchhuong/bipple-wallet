import type { ImgHTMLAttributes } from 'react'

/** Beple Wallet mark (PNG with transparency). */
export const APP_LOGO_SRC = '/beple-logo.png'

type AppLogoProps = ImgHTMLAttributes<HTMLImageElement>

export function AppLogo({ className = '', alt = '', ...rest }: AppLogoProps) {
  return (
    <img
      src={APP_LOGO_SRC}
      alt={alt}
      draggable={false}
      decoding="async"
      {...rest}
      className={`object-contain ${className}`.trim()}
    />
  )
}
