import { AdminDashboardClient } from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Obtener datos en el servidor usando fetch
  const jobsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/jobs`)
  const jobsByCategory = await jobsRes.json()
  const categoriesData = Object.keys(jobsByCategory)
  const clientsStatsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/clients/stats`)
  const clientsStats = await clientsStatsRes.json()
  const customOrder = [
    "Desarrollo Web",
    "Comunicación Digital",
    "Marketing Digital",
    "Producción Audiovisual",
    // "Otros" // Oculto temporalmente
  ];
  const orderedCategories = customOrder.filter(cat => categoriesData.includes(cat))
  const stats = {
    totalJobs: Object.values(jobsByCategory).reduce((acc, jobs) => acc + jobs.length, 0),
    totalClients: clientsStats.total,
    pendingClients: clientsStats.pending,
    visitorsCount: 0 // Se puede actualizar en el cliente
  }
  return <AdminDashboardClient jobs={jobsByCategory} categories={orderedCategories} stats={stats} />
}
