"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

export async function logWorkout(data: { type: string; description: string; taskId?: string }) {
  const context = await getCurrentUser()
  if (!context || !context.workspaceId) throw new Error("Unauthorized")

  const activity = await prisma.activity.create({
    data: {
      type: "WORKOUT",
      description: data.description,
      userId: context.user.id,
      workspaceId: context.workspaceId,
      taskId: data.taskId
    }
  })

  revalidatePath("/dashboard/workout")
  revalidatePath("/dashboard")
  return activity
}

export async function getWorkouts() {
  const context = await getCurrentUser()
  if (!context) return []

  return await prisma.activity.findMany({
    where: {
      userId: context.user.id,
      type: "WORKOUT"
    },
    orderBy: { createdAt: "desc" },
    take: 20
  })
}
