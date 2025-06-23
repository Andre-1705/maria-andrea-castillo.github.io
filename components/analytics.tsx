"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // En una implementación real, aquí se enviarían los datos de analítica
    // a un servicio como Google Analytics, Plausible, etc.
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    console.log(`Página visitada: ${url}`)

    // Aquí también se podría incrementar el contador de visitas en una base de datos
  }, [pathname, searchParams])

  return null
}
