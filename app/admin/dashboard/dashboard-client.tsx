"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Users, Briefcase } from "lucide-react"

interface AdminDashboardClientProps {
  jobs: Record<string, any[]>
  categories: string[]
  stats: {
    totalJobs: number
    totalClients: number
    pendingClients: number
    visitorsCount: number
  }
}

export function AdminDashboardClient({ jobs, categories, stats }: AdminDashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage?.removeItem("admin_token")
        sessionStorage?.removeItem("admin_email")
        localStorage?.removeItem("isAuthenticated")
      }
    } catch (e) {
      console.warn("Error clearing storage:", e)
    }
    router.push("/admin")
  }

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-white">{stats?.totalJobs || 0}</div>
                <p className="text-xs text-slate-400">Trabajos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-white">{stats?.totalClients || 0}</div>
                <p className="text-xs text-slate-400">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-400">{stats?.pendingClients || 0}</div>
                <p className="text-xs text-slate-400">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-400">{stats?.visitorsCount || 0}</div>
                <p className="text-xs text-slate-400">Visitantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trabajos por categoría */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Trabajos por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="flex justify-between items-center p-3 bg-slate-800 rounded border border-slate-700">
                <span className="text-white font-medium">{category}</span>
                <span className="text-slate-400 text-sm">
                  {(jobs?.[category] || []).length} trabajos
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No hay categorías disponibles</p>
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-blue-300 text-sm">
          ℹ️ Panel de administración cargado correctamente. Todos los datos están disponibles.
        </p>
      </div>
    </div>
  )
} 