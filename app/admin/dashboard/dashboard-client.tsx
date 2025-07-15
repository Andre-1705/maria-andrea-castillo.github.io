"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCarousel } from "@/components/job-carousel"
import { JobUploadForm } from "@/components/job-upload-form"
import { ClientsAdminPanel } from "@/components/clients-admin-panel"
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isAuthenticated")
    }
    router.push("/admin")
  }

  const handleDeleteJob = async (id: string) => {
    try {
      setLoading(true)
      await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      // Recargar trabajos
      const res = await fetch("/api/jobs")
      const updatedJobs = await res.json()
      setJobsState(updatedJobs)
      toast({
        title: "Trabajo eliminado",
        description: "El trabajo ha sido eliminado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajo.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddJob = async (newJob: any) => {
    try {
      setLoading(true)
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newJob,
          category: selectedCategory,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      })
      // Recargar trabajos
      const res = await fetch("/api/jobs")
      const updatedJobs = await res.json()
      setJobsState(updatedJobs)
      setIsAddingJob(false)
      toast({
        title: "Trabajo añadido",
        description: "El nuevo trabajo ha sido añadido correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el trabajo.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
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
                <div className="text-2xl font-bold">{stats.totalClients}</div>
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
                <div className="text-2xl font-bold text-yellow-500">{stats.pendingClients}</div>
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
                <div className="text-2xl font-bold text-blue-500">{stats.visitorsCount}</div>
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
            Gestión de Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <div className="space-y-6">
            {/* Formulario para agregar trabajos */}
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
                  <JobUploadForm
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    onSubmit={handleAddJob}
                    onCancel={() => setIsAddingJob(false)}
                  />
                </CardContent>
              )}
            </Card>

            {/* Gestión de trabajos existentes */}
            {categories.length > 0 ? (
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="flex justify-between mb-8">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="flex-1 mx-1 text-base font-medium min-w-0">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <JobCarousel 
                      title={category} 
                      jobs={jobsState[category] || []} 
                      isAdmin={true}
                      onDelete={handleDeleteJob}
                    />
                  </TabsContent>
                ))}
              </Tabs>
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