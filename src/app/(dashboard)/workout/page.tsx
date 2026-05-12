import { getWorkouts } from "@/actions/workout"
import { WorkoutTracker } from "@/components/workout/Tracker"

export const metadata = {
  title: "Workout Planner | Success Hub",
}

export default async function WorkoutPage() {
  const workouts = await getWorkouts()

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Workout Planner</h1>
        <p className="text-gray-500 mt-1">Track your fitness journey and stay consistent.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <WorkoutTracker initialWorkouts={workouts} />
      </div>
    </div>
  )
}
