"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Plus, Users, Briefcase } from "lucide-react"

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
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "")
  const [jobsState, setJobsState] = useState(jobs)
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

  const handleDeleteJob = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete job")
      
      // Recargar trabajos
      const jobsRes = await fetch("/api/jobs")
      const updatedJobs = await jobsRes.json()
      setJobsState(updatedJobs)
      toast({
        title: "Trabajo eliminado",
        description: "El trabajo ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajo.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Lazy load components to avoid errors
  const JobCarousel = lazy(() => import("@/components/job-carousel").then(m => ({ default: m.JobCarousel })).catch(() => ({ default: () => <div className="text-muted-foreground">Error cargando carrusel</div> })))
  const JobUploadForm = lazy(() => import("@/components/job-upload-form").then(m => ({ default: m.JobUploadForm })).catch(() => ({ default: () => <div className="text-muted-foreground">Error cargando formulario</div> })))
  const ClientsAdminPanel = lazy(() => import("@/components/clients-admin-panel").then(m => ({ default: m.ClientsAdminPanel })).catch(() => ({ default: () => <div className="text-muted-foreground">Error cargando panel de clientes</div> })))

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                <p className="text-xs text-muted-foreground">Trabajos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-500">{stats?.pendingClients || 0}</div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-500">{stats?.visitorsCount || 0}</div>
                <p className="text-xs text-muted-foreground">Visitantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Gestión
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <div className="space-y-6 text-white">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Agregar Nuevo Trabajo</CardTitle>
                    <CardDescription>
                      Añade un nuevo proyecto a tu portafolio
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingJob(!isAddingJob)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isAddingJob ? "Cancelar" : "Agregar Trabajo"}
                  </Button>
                </div>
              </CardHeader>
              {isAddingJob && (
                <CardContent>
                  <JobUploadForm categories={categories} selectedCategory={selectedCategory} />
                </CardContent>
              )}
            </Card>

            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-semibold">{category}</h3>
                    <JobCarousel 
                      title={category} 
                      jobs={jobsState[category] || []} 
                      isAdmin={true}
                      onDelete={handleDeleteJob}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay categorías disponibles.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <ClientsAdminPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { lazy } from 'react' 