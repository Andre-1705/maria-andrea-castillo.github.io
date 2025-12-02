import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import jobsData from "../jobs-data";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  video?: string;
  link: string;
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Buscar el trabajo en los datos locales
  const job = jobsData.find(j => j.id === id);

  if (!job) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Link href="/jobs">
            <Button>Volver a Proyectos</Button>
          </Link>
        </div>
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
          <p className="text-lg text-muted-foreground">{job.description}</p>
          <div className="mt-4">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {job.category}
            </span>
          </div>
        </div>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          {job.video ? (
            <video
              src={job.video}
              controls
              className="object-contain w-full h-full bg-black rounded-lg"
            />
          ) : job.image ? (
            <Image
              src={job.image}
              alt={job.title}
              fill
              className="object-cover"
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