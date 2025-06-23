import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/serv_programa_comunica5-SvqOYkP0kYCyovnd8vlcEerQhobvz7.webp"
          alt="Fondo tecnológico"
          fill
          priority
          className="object-contain object-center"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Título y subtítulo en la parte superior */}
      <div className="container relative z-10 pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">IT & Comunicación</h1>
          <p 
            className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto whitespace-nowrap"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Soluciones tecnológicas y estrategias de comunicación para potenciar tu presencia digital
          </p>
        </div>
      </div>

      {/* Contenido principal centrado */}
      <div className="container relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16 text-center">
        <div className="mt-56">
          <Link href="/contact">
            <Button 
              size="lg" 
              className="text-lg px-8 border-2 border-green-900 hover:border-green-700 transition-colors"
            >
              Contáctame
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
