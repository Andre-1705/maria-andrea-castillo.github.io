"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, User, Briefcase, Mail, Menu, X, Lock } from "lucide-react"
import { useState } from "react"

const routes = [
  {
    name: "Inicio",
    path: "/",
    icon: <Home className="h-5 w-5 mr-2" />,
  },
  {
    name: "Sobre Mí",
    path: "/about",
    icon: <User className="h-5 w-5 mr-2" />,
  },
  {
    name: "Trabajos",
    path: "/jobs",
    icon: <Briefcase className="h-5 w-5 mr-2" />,
  },
  {
    name: "Contacto",
    path: "/contact",
    icon: <Mail className="h-5 w-5 mr-2" />,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-2 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-lime-400 bg-clip-text text-transparent"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              María Andrea Castillo
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center text-base font-medium transition-colors hover:text-primary",
                pathname === route.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Lock className="h-4 w-4" />
            </Button>
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 flex flex-col gap-2 border-b border-white/10 bg-black/90 p-4 backdrop-blur-md md:hidden">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === route.path ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.icon}
                {route.name}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                <Lock className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
