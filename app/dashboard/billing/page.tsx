import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BillingActions from "./BillingActions";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      lemonSqueezySubId: true,
      lemonSqueezySubStatus: true,
      lemonSqueezyCurrentPeriodEnd: true,
      lemonSqueezyPortalUrl: true,
    },
  });

  const plan = user?.plan ?? "FREE";
  const subStatus = user?.lemonSqueezySubStatus;
  const nextBilling = user?.lemonSqueezyCurrentPeriodEnd;
  const portalUrl = user?.lemonSqueezyPortalUrl;
  const hasActiveSub = subStatus === "active" || subStatus === "on_trial";

  const priceMap: Record<string, string> = {
    FREE: "₩0",
    PRO: "₩9,900 / 월",
    TEAM: "₩29,900 / 월",
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">구독 관리</h1>
      <p className="mt-1 text-sm text-gray-500">결제 정보와 구독 상태를 확인하세요.</p>

      {/* Current Plan */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">현재 플랜</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{plan}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              hasActiveSub
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {hasActiveSub ? "활성" : plan === "FREE" ? "무료" : subStatus ?? "비활성"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">결제 금액</p>
            <p className="mt-1 font-medium text-gray-900">{priceMap[plan]}</p>
          </div>
          <div>
            <p className="text-gray-500">다음 결제일</p>
            <p className="mt-1 font-medium text-gray-900">
              {nextBilling
                ? new Date(nextBilling).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <BillingActions
        plan={plan}
        hasActiveSub={hasActiveSub}
        portalUrl={portalUrl ?? null}
        subId={user?.lemonSqueezySubId ?? null}
      />

      {/* Upgrade CTA for Free */}
      {plan === "FREE" && (
        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
          <p className="text-sm text-indigo-700 font-medium">
            Pro로 업그레이드하면 무제한 추출 + AI 요약을 사용할 수 있습니다.
          </p>
          <a
            href="/#pricing"
            className="mt-3 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            플랜 비교하기
          </a>
        </div>
      )}
    </div>
  );
}
