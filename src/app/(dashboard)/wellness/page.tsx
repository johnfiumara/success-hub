import { getWellnessMetrics } from "@/actions/wellness"
import { WellnessHub } from "@/components/wellness/Tracker"

export const metadata = {
  title: "Wellness Hub | Success Hub",
}

export default async function WellnessPage() {
  const metrics = await getWellnessMetrics()

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Wellness Hub</h1>
        <p className="text-gray-500 mt-1">Monitor your vital stats and daily habits.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <WellnessHub initialMetrics={metrics} />
      </div>
    </div>
  )
}
