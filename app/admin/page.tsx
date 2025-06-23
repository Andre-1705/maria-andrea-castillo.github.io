"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function AdminLoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulación de autenticación
    // En una implementación real, esto se conectaría a una API de autenticación
    setTimeout(() => {
      setIsSubmitting(false)

      // Credenciales de ejemplo (en una implementación real, esto se verificaría en el servidor)
      if (values.username === "admin" && values.password === "password") {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración.",
        })

        // Guardar estado de autenticación
        localStorage.setItem("isAuthenticated", "true")

        // Redirigir al panel de administración
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  return (
    <div className="container py-12 max-w-md">
      <Card className="bg-black/50 border-white/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acceso Administrativo</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>Para fines de demostración:</p>
                <p>
                  Usuario: <strong>admin</strong>
                </p>
                <p>
                  Contraseña: <strong>password</strong>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
