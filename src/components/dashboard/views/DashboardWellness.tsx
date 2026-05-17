"use client";

import { useEffect, useState } from "react";
import { WellnessMetric } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft } from "lucide-react";
import { WellnessHub } from "@/components/wellness/Tracker";
import { getWellnessMetrics } from "@/actions/wellness";

export default function DashboardWellness() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<WellnessMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await getWellnessMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch wellness metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray transition-colors hover:text-sage-dark"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10">
            <Heart size={20} className="text-sage" />
          </div>
          <h1 className="heading-1 text-dark">Wellness Hub</h1>
        </div>
      </div>
      <p className="-mt-4 ml-14 body text-gray">
        Track daily wellness habits and metrics
      </p>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-sage"></div>
        </div>
      ) : (
        <WellnessHub initialMetrics={metrics} />
      )}
    </motion.div>
  );
}
