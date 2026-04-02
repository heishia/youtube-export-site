import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 999,
  TEAM: 999,
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      dailyUsage: true,
      lastUsageDate: true,
    },
  });

  const today = new Date();
  const isToday = user?.lastUsageDate ? isSameDay(user.lastUsageDate, today) : false;
  const todayUsage = isToday ? (user?.dailyUsage ?? 0) : 0;
  const limit = PLAN_LIMITS[user?.plan ?? "FREE"];
  const plan = user?.plan ?? "FREE";

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyCount = await prisma.extraction.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth },
    },
  });

  const recentExtractions = await prisma.extraction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
      <p className="mt-1 text-sm text-gray-500">사용 현황과 추출 기록을 확인하세요.</p>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Usage */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">오늘 사용량</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {todayUsage}
            <span className="text-base font-normal text-gray-400">
              {" "}/ {plan === "FREE" ? `${limit}회` : "무제한"}
            </span>
          </p>
          {plan === "FREE" && (
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${Math.min(100, (todayUsage / limit) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {Math.max(0, limit - todayUsage)}회 남음
              </p>
            </div>
          )}
        </div>

        {/* Monthly Total */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">이번 달 총 추출</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {monthlyCount}
            <span className="text-base font-normal text-gray-400"> 건</span>
          </p>
        </div>

        {/* Current Plan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">현재 플랜</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{plan}</p>
          {plan === "FREE" && (
            <a
              href="/#pricing"
              className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              업그레이드
            </a>
          )}
        </div>
      </div>

      {/* Recent Extractions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">최근 추출 기록</h2>
        {recentExtractions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-400">아직 추출한 대본이 없습니다.</p>
            <p className="mt-1 text-sm text-gray-400">
              메인 페이지에서 유튜브 URL을 입력해 보세요.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">영상 제목</th>
                  <th className="px-4 py-3 hidden sm:table-cell">추출일시</th>
                  <th className="px-4 py-3 hidden md:table-cell">글자수</th>
                  <th className="px-4 py-3 hidden md:table-cell">AI 요약</th>
                  <th className="px-4 py-3">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentExtractions.map((ext) => (
                  <tr key={ext.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[200px] truncate text-gray-900">
                      {ext.videoTitle ?? ext.videoId}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {new Date(ext.createdAt).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {ext.charCount?.toLocaleString() ?? "-"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {ext.hasSummary ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://youtube.com/watch?v=${ext.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        원본 보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
