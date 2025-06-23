"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCarousel } from "@/components/job-carousel"
import { useToast } from "@/components/ui/use-toast"
import { INITIAL_JOBS, Job, JobCategory } from "./jobs-data"

export { INITIAL_JOBS };
export default function JobsPage() {
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const { toast } = useToast()

  // En una implementación real, cargaríamos los datos desde una API
  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      toast({
        title: "Trabajos cargados",
        description: "Se han cargado todos los proyectos correctamente.",
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [toast])

  const categories = [
    { key: "Desarrollo Web", label: "Desarrollo Web" },
    { key: "Comunicación Digital", label: "Comunicación Digital" },
    { key: "Marketing Digital", label: "Marketing Digital" },
    { key: "Producción Audiovisual", label: "Producción Audiovisual" },
    { key: "Consultoría IT", label: "Otros" }
  ] as { key: JobCategory, label: string }[];

  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center mt-8">Proyectos y Trabajos</h1>

      <Tabs defaultValue={categories[0].key} className="w-full">
        <TabsList className="flex justify-between mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.key} value={category.key} className="flex-1 mx-1 text-base font-medium min-w-0">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.key} value={category.key} className="mt-4">
            <JobCarousel title={category.label} jobs={jobs[category.key]} isAdmin={false} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
