

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCarousel } from "@/components/job-carousel"

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  // Obtener trabajos agrupados por categoría usando fetch con URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/jobs`);
  const jobsByCategory = await res.json();
  const categoriesData = Object.keys(jobsByCategory);
  const customOrder = [
    "Desarrollo Web",
    "Comunicación Digital",
    "Marketing Digital",
    "Producción Audiovisual",
    // "Otros" // Oculto temporalmente
  ];
  const orderedCategories = customOrder.filter(cat => categoriesData.includes(cat));

  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center mt-8">Proyectos y Trabajos</h1>
      {orderedCategories.length > 0 ? (
        <Tabs defaultValue={orderedCategories[0]} className="w-full">
          <TabsList className="flex justify-between mb-8">
            {orderedCategories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex-1 mx-1 text-base font-medium min-w-0">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {orderedCategories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <JobCarousel 
                title={category} 
                jobs={jobsByCategory[category] || []} 
                isAdmin={false} 
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay proyectos disponibles.</p>
        </div>
      )}
    </div>
  )
}
