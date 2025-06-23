import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center ml-4">Sobre Mí</h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex justify-center items-center mt-12 -ml-16">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-black/40 shadow-2xl shadow-black/50">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/selfie%20profesional.jpg-AQ3mpWyuHXOJhiwiOl0ccjTVBKEWCI.jpeg"
              alt="María Andrea Castillo"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="space-y-6 text-left -ml-36 mr-0 text-justify">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-lime-400 bg-clip-text text-transparent ml-72 mb-8" style={{ fontFamily: 'Dancing Script, cursive' }}>
            María Andrea Castillo
          </h2>

          <p className="text-lg text-white/80">
            Amo la comunicación integral. Actualmente, me encuentro abocada al desarrollo web y a la creación de proyectos que integran tecnología y creatividad. Mis comienzos en el mundo IT cierran el ciclo del circuito comunicativo en un mundo cada vez más interrelacionado, segmentado y competitivo.
          </p>

          <p className="text-lg text-white/80">
            La tecnología cambió la forma en que vivimos y nos relacionamos con el mundo. Los cambios son tan vorágines y profundos que no alcanzamos a reflexionar sobre ello, que ya tenemos que adaptarnos a un nuevo estadio.
          </p>

          <p className="text-lg text-white/80">
            Todo proyecto personal o comercial a futuro deberá reciclarse para adaptarse a los cambios culturales que se van imponiendo: el universo tecnológico y el aporte de valor. ¿Vos comenzaste con el tuyo?
          </p>

          <p className="text-lg text-white/80 font-semibold italic">
            Mi mayor logro es invitarnos a cuestionar nuestra propia comodidad y transitar el difícil camino de pensarnos y recrearnos.
          </p>

          <div className="pt-8">
            <h3 className="text-xl font-semibold mb-3">Especialidades</h3>
            <div className="flex flex-row flex-wrap gap-2">
              {[
                "Desarrollo Web",
                "Estrategia Digital",
                "Comunicación Corporativa",
                "Gestión de Proyectos Integrados",
                "Marketing Digital",
              ].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
