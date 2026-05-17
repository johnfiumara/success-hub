"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts"
import { Plus, Trash2, Moon, Calendar, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogSleepModal } from "./LogSleepModal"
import { deleteSleepLog } from "@/actions/sleep"
import { format } from "date-fns"

export function SleepTracker({ logs, targetDuration = 8 }: { logs: any[], targetDuration?: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = async (id: string) => {
    await deleteSleepLog(id)
  }

  // Calculate averages
  const avgDuration = logs.length > 0 
    ? (logs.reduce((sum, log) => sum + log.durationHours, 0) / logs.length).toFixed(1) 
    : "0"
  
  const qualityScores: Record<string, number> = { "POOR": 1, "FAIR": 2, "GOOD": 3, "EXCELLENT": 4 }
  const avgQualityScore = logs.length > 0
    ? (logs.reduce((sum, log) => sum + (qualityScores[log.quality] || 2), 0) / logs.length)
    : 0
    
  let avgQualityText = "N/A"
  if (avgQualityScore >= 3.5) avgQualityText = "EXCELLENT"
  else if (avgQualityScore >= 2.5) avgQualityText = "GOOD"
  else if (avgQualityScore >= 1.5) avgQualityText = "FAIR"
  else if (avgQualityScore > 0) avgQualityText = "POOR"

  // Prepare chart data (last 7 days reversed so oldest is first)
  const chartData = [...logs].reverse().map(log => ({
    name: format(new Date(log.date), 'EEE'),
    duration: log.durationHours,
    quality: log.quality,
    fullDate: format(new Date(log.date), 'MMM d, yyyy')
  }))

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "EXCELLENT": return "#8FB573" // Sage
      case "GOOD": return "#6366f1" // Indigo
      case "FAIR": return "#D4A853" // Gold
      case "POOR": return "#E07A6E" // Coral
      default: return "#cbd5e1"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark tracking-tight">Sleep Tracker</h1>
          <p className="text-gray-500 mt-1">Monitor your sleep patterns and quality.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">
          <Plus size={16} className="mr-2" /> Log Sleep
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Duration</p>
            <p className="text-2xl font-bold text-dark">{avgDuration}h <span className="text-sm font-normal text-gray-400">/ {targetDuration}h</span></p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center text-sage-dark">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Quality</p>
            <p className="text-2xl font-bold text-dark capitalize">{avgQualityText.toLowerCase()}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Logs (Last 7d)</p>
            <p className="text-2xl font-bold text-dark">{logs.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 col-span-1 lg:col-span-2">
          <h2 className="heading-4 text-dark mb-6">Recent Sleep Duration</h2>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                            <p className="font-semibold text-dark text-sm mb-1">{data.fullDate}</p>
                            <p className="text-indigo-600 font-medium">{data.duration} hours</p>
                            <p className="text-gray-500 text-xs mt-1 capitalize">Quality: {data.quality.toLowerCase()}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="duration" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getQualityColor(entry.quality)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                No sleep data available for chart.
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 flex flex-col">
          <h2 className="heading-4 text-dark mb-4 flex items-center gap-2">
            <Moon size={18} className="text-indigo-500" />
            Sleep History
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[300px]">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No sleep logs yet.</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-dark">{format(new Date(log.date), 'MMM d, yyyy')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {log.durationHours}h
                        </span>
                        <span className="text-xs text-gray-500 capitalize px-2 py-0.5 border border-gray-200 rounded-md">
                          {log.quality.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2"
                      onClick={() => handleDelete(log.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded-lg border border-gray-100">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <LogSleepModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
