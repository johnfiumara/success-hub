"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [workouts, sleep, nutrition, meetings] = await Promise.all([
    // Workouts this week
    prisma.activity.count({
      where: {
        userId: session.user.id,
        type: "workout",
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    // Average sleep
    prisma.sleepLog.aggregate({
      where: {
        userId: session.user.id,
        date: { gte: sevenDaysAgo },
      },
      _avg: {
        durationMins: true,
      },
    }),
    // Nutrition logs this week
    prisma.nutritionLog.count({
      where: {
        userId: session.user.id,
        date: { gte: sevenDaysAgo },
      },
    }),
    // Co-work sessions (meetings) this week
    prisma.meeting.count({
      where: {
        hostId: session.user.id,
        createdAt: { gte: sevenDaysAgo },
      },
    }),
  ]);

  const avgSleepMins = sleep._avg.durationMins || 0;
  const avgSleepStr = avgSleepMins > 0 
    ? `${Math.round((avgSleepMins / 60) * 10) / 10}h` 
    : "No data";

  return {
    workouts: workouts.toString(),
    avgSleep: avgSleepStr,
    meals: nutrition.toString(),
    sessions: meetings.toString(),
  };
}
