"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { logMeal } from "@/actions/nutrition"

export function LogMealModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [mealType, setMealType] = useState("BREAKFAST")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      await logMeal({
        name,
        mealType,
        calories: parseInt(calories) || 0,
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      })
      
      setName("")
      setCalories("")
      setProtein("")
      setCarbs("")
      setFat("")
      onClose()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Avocado Toast" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={(val) => setMealType(val || "BREAKFAST")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                <SelectItem value="LUNCH">Lunch</SelectItem>
                <SelectItem value="DINNER">Dinner</SelectItem>
                <SelectItem value="SNACK">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input id="calories" type="number" min="0" value={calories} onChange={e => setCalories(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" min="0" value={protein} onChange={e => setProtein(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" min="0" value={carbs} onChange={e => setCarbs(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" min="0" value={fat} onChange={e => setFat(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-sage hover:bg-sage-dark text-white">
              {isPending ? 'Logging...' : 'Log Meal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
