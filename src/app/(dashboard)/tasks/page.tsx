import { getOrCreateDemoContext, getTasks, getActivities } from "@/app/actions/tasks"
import { KanbanBoard } from "@/components/kanban/Board"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"

export const metadata = {
  title: "Tasks & Habits | Success Hub",
}

export default async function TasksPage() {
  const { workspace } = await getOrCreateDemoContext()
  const tasks = await getTasks(workspace.id)
  const activities = await getActivities(workspace.id)

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Tasks & Habits</h1>
        <p className="text-gray-500 mt-1">Manage your wellness goals, daily habits, and work tasks in one place.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="xl:col-span-3 overflow-hidden rounded-2xl">
          <KanbanBoard initialTasks={tasks} workspaceId={workspace.id} />
        </div>
        <div className="xl:col-span-1 overflow-y-auto">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
