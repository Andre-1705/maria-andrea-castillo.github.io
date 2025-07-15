"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react"
import { VisitorCounter } from "@/components/visitor-counter"
import { ClientsService } from "@/lib/clients-service"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  phone: z.string().min(6, {
    message: "Por favor ingresa un número de teléfono válido.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
})

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactCount, setContactCount] = useState(0)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Enviar datos al endpoint local de Next.js
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
          company: values.company,
        message: values.message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al enviar el formulario:', errorText);
        toast({
          title: "Error al enviar mensaje",
          description: errorText || "Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return;
      }

      setContactCount((prev) => prev + 1)
      setSuccess(true)

      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarme. Te responderé a la brevedad.",
      })

      form.reset()
    } catch (error) {
      console.error('Error inesperado:', error)
      toast({
        title: "Error al enviar mensaje",
        description: "Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Contacto</h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle>Envíame un mensaje</CardTitle>
            <CardDescription>Completa el formulario y me pondré en contacto contigo lo antes posible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 9 11 1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de tu empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea placeholder="¿En qué puedo ayudarte?" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
              {success && (
                <p className="text-green-600 font-semibold text-center mt-4">
                  ¡Tu formulario fue enviado exitosamente!
                </p>
              )}
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Información de contacto</CardTitle>
              <CardDescription>Puedes contactarme directamente a través de estos medios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>mariaandreacastilloarregui@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+54 9 11 5926-4364</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Caba, Argentina</span>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Redes sociales</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.linkedin.com/in/mariaandreacastillo/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.tiktok.com/@maria.andrea.castillo" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12.75 2.25h2.25a.75.75 0 0 1 .75.75v2.25a3.75 3.75 0 0 0 3.75 3.75h.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-1.5v4.5a6.75 6.75 0 1 1-6.75-6.75.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75 2.25 2.25 0 1 0 2.25 2.25V2.25z" />
                      </svg>
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.instagram.com/maria.andrea.castillo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.facebook.com/mariaandreacastilllo" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Visitantes totales:</span>
                <VisitorCounter type="visitors" />
              </div>
              <div className="flex justify-between items-center">
                <span>Contactos recibidos:</span>
                <span className="text-xl font-bold">{contactCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
