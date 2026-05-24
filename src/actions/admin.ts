"use server"

import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

export async function getWorkspaceUsers(workspaceId: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: context.user.id } }
  })

  if (!membership || membership.role !== "OWNER") {
    throw new Error("Forbidden: owner access required")
  }

  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}

export async function removeUserFromWorkspace(userId: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId!, userId: context.user.id } }
  })

  if (!membership || membership.role !== "OWNER") {
    throw new Error("Forbidden: owner access required")
  }

  // Don't allow removing the last owner
  const ownerCount = await prisma.workspaceMember.count({
    where: { workspaceId: context.workspaceId, role: "OWNER" }
  })

  const targetUser = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId!, userId } }
  })

  if (targetUser?.role === "OWNER" && ownerCount === 1) {
    throw new Error("Cannot remove the last owner from the workspace")
  }

  await prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId: context.workspaceId!, userId } }
  })

  revalidatePath(`/admin/users`)
}

export async function getWorkspaceAnalytics(workspaceId: string) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: context.user.id } }
  })

  if (!membership || membership.role !== "OWNER") {
    throw new Error("Forbidden: owner access required")
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [totalMembers, totalActivities, totalTasks, activeUsers] = await Promise.all([
    prisma.workspaceMember.count({ where: { workspaceId } }),
    prisma.activity.count({
      where: { workspaceId, createdAt: { gte: sevenDaysAgo } }
    }),
    prisma.task.count({ where: { workspaceId } }),
    prisma.activity.findMany({
      where: { workspaceId, createdAt: { gte: sevenDaysAgo } },
      select: { userId: true },
      distinct: ['userId']
    })
  ])

  return {
    totalMembers,
    totalActivities,
    totalTasks,
    activeUsersThisWeek: activeUsers.length,
  }
}
