"use client"

import { useState, useEffect } from "react"

interface VisitorCounterProps {
  type: "visitors" | "contacts"
}

export function VisitorCounter({ type }: VisitorCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sessionKey = type === "visitors" ? "hasVisited" : "hasContacted"
    const hasVisited = sessionStorage.getItem(sessionKey)
    const url = `/api/visitors?type=${type}`
    if (!hasVisited) {
      // Primera visita/contacto de la sesión: incrementa el contador real
      fetch(url, { method: "POST" })
        .then(res => res.json())
        .then(data => {
          setCount(data.count)
          sessionStorage.setItem(sessionKey, "true")
        })
    } else {
      // Ya visitó/contactó en la sesión: solo obtiene el contador
      fetch(url)
        .then(res => res.json())
        .then(data => setCount(data.count))
    }
  }, [type])

  return <span className="text-xl font-bold">{count}</span>
}
