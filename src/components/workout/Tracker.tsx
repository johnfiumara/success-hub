"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Plus, History, Flame, Clock, Loader2, Sparkles, Zap, Wind, Smile } from "lucide-react"
import { format } from "date-fns"
import { logWorkout } from "@/actions/workout"
import { useRouter } from "next/navigation"

export interface Workout {
  id: string
  type: string
  description: string
  createdAt: Date
}

const WORKOUT_TEMPLATES = [
  { id: "yoga", title: "Yoga Flow", icon: Smile, color: "text-lavender", bgColor: "bg-lavender/10", desc: "Balance and flexibility" },
  { id: "mobility", title: "Mobility Work", icon: Sparkles, color: "text-gold", bgColor: "bg-gold/10", desc: "Range of motion" },
  { id: "breathwork", title: "Breathwork", icon: Wind, color: "text-sage", bgColor: "bg-sage/10", desc: "Energy and focus" },
  { id: "strength", title: "Strength", icon: Zap, color: "text-coral", bgColor: "bg-coral/10", desc: "Power and endurance" },
]

export function WorkoutTracker({ initialWorkouts }: { initialWorkouts: Workout[] }) {
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const [description, setDescription] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const router = useRouter()

  const handleLogWorkout = async (desc: string) => {
    if (!desc.trim()) return

    setIsLogging(true)
    try {
      const newWorkout = await logWorkout({
        type: "WORKOUT",
        description: desc.trim()
      })
      setWorkouts([newWorkout, ...workouts])
      setDescription("")
      router.refresh()
    } catch (error) {
      console.error("Failed to log workout:", error)
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Log Workout Form & Templates */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-coral/10">
              <Plus size={20} className="text-coral" />
            </div>
            <h2 className="heading-4 text-dark">Log Session</h2>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleLogWorkout(description);
            }} 
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray mb-1.5">What did you do?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 5km Run, Upper Body Session, Yoga..."
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none h-24"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLogging || !description.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-coral text-white rounded-xl font-medium hover:bg-coral-dark disabled:opacity-50 transition-all shadow-lg shadow-coral/20"
            >
              {isLogging ? <Loader2 size={18} className="animate-spin" /> : <Dumbbell size={18} />}
              {isLogging ? "Logging..." : "Log Workout"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <h3 className="heading-4 text-dark mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-gold" />
            Quick Templates
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {WORKOUT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleLogWorkout(template.title)}
                disabled={isLogging}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-sage/30 hover:bg-sage/5 transition-all group text-left"
              >
                <div className={`w-10 h-10 rounded-lg ${template.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <template.icon size={20} className={template.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-dark">{template.title}</p>
                  <p className="text-xs text-gray truncate">{template.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-coral to-coral-dark text-white shadow-lg shadow-coral/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Weekly Streak</h3>
            <Flame size={20} />
          </div>
          <div className="text-3xl font-bold mb-1">3 Days</div>
          <p className="text-white/80 text-sm">Keep up the momentum!</p>
        </div>
      </div>

      {/* Workout History */}
      <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
              <History size={20} className="text-sage" />
            </div>
            <h2 className="heading-4 text-dark">Recent Activity</h2>
          </div>
        </div>

        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell size={24} className="text-gray-300" />
              </div>
              <p className="text-gray italic">No workouts logged yet. Time to get moving!</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-50 hover:border-sage/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sage/10 shrink-0">
                  <Dumbbell size={18} className="text-sage" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark font-medium leading-tight">{workout.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray">
                      <Clock size={12} />
                      {format(new Date(workout.createdAt), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
