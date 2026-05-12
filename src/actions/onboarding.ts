"use server"

import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

export async function completeOnboarding(data: { workspaceName: string, calories: number, protein: number, carbs: number, fat: number }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")
  
  // Update workspace name
  await prisma.workspace.update({
    where: { id: context.workspaceId },
    data: { name: data.workspaceName || "Personal Workspace" }
  })
  
  // Create or update user settings
  await prisma.userSettings.upsert({
    where: { userId: context.user.id },
    update: {
      dailyCalories: data.calories || 2000,
      dailyProtein: data.protein || 150,
      dailyCarbs: data.carbs || 200,
      dailyFat: data.fat || 65
    },
    create: {
      userId: context.user.id,
      dailyCalories: data.calories || 2000,
      dailyProtein: data.protein || 150,
      dailyCarbs: data.carbs || 200,
      dailyFat: data.fat || 65
    }
  })
  
  // Mark user as onboarded
  await prisma.user.update({
    where: { id: context.user.id },
    data: { onboarded: true }
  })
  
  redirect("/")
}
