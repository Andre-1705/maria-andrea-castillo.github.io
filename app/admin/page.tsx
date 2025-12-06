'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

      console.log('📊 Response status:', response.status)
      const data = await response.json()
      console.log('📦 Response data:', data)

      if (response.ok && data.success) {
        console.log('✅ Login exitoso!')
        setSuccess('¡Login exitoso! Redirigiendo...')
        
        // Guardar en localStorage (persiste incluso después de cerrar navegador)
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_email', email)
        console.log('💾 Credenciales guardadas en localStorage')

        // Usar window.location para forzar navegación completa
        setTimeout(() => {
          console.log('🔄 Redirigiendo a /admin/dashboard')
          window.location.href = '/admin/dashboard'
        }, 1000)
      } else {
        console.log('❌ Login fallido:', data.error)
        setError(data.error || 'Credenciales incorrectas')
      }
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError('Error al conectar: ' + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

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
          <p style={{ margin: '0' }}>🔐 Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
