import { prisma } from "@/lib/prisma";

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: Infinity,
  TEAM: Infinity,
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function checkUsageLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, dailyUsage: true, lastUsageDate: true },
  });

  if (!user) return { allowed: false, remaining: 0, limit: 0 };

  const limit = PLAN_LIMITS[user.plan];
  const today = new Date();
  const isToday = user.lastUsageDate ? isSameDay(user.lastUsageDate, today) : false;
  const currentUsage = isToday ? user.dailyUsage : 0;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentUsage);

  return {
    allowed: currentUsage < limit,
    remaining,
    limit,
    currentUsage,
  };
}

export async function incrementUsage(
  userId: string,
  data: {
    videoId: string;
    videoTitle?: string;
    language?: string;
    charCount?: number;
  }
) {
  const today = new Date();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastUsageDate: true },
  });

  const isNewDay = !user?.lastUsageDate || !isSameDay(user.lastUsageDate, today);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        dailyUsage: isNewDay ? 1 : { increment: 1 },
        lastUsageDate: today,
      },
    }),
    prisma.extraction.create({
      data: {
        userId,
        videoId: data.videoId,
        videoTitle: data.videoTitle,
        language: data.language,
        charCount: data.charCount,
      },
    }),
  ]);
}

export async function getRemainingUsage(userId: string) {
  const { remaining, limit, currentUsage } = await checkUsageLimit(userId);
  return { remaining, limit, used: currentUsage ?? 0 };
}

export function checkAnonUsage(cookieValue: string | undefined): {
  allowed: boolean;
  remaining: number;
  newCookieValue: string;
} {
  const today = new Date().toISOString().split("T")[0];
  let count = 0;

  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue);
      if (parsed.date === today) {
        count = parsed.count;
      }
    } catch {
      /* invalid cookie */
    }
  }

  return {
    allowed: count < 3,
    remaining: Math.max(0, 3 - count),
    newCookieValue: JSON.stringify({ date: today, count: count + 1 }),
  };
}
