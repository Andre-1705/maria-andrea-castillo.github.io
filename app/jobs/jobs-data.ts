// Datos de ejemplo para los carruseles
export type Job = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  video?: string;
};

export type JobCategory =
  | "Desarrollo Web"
  | "Comunicación Digital"
  | "Consultoría IT"
  | "Marketing Digital"
  | "Producción Audiovisual"
  | "Eventos";

export const INITIAL_JOBS: Record<JobCategory, Job[]> = {
  "Desarrollo Web": [
    {
      id: "1",
      title: "Plataforma multimedia",
      description:
        "Creación de portal multimedia para desarrollo profesional integral.",
      image: "/port_pag_mac.png",
      link: "/jobs/1",
    },
    {
      id: "2",
      title: "Carrusel multimedia",
      description:
        "Diseño de carrusel multimedia para exposición de fotos, videos, publicaciones integradas, etc.",
      image: "/pantalla_carrusel_mac.png",
      link: "/jobs/2",
    },
    {
      id: "23",
      title: "Diseño de página web",
      description: "Diseño de página web para biblioteca on line y todo tipo de documentación.",
      image: "/port_pag_libros.png",
      link: "/jobs/23",
    },
    {
      id: "24",
      title: "Desarrollo java",
      description: "Desarrollo aplicación para negocio de concesionaria de autos.",
      image: "/java_consecionaria.png",
      link: "/jobs/24",
    },
  ],
  "Comunicación Digital": [
    {
      id: "1",
      title: "Proyecto Sustentable",
      description:
        "Diseño de lineamientos institucionales. Articulación con el proyecto de juguetes de Tuca Toco.",
      image: "/proyecto_Tuca_Toco.png",
      link: "/jobs/1",
    },
    {
      id: "3",
      title: "Campaña de Lanzamiento",
      description:
        "Estrategia integral para el lanzamiento de nuevos productos en mercados regionales en una primera etapa.",
      image: "/lanzam_t_t.png",
      link: "/jobs/3",
    },
    {
      id: "4",
      title: "Gestión de Crisis",
      description:
        "Manejo adecuado de comunicación durante crisis corporativa con impacto en redes sociales y medios tradicionales.",
      image: "/gestion_crisis.png",
      link: "/jobs/4",
    },
    {
      id: "14",
      title: "Línea línea de productos",
      description: "Línea integral de productos para una buena comunicación de marca.",
      image: "/linea_tuca_toco.jpg",
      link: "/jobs/14",
    },
  ],
  "Consultoría IT": [
    {
      id: "5",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/5",
    },
    {
      id: "6",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/6",
    },
    {
      id: "15",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/15",
    },
    {
      id: "16",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/16",
    },
  ],
  "Marketing Digital": [
    {
      id: "7",
      title: "Estrategia SEO/SEM",
      description:
        "Desarrollo e implementación de estrategia para mejorar posicionamiento en buscadores y aumentar tráfico.",
      image: "",
      video: "/creatividad.mp4",
      link: "/jobs/7",
    },
    {
      id: "8",
      title: "Brief publicitario",
      description: "Gestión de campaña multicanal en redes sociales para incrementar engagement y conversiones.",
      image: "/brief_public_tt.png",
      link: "/jobs/8",
    },
    {
      id: "17",
      title: "Buyer persona",
      description: "Representación del cliente ideal, construida a partir de datos reales sobre clientes actuales y potenciales. ",
      image: "/buyer_persona.png",
      link: "/jobs/17",
    },
    {
      id: "18",
      title: "Análisis de métricas",
      description: "Recopilar, interpretar y evaluar datos cuantitativos para entender el rendimiento de campañas.",
      image: "/analisis_metricas.jpg",
      link: "/jobs/18",
    },
  ],
  "Producción Audiovisual": [
    {
      id: "9",
      title: "Video Marca Personal",
      description: "Producción audiovisual para marca personal, identidad y conexión con su audiencia.",
      image: "",
      video: "/higher_calling.mp4",
      link: "/jobs/9",
    },
    {
      id: "10",
      title: "Campañas de posicionamiento",
      description: "Vuelos Épicos, el flagelo de la migración social. Redes sociales:  Elemento diferenciador. Aporte de valor social. Marca personal.",
      image: "",
      video: "/gaviota2.mp4",
      link: "/jobs/10",
    },
    {
      id: "19",
      title: "Campañas de posicionamiento",
      description: "Mechas, la peluquería de las amas de casa. Redes sociales:  Elemento diferenciador. Aporte de valor social. Marca personal.",
      image: "",
      video: "/mechas.mp4",
      link: "/jobs/19",
    },
    {
      id: "20",
      title: "Campañas de posicionamiento",
      description: "Wanted, el otro lado de la maternidad. Redes sociales:  Elemento diferenciador. Aporte de valor social. Marca personal.",
      image: "",
      video: "/wanted.mp4",
      link: "/jobs/20",
    },
  ],
  Eventos: [
    {
      id: "11",
      title: "Conferencia Tecnológica",
      description: "Organización de conferencia sobre tendencias tecnológicas con ponentes internacionales.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/11",
    },
    {
      id: "12",
      title: "Webinar Series",
      description: "Coordinación de serie de webinars sobre transformación digital para ejecutivos de nivel C.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/12",
    },
    {
      id: "21",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/21",
    },
    {
      id: "22",
      title: "Proyecto pendiente",
      description: "Descripción pendiente.",
      image: "/placeholder.svg?height=400&width=600",
      link: "/jobs/22",
    },
  ],
}; 