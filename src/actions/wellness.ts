"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

export async function logWellnessMetric(data: { type: string; value: number; date?: Date }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const metric = await prisma.wellnessMetric.create({
    data: {
      userId: context.user.id,
      type: data.type,
      value: data.value,
      date: data.date || new Date()
    }
  })

  revalidatePath("/dashboard/wellness")
  revalidatePath("/dashboard")
  return metric
}

export async function getWellnessMetrics(type?: string) {
  const context = await getCurrentUser()
  if (!context) return []

  return await prisma.wellnessMetric.findMany({
    where: {
      userId: context.user.id,
      ...(type ? { type } : {})
    },
    orderBy: { date: "desc" },
    take: 50
  })
}

export async function deleteWellnessMetric(id: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  await prisma.wellnessMetric.delete({
    where: { id, userId: context.user.id }
  })

  revalidatePath("/dashboard/wellness")
}
