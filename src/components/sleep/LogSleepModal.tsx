"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { logSleep } from "@/actions/sleep"
import { format, parse } from "date-fns"

export function LogSleepModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [bedtime, setBedtime] = useState("22:00")
  const [wakeTime, setWakeTime] = useState("06:00")
  const [quality, setQuality] = useState("GOOD")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      // Need to parse date as local date to preserve the selected day correctly
      const [year, month, day] = date.split('-').map(Number)
      const dateObj = new Date(year, month - 1, day)
      
      const bedtimeDate = parse(`${date} ${bedtime}`, 'yyyy-MM-dd HH:mm', new Date())
      let wakeTimeDate = parse(`${date} ${wakeTime}`, 'yyyy-MM-dd HH:mm', new Date())
      
      // If wake time is earlier than bedtime, assume it's the next day
      if (wakeTimeDate <= bedtimeDate) {
        wakeTimeDate = new Date(wakeTimeDate.getTime() + 24 * 60 * 60 * 1000)
      }

      const durationMins = Math.round((wakeTimeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60))
      
      await logSleep({
        date: dateObj,
        bedtime: bedtimeDate,
        wakeTime: wakeTimeDate,
        durationMins,
        quality,
        notes: notes.trim() || undefined
      })
      
      setQuality("GOOD")
      setNotes("")
      onClose()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Sleep</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <p className="text-xs text-gray-500">The night of this date.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input id="bedtime" type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeTime">Wake Time</Label>
              <Input id="wakeTime" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Sleep Quality</Label>
            <Select value={quality} onValueChange={(val) => setQuality(val || "GOOD")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POOR">Poor</SelectItem>
                <SelectItem value="FAIR">Fair</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Any dreams, interruptions, etc." 
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-500 hover:bg-indigo-600 text-white">
              {isPending ? 'Logging...' : 'Log Sleep'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
