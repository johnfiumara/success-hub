"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { startOfDay, subDays } from "date-fns"

export async function logSleep(data: { date: Date; bedtime: Date; wakeTime: Date; durationMins: number; quality: string; notes?: string }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const sleepLog = await prisma.sleepLog.create({
    data: {
      userId: context.user.id,
      date: data.date,
      bedtime: data.bedtime,
      wakeTime: data.wakeTime,
      durationMins: data.durationMins,
      quality: data.quality,
      notes: data.notes,
    }
  })

  revalidatePath("/sleep")
  return sleepLog
}

export async function getSleepLogs(days: number = 7) {
  const context = await getCurrentUser()
  if (!context) return []

  const startDate = startOfDay(subDays(new Date(), days - 1))

  return prisma.sleepLog.findMany({
    where: {
      userId: context.user.id,
      date: { gte: startDate }
    },
    orderBy: { date: "desc" }
  })
}

export async function deleteSleepLog(id: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const log = await prisma.sleepLog.findUnique({ where: { id } })
  if (!log || log.userId !== context.user.id) throw new Error("Not authorized or log not found")

  await prisma.sleepLog.delete({ where: { id } })
  revalidatePath("/sleep")
}
