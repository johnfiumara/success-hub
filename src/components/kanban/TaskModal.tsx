"use client"

import { useState, useEffect, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createTask, updateTask } from "@/actions/tasks"

export function TaskModal({ 
  isOpen, 
  onClose, 
  initialStatus = "TODO",
  task = null 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialStatus?: string,
  task?: any 
}) {
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("MEDIUM")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority)
    } else {
      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      if (task) {
        await updateTask(task.id, { title, description, priority })
      } else {
        await createTask({
          title,
          description,
          status: initialStatus,
          priority
        })
      }
      onClose()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="E.g. Morning Workout" 
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add more details..." 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val || "MEDIUM")}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-sage hover:bg-sage-dark text-white">
              {isPending ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
