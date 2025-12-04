'use client'

import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!reCaptchaKey) {
    console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está configurado. reCAPTCHA deshabilitado.')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
