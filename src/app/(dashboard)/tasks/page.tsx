import { getTasks, getActivities } from "@/app/actions/tasks"
import { getCurrentUser } from "@/app/actions/auth"
import { KanbanBoard } from "@/components/kanban/Board"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Tasks & Habits | Success Hub",
}

export default async function TasksPage() {
  const context = await getCurrentUser()
  if (!context) redirect("/login")
  
  const tasks = await getTasks()
  const activities = await getActivities()

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Tasks & Habits</h1>
        <p className="text-gray-500 mt-1">Manage your wellness goals, daily habits, and work tasks in one place.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="xl:col-span-3 overflow-hidden rounded-2xl">
          <KanbanBoard initialTasks={tasks} />
        </div>
        <div className="xl:col-span-1 overflow-y-auto">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
