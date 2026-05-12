"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Plus, Trash2, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogMealModal } from "./LogMealModal"
import { deleteMeal } from "@/actions/nutrition"

export function NutritionDashboard({ logs, settings }: { logs: any[], settings: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0)
  const totalProtein = logs.reduce((sum, log) => sum + (log.protein || 0), 0)
  const totalCarbs = logs.reduce((sum, log) => sum + (log.carbs || 0), 0)
  const totalFat = logs.reduce((sum, log) => sum + (log.fat || 0), 0)

  const macroData = [
    { name: "Protein", value: totalProtein, color: "#8FB573" }, // Sage
    { name: "Carbs", value: totalCarbs, color: "#E07A6E" }, // Coral
    { name: "Fat", value: totalFat, color: "#D4A853" }, // Gold
  ]

  const handleDelete = async (id: string) => {
    await deleteMeal(id)
  }

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 col-span-1 lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-4 text-dark">Daily Macros</h2>
            <Button onClick={() => setIsModalOpen(true)} className="bg-sage hover:bg-sage-dark text-white rounded-full">
              <Plus size={16} className="mr-2" /> Log Meal
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-48 w-48 relative">
              {totalProtein + totalCarbs + totalFat > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full border-4 border-gray-100">
                  <span className="text-gray-400 text-sm">No data</span>
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-dark">{totalCalories}</span>
                <span className="text-xs text-gray-500">/ {settings.dailyCalories} kcal</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              {macroData.map(macro => {
                const goal = settings[`daily${macro.name}`] || 1
                const percent = Math.min(100, Math.round((macro.value / goal) * 100))
                return (
                  <div key={macro.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-dark">{macro.name}</span>
                      <span className="text-gray-500">{macro.value}g / {goal}g</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%`, backgroundColor: macro.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Meal Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealTypes.map(type => {
          const typeLogs = logs.filter(l => l.mealType === type)
          return (
            <div key={type} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6">
              <h3 className="font-semibold text-dark mb-4 capitalize flex items-center gap-2">
                <Apple size={18} className="text-sage" />
                {type.toLowerCase()}
              </h3>
              {typeLogs.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No meals logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {typeLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center group p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-dark text-sm">{log.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {log.calories} kcal • {log.protein}g P • {log.carbs}g C • {log.fat}g F
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <LogMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
