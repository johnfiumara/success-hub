import { getSleepLogs } from "@/actions/sleep"
import { SleepTracker } from "@/components/sleep/Tracker"

export const metadata = {
  title: "Sleep Tracker | Success Hub",
}

export default async function SleepPage() {
  const logs = await getSleepLogs(30) // Get last 30 days for history

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <SleepTracker logs={logs} />
      </div>
    </div>
  )
}
