"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type Job = {
  id: string;
  title: string;
  description: string;
  image: string;
  video: string;
  link: string;
  category: string;
}

type JobInsert = {
  title: string;
  description: string;
  image: string;
  video: string;
  link: string;
  category: string;
}

export function JobAdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<JobInsert>({
    title: "",
    description: "",
    image: "",
    video: "",
    link: "",
    category: ""
  })
  const { toast } = useToast()

  const categories = [
    "Desarrollo Web",
    "Comunicación Digital", 
    "Marketing Digital",
    "Producción Audiovisual",
    "Consultoría IT",
    "Eventos"
  ]

  useEffect(() => {
    loadJobs()
  }, [])

  async function loadJobs() {
    try {
      setLoading(true)
      const data = await fetch('/api/jobs').then(res => res.json())
      console.log('📦 Datos recibidos de /api/jobs:', data)
      
      // Adaptar si la respuesta es un objeto por categorías
      const allJobs: Job[] = []
      
      if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((job: any) => {
              allJobs.push({
                ...job,
                category: category
              })
            })
          }
        })
      }
      
      console.log('✅ Trabajos procesados:', allJobs)
      setJobs(allJobs)
    } catch (error) {
      console.error('❌ Error cargando trabajos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los trabajos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      if (editingJob) {
        // Actualizar trabajo (puedes crear un endpoint /api/jobs/[id] si lo necesitas)
        await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        toast({ title: "Éxito", description: "Trabajo actualizado correctamente" })
      } else {
        await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: Date.now().toString() })
        })
        toast({ title: "Éxito", description: "Trabajo creado correctamente" })
      }
      
      setEditingJob(null)
      setFormData({ title: "", description: "", image: "", video: "", link: "", category: "" })
      loadJobs()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar el trabajo", variant: "destructive" })
    }
  }

  function handleEdit(job: Job) {
    setEditingJob(job)
    setFormData({
      title: job.title,
      description: job.description,
      image: job.image,
      video: job.video || "",
      link: job.link,
      category: job.category
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar este trabajo?")) return
    
    try {
      await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      })
      toast({ title: "Éxito", description: "Trabajo eliminado correctamente" })
      loadJobs()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el trabajo", variant: "destructive" })
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingJob ? "Editar Trabajo" : "Crear Nuevo Trabajo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="URL de la imagen"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
              />
              <Input
                placeholder="URL del video (opcional)"
                value={formData.video}
                onChange={(e) => setFormData({...formData, video: e.target.value})}
              />
            </div>
            
            <Input
              placeholder="Enlace"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              required
            />
            
            <div className="flex gap-2">
              <Button type="submit">
                {editingJob ? "Actualizar" : "Crear"}
              </Button>
              {editingJob && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditingJob(null)
                    setFormData({
                      title: "",
                      description: "",
                      image: "",
                      video: "",
                      link: "",
                      category: ""
                    })
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trabajos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(job)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(job.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 