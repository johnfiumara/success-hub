import { getSleepLogs } from "@/actions/sleep"
import { getUserSettings } from "@/actions/nutrition"
import DashboardSleep from "@/components/dashboard/views/DashboardSleep"

export const metadata = {
  title: "Sleep Tracker | Success Hub",
}

export default async function SleepPage() {
  const logs = await getSleepLogs(30) // Get last 30 days for history
  const settings = await getUserSettings()

  return <DashboardSleep initialLogs={logs} targetDuration={settings?.targetSleepDuration || 8} />
}
