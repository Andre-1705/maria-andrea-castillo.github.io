export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Obtener datos en el servidor usando fetch con URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const jobsRes = await fetch(`${baseUrl}/api/jobs`);
  const jobsByCategory: Record<string, any[]> = await jobsRes.json();
  const categoriesData = Object.keys(jobsByCategory);
  const clientsStatsRes = await fetch(`${baseUrl}/api/clients/stats`);
  const clientsStats = await clientsStatsRes.json();
  const customOrder = [
    "Desarrollo Web",
    "Comunicación Digital",
    "Marketing Digital",
    "Producción Audiovisual",
    // "Otros" // Oculto temporalmente
  ];
  const orderedCategories = customOrder.filter(cat => categoriesData.includes(cat));
  // Renderizar el dashboard aquí o retornar null si no hay contenido
  return null;
}
