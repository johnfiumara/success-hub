"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logSleep(data: {
  date: Date;
  bedtime: Date;
  wakeTime: Date;
  durationMins: number;
  quality: string;
  notes?: string;
}) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const log = await prisma.sleepLog.create({
    data: {
      userId: session.user.id,
      ...data,
    },
  });

  revalidatePath("/dashboard/sleep");
  revalidatePath("/dashboard");
  return log;
}

export async function getSleepLogs(limit: number = 30) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const logs = await prisma.sleepLog.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
  });

  return logs.map(log => ({
    ...log,
    durationHours: Math.round((log.durationMins / 60) * 10) / 10,
  }));
}

export async function deleteSleepLog(id: string) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.sleepLog.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/sleep");
  revalidatePath("/dashboard");
}

export async function getAvgSleepStats() {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const logs = await prisma.sleepLog.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: sevenDaysAgo,
      },
    },
  });

  if (logs.length === 0) return { avgDuration: 0, count: 0 };

  const totalMins = logs.reduce((acc, log) => acc + log.durationMins, 0);
  return {
    avgDuration: Math.round((totalMins / logs.length / 60) * 10) / 10,
    count: logs.length,
  };
}
