"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCarousel } from "@/components/job-carousel"
import { useToast } from "@/components/ui/use-toast"
import { JobsService } from "@/lib/jobs-service"
import type { Database } from "@/lib/supabase"

type Job = Database['public']['Tables']['jobs']['Row']

export default function JobsPage() {
  const [jobs, setJobs] = useState<Record<string, Job[]>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true)
        
        // Cargar categorías
        const categoriesData = await JobsService.getCategories()
        setCategories(categoriesData)

        // Cargar trabajos por categoría
        const jobsByCategory: Record<string, Job[]> = {}
        
        for (const category of categoriesData) {
          const categoryJobs = await JobsService.getJobsByCategory(category)
          jobsByCategory[category] = categoryJobs
        }

        setJobs(jobsByCategory)

        toast({
          title: "Trabajos cargados",
          description: "Se han cargado todos los proyectos correctamente.",
        })
      } catch (error) {
        console.error('Error loading jobs:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los trabajos. Por favor, intenta de nuevo.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [toast])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center mt-8">Proyectos y Trabajos</h1>

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
                isAdmin={false} 
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay proyectos disponibles.</p>
        </div>
      )}
    </div>
  )
}
