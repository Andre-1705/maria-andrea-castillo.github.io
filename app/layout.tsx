import type React from "react"
import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

const lora = Lora({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "María Andrea Castillo - IT & Comunicación",
  description: "Profesional en IT & Comunicación",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${lora.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
