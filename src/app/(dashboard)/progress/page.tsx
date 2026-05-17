import DashboardProgress from "@/components/dashboard/views/DashboardProgress"
import { getProgressData } from "@/actions/progress"

export const metadata = {
  title: "Progress Analytics | Success Hub",
  description: "Track your progress across wellness, nutrition, sleep, and tasks.",
}

export default async function ProgressPage() {
  const data = await getProgressData()

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <DashboardProgress initialData={data} />
      </div>
    </div>
  )
}
