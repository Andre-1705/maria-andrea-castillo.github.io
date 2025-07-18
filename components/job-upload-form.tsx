"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  image: z.string()
    .regex(/^[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|webp|gif)$/i, {
      message: "Por favor ingresa solo el nombre del archivo de imagen (ej: imagen.png)",
    }),
  link: z.string().min(2, {
    message: "El enlace es obligatorio. Ej: /jobs/25 o https://...",
  }),
  category: z.string().min(2, {
    message: "La categoría es obligatoria.",
  }),
})

interface JobUploadFormProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function JobUploadForm({
  categories,
  selectedCategory,
  onCategoryChange,
  onSubmit,
  onCancel,
}: JobUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
      category: categories[0] || "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const data = { ...values, image: `/${values.image}` }
    fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const result = await res.json()
        if (result.success) {
          toast({
            title: "Trabajo guardado",
            description: "El trabajo se guardó correctamente.",
            variant: "default"
          })
          // No limpiar ni cerrar el formulario aquí para que el usuario vea el toast
        } else {
          toast({
            title: "Error al guardar",
            description: result.error || "No se pudo guardar el trabajo.",
            variant: "destructive"
          })
        }
      })
      .catch(() => {
        toast({
          title: "Error de red",
          description: "No se pudo conectar con el servidor.",
          variant: "destructive"
        })
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Card className="bg-black/30 border-white/10 mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Añadir nuevo trabajo</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                      <Textarea placeholder="Descripción del trabajo" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del archivo de imagen</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: analisis_de_metricas.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: /jobs/25 o https://sitio.com/trabajo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar trabajo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
