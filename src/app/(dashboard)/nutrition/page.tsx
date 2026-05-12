import { getDailyNutrition, getUserSettings } from "@/actions/nutrition"
import { NutritionDashboard } from "@/components/nutrition/Tracker"

export const metadata = {
  title: "Nutrition Tracker | Success Hub",
}

export default async function NutritionPage() {
  const today = new Date()
  const logs = await getDailyNutrition(today)
  const settings = await getUserSettings()

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Nutrition Tracker</h1>
        <p className="text-gray-500 mt-1">Log your meals and track your daily macro goals.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <NutritionDashboard logs={logs} settings={settings} />
      </div>
    </div>
  )
}
