'use client'

import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  // En cliente, acceder a variables públicas de forma segura
  const reCaptchaKey = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    : (typeof window !== 'undefined' ? (window as any).__RECAPTCHA_KEY__ : null)

  // Si no hay clave, devolver children sin protección reCAPTCHA
  if (!reCaptchaKey) {
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
