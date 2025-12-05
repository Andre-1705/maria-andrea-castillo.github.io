import { AdminDashboardClient } from './dashboard-client'

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Obtener datos en el servidor usando fetch con URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
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
    ];
    const orderedCategories = customOrder.filter(cat => categoriesData.includes(cat));
    
    return (
      <AdminDashboardClient 
        jobs={jobsByCategory} 
        categories={orderedCategories}
        stats={clientsStats}
      />
    );
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold text-red-500">Error cargando dashboard</h1>
        <p className="text-muted-foreground">Por favor, intenta recargar la página</p>
      </div>
    );
  }
}
