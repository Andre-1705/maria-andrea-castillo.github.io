"use client"

import { useState, useEffect } from "react"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Database } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

type Job = Database['public']['Tables']['jobs']['Row']

export default async function JobPage({ params }) {
  // Obtener datos del trabajo por ID usando fetch
  const res = await fetch(`/api/jobs/${params.id}`)
  const jobData = await res.json()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true)
        setJob(jobData)
      } catch (error) {
        console.error('Error loading job:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar el proyecto. Por favor, intenta de nuevo.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container py-12 md:py-16">
        <h1 className="text-2xl font-bold">Trabajo no encontrado</h1>
        <Link href="/jobs">
          <Button variant="outline" className="mt-4">&larr; Volver a Proyectos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <Link href="/jobs">
            <Button variant="outline" className="self-start mb-4">
              &larr; Volver a Proyectos
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
          <p className="text-lg text-white/80">{job.description}</p>
          <div className="mt-4">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {job.category}
            </span>
          </div>
        </div>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          {job.image ? (
            <Image
              src={job.image}
              alt={job.title}
              fill
              className="object-cover"
            />
          ) : job.video ? (
            <video
              src={job.video}
              controls
              className="object-contain w-full h-full bg-black rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Sin imagen o video</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 