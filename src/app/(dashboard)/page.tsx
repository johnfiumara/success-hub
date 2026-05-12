import { getCurrentUser } from "@/actions/auth"
import { getTasks, getActivities } from "@/actions/tasks"
import { getSleepLogs } from "@/actions/sleep"
import { getDailyNutrition } from "@/actions/nutrition"
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

  const [tasks, sleepLogs, nutritionLogs, workouts, wellnessMetrics, activities] = await Promise.all([
    getTasks(),
    getSleepLogs(7),
    getDailyNutrition(new Date()),
    getWorkouts(),
    getWellnessMetrics(),
    getActivities()
  ])

  const stats = {
    tasksCount: tasks.length,
    completedTasks: tasks.filter(t => t.status === "DONE").length,
    avgSleep: sleepLogs.length > 0 
      ? (sleepLogs.reduce((acc, log) => acc + (log.durationMins / 60), 0) / sleepLogs.length).toFixed(1) 
      : "0",
    calories: nutritionLogs.reduce((acc, log) => acc + (log.calories || 0), 0),
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
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Welcome back, {context.user.name}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your success goals today.</p>
      </div>

      <OverviewDashboard stats={stats} activities={activities} />
    </div>
  )
}
