import { JobsService } from "@/lib/jobs-service"
import { ClientsService } from "@/lib/clients-service"
import { AdminDashboardClient } from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Obtener datos en el servidor
  const categoriesData = await JobsService.getCategories()
  const clientsStats = await ClientsService.getClientStats()
  const customOrder = [
    "Desarrollo Web",
    "Comunicación Digital",
    "Marketing Digital",
    "Producción Audiovisual",
    // "Otros" // Oculto temporalmente
  ];
  const orderedCategories = customOrder.filter(cat => categoriesData.includes(cat))
  const jobsByCategory = {};
  for (const category of orderedCategories) {
    jobsByCategory[category] = await JobsService.getJobsByCategory(category)
  }
  const stats = {
    totalJobs: Object.values(jobsByCategory).reduce((acc, jobs) => acc + jobs.length, 0),
    totalClients: clientsStats.total,
    pendingClients: clientsStats.pending,
    visitorsCount: 0 // Se puede actualizar en el cliente
  }
  return <AdminDashboardClient jobs={jobsByCategory} categories={orderedCategories} stats={stats} />
}
