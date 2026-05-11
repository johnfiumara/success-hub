"use client"

import { useState, useTransition } from "react"
import { updateTaskStatus, deleteTask } from "@/app/actions/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { TaskModal } from "./TaskModal"

const COLUMNS = [
  { id: "TODO", title: "To Do", color: "bg-sage-light text-sage-dark border-sage" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-coral-light text-coral border-coral" },
  { id: "REVIEW", title: "Review", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "DONE", title: "Done", color: "bg-gray-100 text-gray-700 border-gray-200" },
]

export function KanbanBoard({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState("TODO")
  const [editingTask, setEditingTask] = useState<any>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    
    // Optimistic update
    setTasks(current => 
      current.map(t => t.id === taskId ? { ...t, status } : t)
    )

    startTransition(async () => {
      await updateTaskStatus(taskId, status)
    })
  }

  const handleDelete = async (taskId: string) => {
    setTasks(current => current.filter(t => t.id !== taskId))
    startTransition(async () => {
      await deleteTask(taskId)
    })
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div 
          key={col.id} 
          className="flex-shrink-0 w-80 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 p-4 flex flex-col shadow-sm"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-dark flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${col.color.split(' ')[0]}`}></span>
              {col.title}
            </h3>
            <Badge variant="secondary" className="bg-white">{tasks.filter(t => t.status === col.id).length}</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div 
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:border-sage/50 transition-colors group"
                onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={
                    task.priority === 'HIGH' ? 'text-coral border-coral/30 bg-coral/5' : 
                    task.priority === 'MEDIUM' ? 'text-gold border-gold/30 bg-gold/5' : 
                    'text-sage border-sage/30 bg-sage/5'
                  }>
                    {task.priority}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <h4 className="font-medium text-dark text-sm mb-1">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  {task.dueDate ? (
                    <span className="flex items-center gap-1"><Calendar size={12}/> {format(new Date(task.dueDate), 'MMM d')}</span>
                  ) : <span></span>}
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="ghost" 
            className="w-full mt-3 text-sage hover:text-sage-dark hover:bg-sage/10 justify-start"
            onClick={() => { setActiveColumn(col.id); setEditingTask(null); setIsModalOpen(true); }}
          >
            <Plus size={16} className="mr-2" /> Add Task
          </Button>
        </div>
      ))}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        initialStatus={activeColumn}
        task={editingTask}
      />
    </div>
  )
}
