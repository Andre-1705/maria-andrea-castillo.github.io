"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, Building, Calendar, MessageSquare, CheckCircle, XCircle, Clock, UserCheck } from "lucide-react"

type Client = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  status: 'pending' | 'contacted' | 'completed' | 'rejected'
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
  contacted: { label: 'Contactado', color: 'bg-blue-500', icon: UserCheck },
  completed: { label: 'Completado', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rechazado', color: 'bg-red-500', icon: XCircle },
}

export function ClientsAdminPanel() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
    rejected: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      setLoading(true)
      const [clientsData, statsData, visitorsData] = await Promise.all([
        fetch('/api/clients').then(res => res.json()),
        fetch('/api/clients/stats').then(res => res.json()),
        fetch('/api/visitors?type=visitors').then(res => res.json())
      ])
      setClients(clientsData)
      setStats(statsData)
      setVisitors(visitorsData.count || 0)
    } catch (error) {
      console.error('Error loading clients:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateClientStatus(clientId: string, newStatus: Client['status']) {
    try {
      await fetch(`/api/clients/${clientId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      await loadClients() // Recargar datos
      toast({
        title: "Estado actualizado",
        description: "El estado del cliente se actualizó correctamente.",
      })
    } catch (error) {
      console.error('Error updating client status:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del cliente.",
        variant: "destructive"
      })
    }
  }

  async function deleteClient(clientId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return
    }

    try {
      await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })
      await loadClients() // Recargar datos
      toast({
        title: "Cliente eliminado",
        description: "El cliente se eliminó correctamente.",
      })
    } catch (error) {
      console.error('Error deleting client:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive"
      })
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">{visitors}</div>
            <p className="text-xs text-muted-foreground">Visitantes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-500">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Contactos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400/10 to-blue-500/5 border-blue-400/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground">Contactados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rechazados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
          <CardDescription>
            Administra los mensajes de contacto recibidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pendientes ({stats.pending})</TabsTrigger>
              <TabsTrigger value="contacted">Contactados ({stats.contacted})</TabsTrigger>
              <TabsTrigger value="completed">Completados ({stats.completed})</TabsTrigger>
              <TabsTrigger value="rejected">Rechazados ({stats.rejected})</TabsTrigger>
            </TabsList>

            {(['all', 'pending', 'contacted', 'completed', 'rejected'] as const).map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="space-y-4">
                  {clients
                    .filter(client => status === 'all' || client.status === status)
                    .map((client) => {
                      const statusInfo = statusConfig[client.status]
                      const StatusIcon = statusInfo.icon

                      return (
                        <Card key={client.id} className="bg-black/20 border-white/10">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">{client.name}</h3>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(client.created_at)}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4" />
                                  {client.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4" />
                                  {client.phone}
                                </div>
                                {client.company && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Building className="w-4 h-4" />
                                    {client.company}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                  <MessageSquare className="w-4 h-4 mt-0.5" />
                                  <span className="line-clamp-3">{client.message}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {client.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateClientStatus(client.id, 'contacted')}
                                  >
                                    Marcar como contactado
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateClientStatus(client.id, 'rejected')}
                                  >
                                    Rechazar
                                  </Button>
                                </>
                              )}
                              {client.status === 'contacted' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateClientStatus(client.id, 'completed')}
                                  >
                                    Marcar como completado
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateClientStatus(client.id, 'rejected')}
                                  >
                                    Rechazar
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteClient(client.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  
                  {clients.filter(client => status === 'all' || client.status === status).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay clientes en esta categoría.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 