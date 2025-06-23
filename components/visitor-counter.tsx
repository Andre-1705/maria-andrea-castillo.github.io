"use client"

import { useState, useEffect } from "react"

interface VisitorCounterProps {
  type: "visitors" | "contacts"
}

export function VisitorCounter({ type }: VisitorCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // En una implementación real, esto se conectaría a una API
    // para obtener y actualizar el contador
    const storedCount = localStorage.getItem(`${type}Count`)
    const initialCount = storedCount ? Number.parseInt(storedCount, 10) : 0

    if (type === "visitors") {
      // Incrementar contador de visitantes solo una vez por sesión
      const hasVisited = sessionStorage.getItem("hasVisited")
      if (!hasVisited) {
        const newCount = initialCount + 1
        setCount(newCount)
        localStorage.setItem(`${type}Count`, newCount.toString())
        sessionStorage.setItem("hasVisited", "true")
      } else {
        setCount(initialCount)
      }
    } else {
      setCount(initialCount)
    }
  }, [type])

  return <span className="text-xl font-bold">{count}</span>
}
