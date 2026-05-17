import { getWorkouts } from "@/actions/workout"
import DashboardWorkout from "@/components/dashboard/views/DashboardWorkout"

export const metadata = {
  title: "Workout Planner | Success Hub",
}

export default async function WorkoutPage() {
  const workouts = await getWorkouts()

  return <DashboardWorkout initialWorkouts={workouts} />
}
