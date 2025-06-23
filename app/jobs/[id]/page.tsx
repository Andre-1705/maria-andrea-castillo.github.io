import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { INITIAL_JOBS } from "../jobs-data";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // Buscar el trabajo por id en INITIAL_JOBS
  let job = null;
  for (const [, jobs] of Object.entries(INITIAL_JOBS)) {
    job = jobs.find((j) => String(j.id) === String(params.id));
    if (job) break;
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
          ) : null}
        </div>
      </div>
    </div>
  );
} 