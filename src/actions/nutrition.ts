"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logMeal(data: {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: string;
  workspaceId?: string;
}) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = data.workspaceId || session.workspaceId;
  if (!workspaceId) throw new Error("No workspace selected");

  const log = await prisma.nutritionLog.create({
    data: {
      userId: session.user.id,
      foodName: data.name,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      mealType: data.mealType,
      workspaceId,
    },
  });

  revalidatePath("/dashboard/nutrition");
  revalidatePath("/dashboard");
  return log;
}

export async function getNutritionLogs(workspaceId: string) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId: session.user.id,
      workspaceId,
    },
    orderBy: {
      date: "desc",
    },
    take: 50,
  });

  return logs.map(log => ({
    ...log,
    name: log.foodName,
  }));
}

export async function getDailyNutrition(date: Date = new Date()) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return logs.map(log => ({
    ...log,
    name: log.foodName,
  }));
}

export async function getUserSettings() {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  let settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: session.user.id },
    });
  }

  return settings;
}

export async function deleteMeal(id: string) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.nutritionLog.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/nutrition");
  revalidatePath("/dashboard");
}

export async function updateUserSettings(data: {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  targetBedtime?: string;
  targetWakeTime?: string;
  targetSleepDuration?: number;
}) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function getDailyNutritionStats() {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: today,
      },
    },
  });

  return {
    calories: logs.reduce((acc, log) => acc + log.calories, 0),
    protein: logs.reduce((acc, log) => acc + (log.protein || 0), 0),
    carbs: logs.reduce((acc, log) => acc + (log.carbs || 0), 0),
    fat: logs.reduce((acc, log) => acc + (log.fat || 0), 0),
    count: logs.length,
  };
}
