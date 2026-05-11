"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import { getOrCreateDemoContext } from "./tasks"
import { startOfDay, endOfDay } from "date-fns"

const prisma = new PrismaClient()

export async function getUserSettings() {
  const { user } = await getOrCreateDemoContext()
  let settings = await prisma.userSettings.findUnique({ where: { userId: user.id } })
  
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: user.id }
    })
  }
  return settings
}

export async function updateUserSettings(data: { dailyCalories: number, dailyProtein: number, dailyCarbs: number, dailyFat: number }) {
  const { user } = await getOrCreateDemoContext()
  const settings = await prisma.userSettings.update({
    where: { userId: user.id },
    data
  })
  revalidatePath('/nutrition')
  return settings
}

export async function logMeal(data: { name: string, mealType: string, calories: number, protein: number, carbs: number, fat: number, date?: Date }) {
  const { user, workspace } = await getOrCreateDemoContext()
  
  const meal = await prisma.nutritionLog.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
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
  const { user } = await getOrCreateDemoContext()
  
  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId: user.id,
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
