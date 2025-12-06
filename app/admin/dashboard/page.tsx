'use client'

import { AdminDashboardClient } from './dashboard-client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState({ jobs: {}, categories: [], stats: { totalJobs: 0, totalClients: 0, pendingClients: 0, visitorsCount: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Solo ejecutar en el cliente
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log('🔐 Dashboard: Checking authentication...')
    
    // Verificar autenticación
    const token = localStorage?.getItem('admin_token')
    const email = localStorage?.getItem('admin_email')
    
    console.log('🔑 Token exists:', !!token)
    console.log('📧 Email exists:', !!email)
    
    if (!token || !email) {
      console.log('❌ Not authenticated, redirecting to /admin')
      window.location.href = '/admin'
      return
    }
    
    console.log('✅ User is authenticated')
    setIsAuthenticated(true)

    const loadData = async () => {
      try {
        setLoading(true)
        console.log('📡 Fetching jobs from /api/jobs')
        const jobsRes = await fetch('/api/jobs')

        if (!jobsRes.ok) {
          console.error('❌ Jobs fetch failed:', jobsRes.status)
          throw new Error('Error cargando trabajos')
        }

        const jobsByCategory = await jobsRes.json()
        console.log('✅ Jobs loaded:', Object.keys(jobsByCategory).length, 'categories')
        
        const customOrder = [
          "Desarrollo Web",
          "Comunicación Digital",
          "Marketing Digital",
          "Producción Audiovisual",
        ]
        const categories = customOrder.filter(cat => Object.keys(jobsByCategory || {}).includes(cat))

        // Calcular stats básicos desde los jobs
        const stats = {
          totalJobs: Object.values(jobsByCategory || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
          totalClients: 0,
          pendingClients: 0,
          visitorsCount: 0,
        }

        setData({
          jobs: jobsByCategory || {},
          categories,
          stats,
        })
        console.log('✅ Dashboard data ready')
      } catch (err: any) {
        console.error('❌ Error loading dashboard:', err)
        setError(err.message || 'Error cargando datos')
        // Usar datos vacíos como fallback
        setData({ jobs: {}, categories: [], stats: { totalJobs: 0, totalClients: 0, pendingClients: 0, visitorsCount: 0 } })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mounted, router])

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
