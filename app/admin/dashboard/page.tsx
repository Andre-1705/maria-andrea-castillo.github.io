"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCarousel } from "@/components/job-carousel"
import { JobUploadForm } from "@/components/job-upload-form"
import { ClientsAdminPanel } from "@/components/clients-admin-panel"
import { useToast } from "@/components/ui/use-toast"
import { JobsService } from "@/lib/jobs-service"
import { ClientsService } from "@/lib/clients-service"
import { LogOut, Plus, Users, Briefcase } from "lucide-react"
import type { Database } from "@/lib/supabase"

type Job = Database['public']['Tables']['jobs']['Row']

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Record<string, Job[]>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalClients: 0,
    pendingClients: 0,
    visitorsCount: 0
  })

  // Verificar autenticación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      if (!isAuthenticated) {
        router.push("/admin")
        return
      }
      loadData()
    }
  }, [router])

  async function loadData() {
    try {
      setLoading(true)
      
      // Cargar datos en paralelo
      const [categoriesData, clientsStats] = await Promise.all([
        JobsService.getCategories(),
        ClientsService.getClientStats()
      ])

      setCategories(categoriesData)
      setSelectedCategory(categoriesData[0] || "")

      // Cargar trabajos por categoría
      const jobsByCategory: Record<string, Job[]> = {}
      for (const category of categoriesData) {
        const categoryJobs = await JobsService.getJobsByCategory(category)
        jobsByCategory[category] = categoryJobs
      }
      setJobs(jobsByCategory)

      // Actualizar estadísticas
      const totalJobs = Object.values(jobsByCategory).reduce((acc, jobs) => acc + jobs.length, 0)
      setStats({
        totalJobs,
        totalClients: clientsStats.total,
        pendingClients: clientsStats.pending,
        visitorsCount: parseInt(localStorage.getItem("visitorsCount") || "0")
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isAuthenticated")
    }
    router.push("/admin")
  }

  const handleDeleteJob = async (id: string) => {
    try {
      await JobsService.deleteJob(id)
      await loadData() // Recargar datos
      toast({
        title: "Trabajo eliminado",
        description: "El trabajo ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajo.",
        variant: "destructive"
      })
    }
  }

  const handleAddJob = async (newJob: any) => {
    try {
      await JobsService.createJob({
        ...newJob,
        category: selectedCategory,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
      await loadData() // Recargar datos
      setIsAddingJob(false)

      toast({
        title: "Trabajo añadido",
        description: "El nuevo trabajo ha sido añadido correctamente.",
      })
    } catch (error) {
      console.error('Error adding job:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar el trabajo.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    )
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
            Gestión de Trabajos
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
                      jobs={jobs[category] || []} 
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
