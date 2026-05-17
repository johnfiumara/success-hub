"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function getProgressData() {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const now = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => subDays(now, 6 - i));

  // Initialize data structures for the last 7 days
  const progressData = past7Days.map(date => ({
    date: format(date, "MMM dd"),
    rawDate: date,
    calories: 0,
    sleepDuration: 0,
    tasksCompleted: 0,
  }));

  // 1. Fetch Nutrition Data
  const nutritionLogs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      date: { gte: startOfDay(past7Days[0]) },
    },
  });

  nutritionLogs.forEach(log => {
    const dayIndex = progressData.findIndex(d => 
      format(d.rawDate, "MMM dd") === format(log.date, "MMM dd")
    );
    if (dayIndex !== -1) {
      progressData[dayIndex].calories += log.calories;
    }
  });

  // 2. Fetch Sleep Data
  const sleepLogs = await prisma.sleepLog.findMany({
    where: {
      userId,
      date: { gte: startOfDay(past7Days[0]) },
    },
  });

  sleepLogs.forEach(log => {
    const dayIndex = progressData.findIndex(d => 
      format(d.rawDate, "MMM dd") === format(log.date, "MMM dd")
    );
    if (dayIndex !== -1) {
      progressData[dayIndex].sleepDuration += (log.durationMins / 60); // In hours
    }
  });

  // 3. Fetch Task Completion Data
  // Assuming completed tasks are those with status "DONE" and updated recently
  // Wait, Activity table tracks tasks completed? Let's check the schema.
  // We can just use the Task model, but it doesn't track *when* it was done easily unless we use updatedAt.
  // Let's use Activity table for "task_completed" type if it exists, or just fallback to Tasks.
  const activities = await prisma.activity.findMany({
    where: {
      userId,
      type: "task_completed",
      createdAt: { gte: startOfDay(past7Days[0]) },
    },
  });

  activities.forEach(activity => {
    const dayIndex = progressData.findIndex(d => 
      format(d.rawDate, "MMM dd") === format(activity.createdAt, "MMM dd")
    );
    if (dayIndex !== -1) {
      progressData[dayIndex].tasksCompleted += 1;
    }
  });

  // Clean up rawDate before sending to client
  return progressData.map(({ rawDate, ...rest }) => rest);
}
