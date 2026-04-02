"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (plan.tier === "free") {
      router.push("/auth/signin");
      return;
    }

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.plan === plan.tier.toUpperCase()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("결제 페이지 이동에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan =
    session?.user?.plan === plan.tier.toUpperCase();

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition-shadow hover:shadow-lg",
        plan.highlighted
          ? "border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600"
          : "border-gray-200 bg-white"
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-block rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
            인기
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
          {plan.priceDetail && (
            <span className="text-sm text-gray-500">{plan.priceDetail}</span>
          )}
        </div>
      </div>

      <ul className="mb-8 flex flex-col gap-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={loading || isCurrentPlan}
        className={cn(
          "w-full rounded-lg py-3 text-sm font-semibold transition-colors",
          isCurrentPlan
            ? "bg-gray-100 text-gray-400 cursor-default"
            : plan.highlighted
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200",
          loading && "opacity-60 cursor-not-allowed"
        )}
      >
        {loading ? "이동 중..." : isCurrentPlan ? "현재 플랜" : plan.cta}
      </button>
    </div>
  );
}
