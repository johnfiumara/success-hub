"use client";

import { useState } from "react";
import { SleepLog } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Moon, ArrowLeft, Plus } from "lucide-react";
import { SleepTracker } from "@/components/sleep/Tracker";
import { getSleepLogs } from "@/actions/sleep";

interface DashboardSleepProps {
  initialLogs: SleepLog[];
  targetDuration?: number;
}

export default function DashboardSleep({ initialLogs, targetDuration = 8 }: DashboardSleepProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<SleepLog[]>(initialLogs);
  const [isLoading, setIsLoading] = useState(false);

  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getSleepLogs(30);
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch sleep logs:", error);
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
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
                <Moon size={16} />
              </div>
              <h1 className="text-2xl font-bold text-dark tracking-tight">Sleep & Recovery</h1>
            </div>
            <p className="text-gray-500 text-sm">Monitor your sleep quality and optimization metrics</p>
          </div>
        </div>

        <button 
          onClick={() => {}} // This should open a modal to add a new log
          className="flex items-center gap-2 px-4 py-2.5 bg-dark text-white rounded-xl font-semibold hover:bg-dark/90 transition-all shadow-lg shadow-dark/10"
        >
          <Plus size={18} />
          <span>Log Sleep</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-6 md:p-8">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
            </div>
          ) : (
            <SleepTracker logs={logs} targetDuration={targetDuration} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
