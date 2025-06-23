"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCarousel } from "@/components/job-carousel"
import { JobUploadForm } from "@/components/job-upload-form"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Plus } from "lucide-react"

// Datos de ejemplo para los carruseles (igual que en la página de jobs)
const INITIAL_JOBS = {
  "Desarrollo Web": [
    {
      id: "1",
      title: "Rediseño de Portal Corporativo",
      description:
        "Modernización completa del portal web para mejorar la experiencia de usuario y optimizar la conversión.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/1",
    },
    {
      id: "2",
      title: "E-commerce para Retail",
      description:
        "Implementación de plataforma de comercio electrónico con integración a sistemas de inventario y pagos.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/2",
    },
  ],
  "Comunicación Digital": [
    {
      id: "3",
      title: "Campaña de Lanzamiento",
      description:
        "Estrategia integral para el lanzamiento de nuevo producto tecnológico en mercados latinoamericanos.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/3",
    },
    {
      id: "4",
      title: "Gestión de Crisis",
      description:
        "Manejo de comunicación durante crisis corporativa con impacto en redes sociales y medios tradicionales.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/4",
    },
  ],
  "Consultoría IT": [
    {
      id: "5",
      title: "Transformación Digital",
      description:
        "Asesoría para la implementación de procesos de transformación digital en empresa del sector financiero.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/5",
    },
    {
      id: "6",
      title: "Optimización de Infraestructura",
      description: "Análisis y recomendaciones para la mejora de infraestructura tecnológica con enfoque en seguridad.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/6",
    },
  ],
  "Marketing Digital": [
    {
      id: "7",
      title: "Estrategia SEO/SEM",
      description:
        "Desarrollo e implementación de estrategia para mejorar posicionamiento en buscadores y aumentar tráfico.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/7",
    },
    {
      id: "8",
      title: "Campaña en Redes Sociales",
      description: "Gestión de campaña multicanal en redes sociales para incrementar engagement y conversiones.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/8",
    },
  ],
  "Producción Audiovisual": [
    {
      id: "9",
      title: "Video Corporativo",
      description: "Producción de video institucional para presentación de servicios y valores de la empresa.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/9",
    },
    {
      id: "10",
      title: "Serie de Tutoriales",
      description: "Creación de serie de videos tutoriales para capacitación de usuarios en nueva plataforma.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/10",
    },
  ],
  Eventos: [
    {
      id: "11",
      title: "Conferencia Tecnológica",
      description: "Organización de conferencia sobre tendencias tecnológicas con ponentes internacionales.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/11",
    },
    {
      id: "12",
      title: "Webinar Series",
      description: "Coordinación de serie de webinars sobre transformación digital para ejecutivos de nivel C.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/12",
    },
  ],
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(INITIAL_JOBS)[0])

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/admin")
  }

  const handleDeleteJob = (id: string) => {
    // Crear una copia profunda del objeto jobs
    const updatedJobs = JSON.parse(JSON.stringify(jobs))

    // Encontrar la categoría que contiene el trabajo a eliminar
    Object.keys(updatedJobs).forEach((category) => {
      updatedJobs[category] = updatedJobs[category].filter((job: any) => job.id !== id)
    })

    setJobs(updatedJobs)

    toast({
      title: "Trabajo eliminado",
      description: "El trabajo ha sido eliminado correctamente.",
    })
  }

  const handleAddJob = (newJob: any) => {
    // Crear una copia profunda del objeto jobs
    const updatedJobs = JSON.parse(JSON.stringify(jobs))

    // Generar un ID único
    const newId = Date.now().toString()

    // Añadir el nuevo trabajo a la categoría seleccionada
    updatedJobs[selectedCategory] = [
      ...updatedJobs[selectedCategory],
      {
        id: newId,
        ...newJob,
        link: `/jobs/${newId}`,
      },
    ]

    setJobs(updatedJobs)
    setIsAddingJob(false)

    toast({
      title: "Trabajo añadido",
      description: "El nuevo trabajo ha sido añadido correctamente.",
    })
  }

  const categories = Object.keys(jobs)

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle>Gestión de Trabajos</CardTitle>
            <CardDescription>Administra los trabajos que se muestran en la sección Jobs.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAddingJob ? (
              <JobUploadForm
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSubmit={handleAddJob}
                onCancel={() => setIsAddingJob(false)}
              />
            ) : (
              <div className="mb-6">
                <Button onClick={() => setIsAddingJob(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir nuevo trabajo
                </Button>
              </div>
            )}

            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <JobCarousel title={category} jobs={jobs[category]} isAdmin={true} onDelete={handleDeleteJob} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle>Estadísticas del Sitio</CardTitle>
            <CardDescription>Información sobre visitantes y contactos recibidos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Visitantes Totales</h3>
                <p className="text-3xl font-bold">{localStorage.getItem("visitorsCount") || "0"}</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Contactos Recibidos</h3>
                <p className="text-3xl font-bold">{localStorage.getItem("contactsCount") || "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
