"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Plus, History, Scale, Droplets, Smile, Trash2, Loader2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { logWellnessMetric, getWellnessMetrics, deleteWellnessMetric } from "@/actions/wellness"
import { useRouter } from "next/navigation"

interface Metric {
  id: string
  type: string
  value: number
  date: Date
}

export function WellnessHub({ initialMetrics }: { initialMetrics: any[] }) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [type, setType] = useState("WEIGHT")
  const [value, setValue] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const router = useRouter()

  const metricTypes = [
    { id: "WEIGHT", label: "Weight", icon: Scale, unit: "kg", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "WATER", label: "Water", icon: Droplets, unit: "ml", color: "text-cyan-500", bg: "bg-cyan-50" },
    { id: "MOOD", label: "Mood", icon: Smile, unit: "/10", color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: "ENERGY", label: "Energy", icon: Heart, unit: "/10", color: "text-red-500", bg: "bg-red-50" },
  ]

  const handleLogMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value || isNaN(Number(value))) return

    setIsLogging(true)
    try {
      const newMetric = await logWellnessMetric({
        type,
        value: Number(value)
      })
      setMetrics([newMetric, ...metrics])
      setValue("")
      router.refresh()
    } catch (error) {
      console.error("Failed to log metric:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return
    try {
      await deleteWellnessMetric(id)
      setMetrics(metrics.filter(m => m.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Failed to delete metric:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Log Metric Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
              <Plus size={20} className="text-sage" />
            </div>
            <h2 className="heading-4 text-dark">Log Metric</h2>
          </div>

          <form onSubmit={handleLogMetric} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {metricTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    type === t.id 
                      ? "border-sage bg-sage/5 text-sage" 
                      : "border-gray-100 text-gray hover:bg-gray-50"
                  }`}
                >
                  <t.icon size={20} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray mb-1.5">
                Value ({metricTypes.find(t => t.id === type)?.unit})
              </label>
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${type.toLowerCase()}...`}
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLogging || !value}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage-dark disabled:opacity-50 transition-all shadow-lg shadow-sage/20"
            >
              {isLogging ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
              {isLogging ? "Logging..." : "Log Metric"}
            </button>
          </form>
        </div>
      </div>

      {/* Metric History */}
      <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky/10">
            <History size={20} className="text-sky" />
          </div>
          <h2 className="heading-4 text-dark">Wellness History</h2>
        </div>

        <div className="space-y-3">
          {metrics.length === 0 ? (
            <div className="text-center py-12 text-gray italic">
              No metrics tracked yet.
            </div>
          ) : (
            metrics.map((metric) => {
              const t = metricTypes.find(mt => mt.id === metric.type) || metricTypes[0]
              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-sky/20 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.bg} ${t.color}`}>
                    <t.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-dark">{metric.value}{t.unit}</span>
                      <span className="text-xs text-gray uppercase tracking-wider">{t.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray mt-0.5">
                      <Calendar size={12} />
                      {format(new Date(metric.date), "MMM d, yyyy")}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(metric.id)}
                    className="p-2 text-gray/0 group-hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
