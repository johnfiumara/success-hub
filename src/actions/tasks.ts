"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

export async function getTasks() {
  const context = await getCurrentUser()
  if (!context) return []

  return await prisma.task.findMany({
    where: { workspaceId: context.workspaceId },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function createTask(data: { title: string, description?: string, status: string, priority: string }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      workspaceId: context.workspaceId,
      userId: context.user.id
    }
  })

  // Log activity
  await prisma.activity.create({
    data: {
      type: 'TASK_CREATED',
      description: `Created task "${task.title}"`,
      workspaceId: context.workspaceId,
      taskId: task.id,
      userId: context.user.id
    }
  })

  revalidatePath('/tasks')
  return task
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const task = await prisma.task.update({
    where: { id: taskId, workspaceId: context.workspaceId },
    data: { status: newStatus }
  })

  await prisma.activity.create({
    data: {
      type: 'TASK_MOVED',
      description: `Moved task "${task.title}" to ${newStatus}`,
      workspaceId: task.workspaceId,
      taskId: task.id,
      userId: context.user.id
    }
  })

  revalidatePath('/tasks')
  return task
}

export async function updateTask(taskId: string, data: { title?: string, description?: string, priority?: string }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const task = await prisma.task.update({
    where: { id: taskId, workspaceId: context.workspaceId },
    data
  })
  revalidatePath('/tasks')
  return task
}

export async function deleteTask(taskId: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const task = await prisma.task.delete({
    where: { id: taskId, workspaceId: context.workspaceId }
  })
  revalidatePath('/tasks')
  return task
}

export async function getActivities() {
  const context = await getCurrentUser()
  if (!context) return []

  return await prisma.activity.findMany({
    where: { workspaceId: context.workspaceId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, image: true } },
      task: { select: { title: true } }
    },
    take: 50
  })
}
