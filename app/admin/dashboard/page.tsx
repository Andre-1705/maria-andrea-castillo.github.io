'use client'

import { AdminDashboardClient } from './dashboard-client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const [data, setData] = useState({ jobs: {}, categories: [], stats: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación primero
    const checkAuth = () => {
      try {
        const token = localStorage?.getItem('admin_token')
        const email = localStorage?.getItem('admin_email')
        if (token && email) {
          setIsAuthenticated(true)
        } else {
          router.push('/admin')
          return false
        }
      } catch {
        // Si hay error al acceder a localStorage, permitir que continúe
        setIsAuthenticated(true)
      }
      return true
    }

    if (!checkAuth()) return

    const loadData = async () => {
      try {
        setLoading(true)
        const jobsRes = await fetch('/api/jobs')

        if (!jobsRes.ok) {
          throw new Error('Error cargando trabajos')
        }

        const jobsByCategory = await jobsRes.json()
        
        const customOrder = [
          "Desarrollo Web",
          "Comunicación Digital",
          "Marketing Digital",
          "Producción Audiovisual",
        ]
        const categories = customOrder.filter(cat => Object.keys(jobsByCategory || {}).includes(cat))

        // Calcular stats básicos desde los jobs
        const stats = {
          totalProjects: Object.values(jobsByCategory || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
          totalCategories: categories.length,
        }

        setData({
          jobs: jobsByCategory || {},
          categories,
          stats,
        })
      } catch (err: any) {
        console.error('Error loading dashboard:', err)
        setError(err.message || 'Error cargando datos')
        // Usar datos vacíos como fallback
        setData({ jobs: {}, categories: [], stats: {} })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error && Object.keys(data.jobs).length === 0) {
    return (
      <div className="container py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h1 className="text-lg font-semibold text-destructive">Advertencia</h1>
          <p className="text-sm text-muted-foreground mt-2">Los datos pueden no estar disponibles. Intenta recargar la página.</p>
        </div>
        <AdminDashboardClient 
          jobs={data.jobs} 
          categories={data.categories}
          stats={data.stats}
        />
      </div>
    )
  }

  return (
    <AdminDashboardClient 
      jobs={data.jobs} 
      categories={data.categories}
      stats={data.stats}
    />
  )
}
