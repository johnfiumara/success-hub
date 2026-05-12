"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "@/actions/onboarding"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

export function OnboardingFlow({ userName }: { userName: string }) {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  
  const [workspaceName, setWorkspaceName] = useState(`${userName}'s Workspace`)
  const [calories, setCalories] = useState("2000")
  const [protein, setProtein] = useState("150")
  const [carbs, setCarbs] = useState("200")
  const [fat, setFat] = useState("65")

  const handleNext = () => setStep(2)
  const handleBack = () => setStep(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await completeOnboarding({
        workspaceName,
        calories: parseInt(calories) || 2000,
        protein: parseInt(protein) || 150,
        carbs: parseInt(carbs) || 200,
        fat: parseInt(fat) || 65
      })
    })
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-sage' : 'bg-gray-200'}`} />
          <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-sage' : 'bg-gray-200'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-sage' : 'bg-gray-200'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-dark mb-2">Welcome to Success Hub</h1>
              <p className="text-gray-500">Let's set up your personal workspace.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspaceName" className="text-sm font-medium text-gray-700">Workspace Name</Label>
                <Input 
                  id="workspaceName" 
                  value={workspaceName} 
                  onChange={e => setWorkspaceName(e.target.value)} 
                  className="h-12 text-lg"
                  required 
                />
                <p className="text-xs text-gray-500">You can always invite others or change this later.</p>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="button" onClick={handleNext} className="bg-sage hover:bg-sage-dark text-white px-8 h-12 rounded-xl text-lg">
                Next <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-dark mb-2">Set Your Baseline Goals</h1>
              <p className="text-gray-500">Configure your daily nutrition targets.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calories (kcal)</Label>
                <Input id="calories" type="number" min="0" value={calories} onChange={e => setCalories(e.target.value)} className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input id="protein" type="number" min="0" value={protein} onChange={e => setProtein(e.target.value)} className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input id="carbs" type="number" min="0" value={carbs} onChange={e => setCarbs(e.target.value)} className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input id="fat" type="number" min="0" value={fat} onChange={e => setFat(e.target.value)} className="h-11" required />
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={handleBack} className="text-gray-500 hover:text-dark px-0">
                <ArrowLeft className="mr-2" size={20} /> Back
              </Button>
              <Button type="submit" disabled={isPending} className="bg-sage hover:bg-sage-dark text-white px-8 h-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                {isPending ? 'Saving...' : (
                  <>Complete Setup <CheckCircle2 className="ml-2" size={20} /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
