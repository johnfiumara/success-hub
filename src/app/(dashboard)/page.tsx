import { getCurrentUser } from "@/actions/auth"
import { getTasks, getActivities } from "@/actions/tasks"
import { getSleepLogs } from "@/actions/sleep"
import { getDailyNutrition, getUserSettings } from "@/actions/nutrition"
import { getWorkouts } from "@/actions/workout"
import { getWellnessMetrics } from "@/actions/wellness"
import { redirect } from "next/navigation"
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard"

export const metadata = {
  title: "Overview | Success Hub",
}

export default async function OverviewPage() {
  const context = await getCurrentUser()
  if (!context) redirect("/login")

  const [tasks, sleepLogs, nutritionLogs, workouts, wellnessMetrics, activities, settings] = await Promise.all([
    getTasks(),
    getSleepLogs(7),
    getDailyNutrition(new Date()),
    getWorkouts(),
    getWellnessMetrics(),
    getActivities(),
    getUserSettings()
  ])

  const stats = {
    tasksCount: tasks.length,
    completedTasks: tasks.filter(t => t.status === "DONE").length,
    avgSleep: sleepLogs.length > 0 
      ? (sleepLogs.reduce((acc, log) => acc + (log.durationMins / 60), 0) / sleepLogs.length).toFixed(1) 
      : "0",
    calories: nutritionLogs.reduce((acc, log) => acc + (log.calories || 0), 0),
    calorieGoal: settings?.dailyCalories || 2500,
    workoutsThisWeek: workouts.filter(w => {
      const date = new Date(w.createdAt)
      const now = new Date()
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }).length,
    latestMood: wellnessMetrics.find(m => m.type === "MOOD")?.value || "N/A"
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark tracking-tight">Welcome back, {context.user.name}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your success goals today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage-dark rounded-xl font-medium text-sm border border-sage/20">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          Active Workspace: {context.workspaceId ? context.workspaceId.substring(0, 8) + "..." : "Personal"}
        </div>
      </div>

      <OverviewDashboard stats={stats as any} activities={activities} />
    </div>
  )
}
