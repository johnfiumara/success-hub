"use server"

import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

export async function submitAudit(scores: Record<string, number>, insights?: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const audit = await prisma.balanceAudit.upsert({
    where: { userId: context.user.id },
    update: {
      scores,
      insights,
    },
    create: {
      userId: context.user.id,
      scores,
      insights,
    },
  })

  revalidatePath("/dashboard/audit")
  return audit
}

export async function getAudit() {
  const context = await getCurrentUser()
  if (!context) return null

  return await prisma.balanceAudit.findUnique({
    where: { userId: context.user.id }
  })
}
