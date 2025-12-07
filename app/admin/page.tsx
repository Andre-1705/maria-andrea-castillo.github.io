'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, Briefcase, Users, Upload as UploadIcon } from "lucide-react"
import { JobUploadForm } from "@/components/job-upload-form"

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [dashboardData, setDashboardData] = useState({ jobs: {}, categories: [], stats: { totalJobs: 0, totalClients: 0, pendingClients: 0, visitorsCount: 0 } })
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Solo verificar auth en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/validate', { method: 'GET', credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)
          setEmail(data.email || localStorage.getItem('admin_email') || '')
          loadDashboardData()
          return
        }
      } catch (err) {
        console.error('Error verificando auth', err)
      }

      // Si falla, limpiar estado local
      localStorage?.removeItem('admin_token')
      localStorage?.removeItem('admin_email')
      setIsLoggedIn(false)
    }

    checkAuth()
  }, [mounted])

  const loadDashboardData = async () => {
    try {
      setDashboardLoading(true)
      const jobsRes = await fetch('/api/jobs')
      if (!jobsRes.ok) throw new Error('Error cargando trabajos')
      
      const jobsByCategory = await jobsRes.json()
      const customOrder = [
        "Desarrollo Web",
        "Comunicación Digital",
        "Marketing Digital",
        "Producción Audiovisual",
      ]
      const categories = customOrder.filter(cat => Object.keys(jobsByCategory || {}).includes(cat))

      const stats = {
        totalJobs: Object.values(jobsByCategory || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
        totalClients: 0,
        pendingClients: 0,
        visitorsCount: 0,
      }

      setDashboardData({
        jobs: jobsByCategory || {},
        categories,
        stats,
      })
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setDashboardLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      console.log('📝 Intentando login con:', email)
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log('✅ Login exitoso!')
        // Guardar solo el email para mostrar; el token vive en cookie httpOnly
        localStorage.setItem('admin_email', email)
        
        setIsLoggedIn(true)
        setSuccess('✅ Login exitoso!')
        setPassword('')
        await loadDashboardData()
      } else {
        setError(data.error || 'Credenciales incorrectas')
      }
    } catch (err: any) {
      setError('Error al conectar')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (err) {
      console.error('Error al cerrar sesión', err)
    }

    localStorage?.removeItem('admin_email')
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setShowUploadForm(false)
  }

  const handleJobUploaded = () => {
    setShowUploadForm(false)
    loadDashboardData() // Recargar datos después de subir
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ color: '#fff' }}>Cargando...</div>
      </div>
    )
  }

  // Si no está autenticado, mostrar solo el formulario de login
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #000, #1a1a2e)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          background: '#111',
          border: '1px solid #333',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#fff', marginBottom: '10px', fontSize: '24px' }}>
              Panel Administrativo
            </h1>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Ingresa tus credenciales
            </p>
          </div>

          {success && (
            <div style={{
              background: '#10b981',
              color: '#fff',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ✅ {success}
            </div>
          )}

          {error && (
            <div style={{
              background: '#ef4444',
              color: '#fff',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '6px', fontSize: '14px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="mariaandreacastilloarregui@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '6px', fontSize: '14px' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: loading ? '#555' : '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#1a1a2e',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#999'
          }}>
            <p style={{ margin: '0 0 6px 0' }}>📧 Email: mariaandreacastilloarregui@gmail.com</p>
            <p style={{ margin: '0 0 6px 0' }}>🔐 Contraseña: admin123</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000, #1a1a2e)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Panel de Administración
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>

          {/* Estadísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Briefcase style={{ color: '#3b82f6', width: '24px', height: '24px' }} />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                      {dashboardData.stats.totalJobs}
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Trabajos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users style={{ color: '#10b981', width: '24px', height: '24px' }} />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                      {dashboardData.stats.totalClients}
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Clientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botón para subir trabajos */}
          <div style={{ marginBottom: '30px' }}>
            <Button 
              onClick={() => setShowUploadForm(true)}
              style={{ background: '#3b82f6', color: '#fff' }}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Subir Nuevo Trabajo
            </Button>
          </div>

          {/* Formulario de subida */}
          {showUploadForm && (
            <div style={{ marginBottom: '30px' }}>
              <JobUploadForm
                categories={dashboardData.categories}
                onCancel={() => setShowUploadForm(false)}
                onSubmit={handleJobUploaded}
              />
            </div>
          )}

          {/* Categorías */}
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', marginTop: 0 }}>Categorías disponibles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {dashboardData.categories.map(cat => (
                <div key={cat} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', padding: '12px' }}>
                  <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>{cat}</p>
                  <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                    {dashboardData.jobs[cat]?.length || 0} trabajos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
