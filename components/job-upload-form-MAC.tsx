"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon, Video } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  category: z.string().min(2, {
    message: "La categoría es obligatoria.",
  }),
})

interface JobUploadFormProps {
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  onCancel?: () => void
  onSubmit?: (data: any) => void
}

export function JobUploadForm({
  categories = [],
  selectedCategory = "",
  onCategoryChange = () => {},
  onCancel = () => {},
  onSubmit = () => {},
}: JobUploadFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: selectedCategory || categories[0] || "",
    },
  })

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const validImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    
    if (validImageTypes.includes(file.type)) {
      setFileType('image')
    } else if (validVideoTypes.includes(file.type)) {
      setFileType('video')
    } else {
      toast({
        title: "Archivo inválido",
        description: "Solo PNG, JPG, WEBP, GIF (imágenes) o MP4, WEBM, MOV (videos)",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast({
        title: "Archivo requerido",
        description: "Por favor sube una imagen o video",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description)
    formData.append('category', values.category)
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/jobs/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (result.success) {
        toast({
          title: "✅ Trabajo guardado",
          description: `${values.title} se guardó correctamente en ${values.category}`,
        })
        form.reset()
        setPreview(null)
        setFileType(null)
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        toast({
          title: "Error al guardar",
          description: result.error || "No se pudo guardar el trabajo.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error de red",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-black/30 border-white/10 mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">📸 Añadir nuevo trabajo</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Preview */}
            {preview && (
              <div className="relative w-full bg-black/50 rounded-lg overflow-hidden border-2 border-primary/50">
                {fileType === 'image' ? (
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                ) : (
                  <video src={preview} controls className="w-full h-64 object-cover" />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreview(null)
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Cambiar
                </Button>
              </div>
            )}

            {/* Upload Area */}
            <div className="space-y-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Archivo (imagen o video)
              </label>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Subir archivo (imagen o video)"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 transition"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
              >
                {!preview ? (
                  <div>
                    <Upload className="h-10 w-10 mx-auto mb-2 text-primary/60" />
                    <p className="text-sm font-medium">Haz clic para subir imagen o video</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF (fotos) o MP4, WEBM, MOV (videos)</p>
                  </div>
                ) : (
                  <div className="text-sm">
                    {fileType === 'image' ? (
                      <><ImageIcon className="h-5 w-5 mx-auto mb-1" /> Imagen seleccionada</>
                    ) : (
                      <><Video className="h-5 w-5 mx-auto mb-1" /> Video seleccionado</>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título del trabajo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe el trabajo en detalle..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedFile}>
                {isSubmitting ? "Guardando..." : "Guardar trabajo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
