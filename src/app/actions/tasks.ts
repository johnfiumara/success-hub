"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"

// Normally we would instantiate Prisma correctly to prevent hot-reload issues in dev
// but for simplicity in this artifact we do it inline or in a separate file.
const prisma = new PrismaClient()

// Ensure a default user and workspace exists for the sake of the demo
export async function getOrCreateDemoContext() {
  let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@example.com',
      }
    })
  }

  let workspace = await prisma.workspace.findFirst({
    where: { members: { some: { userId: user.id } } }
  })
  
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'My Wellness Journey',
        description: 'Default workspace for health and wellness tracking.',
        members: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      }
    })
  }

  return { user, workspace }
}

export async function getTasks(workspaceId: string) {
  return await prisma.task.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function createTask(data: { title: string, description?: string, status: string, workspaceId: string, priority: string }) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      workspaceId: data.workspaceId,
    }
  })

  // Log activity
  await prisma.activity.create({
    data: {
      type: 'TASK_CREATED',
      description: `Created task "${task.title}"`,
      workspaceId: data.workspaceId,
      taskId: task.id,
      // For demo, we just get the first member
      userId: (await prisma.workspaceMember.findFirst({ where: { workspaceId: data.workspaceId } }))!.userId
    }
  })

  revalidatePath('/dashboard/tasks')
  return task
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  })

  await prisma.activity.create({
    data: {
      type: 'TASK_MOVED',
      description: `Moved task "${task.title}" to ${newStatus}`,
      workspaceId: task.workspaceId,
      taskId: task.id,
      userId: (await prisma.workspaceMember.findFirst({ where: { workspaceId: task.workspaceId } }))!.userId
    }
  })

  revalidatePath('/dashboard/tasks')
  return task
}

export async function updateTask(taskId: string, data: { title?: string, description?: string, priority?: string }) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data
  })
  revalidatePath('/dashboard/tasks')
  return task
}

export async function deleteTask(taskId: string) {
  const task = await prisma.task.delete({
    where: { id: taskId }
  })
  revalidatePath('/dashboard/tasks')
  return task
}

export async function getActivities(workspaceId: string) {
  return await prisma.activity.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, image: true } },
      task: { select: { title: true } }
    },
    take: 50
  })
}
