"use client";

import { useState } from "react";
import { Activity } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft, Plus } from "lucide-react";
import { WorkoutTracker } from "@/components/workout/Tracker";
import { getWorkouts } from "@/actions/workout";

interface DashboardWorkoutProps {
  initialWorkouts: any[];
}

export default function DashboardWorkout({ initialWorkouts }: DashboardWorkoutProps) {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>(initialWorkouts);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWorkouts = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-white border border-gray-100 text-gray hover:text-dark hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-coral/10 text-coral">
                <Flame size={16} />
              </div>
              <h1 className="text-2xl font-bold text-dark tracking-tight">Fitness & Training</h1>
            </div>
            <p className="text-gray-500 text-sm">Plan and track your daily physical activity and performance</p>
          </div>
        </div>

        <button 
          onClick={() => {}} // Modal to add workout
          className="flex items-center gap-2 px-4 py-2.5 bg-dark text-white rounded-xl font-semibold hover:bg-dark/90 transition-all shadow-lg shadow-dark/10"
        >
          <Plus size={18} />
          <span>New Workout</span>
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-6 md:p-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral/20 border-t-coral"></div>
          </div>
        ) : (
          <WorkoutTracker initialWorkouts={workouts} />
        )}
      </div>
    </motion.div>
  );
}
