import { getWorkspaceAnalytics } from "@/actions/admin"
import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import { Users, Activity, CheckSquare, TrendingUp } from "lucide-react"

export const metadata = { title: "Analytics | Admin | Success Hub" }

export default async function AnalyticsPage() {
  const context = await getCurrentUser()
  if (!context) redirect("/login")

  // Check if user is owner
  const prisma = (await import("@/lib/prisma")).default
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId!, userId: context.user.id } }
  })
  
  if (!membership || membership.role !== "OWNER") {
    redirect("/")
  }

  const analytics = await getWorkspaceAnalytics(context.workspaceId!)

  const stats = [
    {
      title: "Total Members",
      value: analytics.totalMembers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Active Users (7d)",
      value: analytics.activeUsersThisWeek,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Total Tasks",
      value: analytics.totalTasks,
      icon: CheckSquare,
      color: "text-sage-dark",
      bg: "bg-sage/20"
    },
    {
      title: "Activities (7d)",
      value: analytics.totalActivities,
      icon: Activity,
      color: "text-violet-600",
      bg: "bg-violet-50"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Workspace activity and engagement metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-dark mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Recent Insights</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Total workspace members: <span className="font-semibold text-dark">{analytics.totalMembers}</span></p>
          <p>• Members active in the last 7 days: <span className="font-semibold text-dark">{analytics.activeUsersThisWeek}</span></p>
          <p>• Total tasks created: <span className="font-semibold text-dark">{analytics.totalTasks}</span></p>
          <p>• Activities recorded this week: <span className="font-semibold text-dark">{analytics.totalActivities}</span></p>
        </div>
      </div>
    </div>
  )
}
