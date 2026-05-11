"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { startOfDay, endOfDay } from "date-fns"

export async function getUserSettings() {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  let settings = await prisma.userSettings.findUnique({ where: { userId: context.user.id } })
  
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: context.user.id }
    })
  }
  return settings
}

export async function updateUserSettings(data: { dailyCalories: number, dailyProtein: number, dailyCarbs: number, dailyFat: number }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  const settings = await prisma.userSettings.update({
    where: { userId: context.user.id },
    data
  })
  revalidatePath('/nutrition')
  return settings
}

export async function logMeal(data: { name: string, mealType: string, calories: number, protein: number, carbs: number, fat: number, date?: Date }) {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")
  
  const meal = await prisma.nutritionLog.create({
    data: {
      userId: context.user.id,
      workspaceId: context.workspaceId,
      name: data.name,
      mealType: data.mealType,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      date: data.date || new Date()
    }
  })

  revalidatePath('/nutrition')
  return meal
}

export async function getDailyNutrition(date: Date) {
  const context = await getCurrentUser()
  if (!context) return []
  
  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId: context.user.id,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return logs
}

export async function deleteMeal(id: string) {
  await prisma.nutritionLog.delete({ where: { id } })
  revalidatePath('/nutrition')
}
