"use client";

import { useState } from "react";

interface BillingActionsProps {
  plan: string;
  hasActiveSub: boolean;
  portalUrl: string | null;
  subId: string | null;
}

export default function BillingActions({
  plan,
  hasActiveSub,
  portalUrl,
  subId,
}: BillingActionsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!subId) return;
    setCancelling(true);

    try {
      const res = await fetch("/api/lemonsqueezy/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subId }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("구독 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  if (plan === "FREE" || !hasActiveSub) return null;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        {portalUrl && (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            구독 관리 (결제 수단 변경)
          </a>
        )}
        <button
          onClick={() => setShowCancelModal(true)}
          className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          구독 취소
        </button>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              구독을 취소하시겠습니까?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              취소하면 현재 결제 기간이 끝난 후 Free 플랜으로 전환됩니다.
              무제한 추출과 AI 요약 기능을 더 이상 사용할 수 없게 됩니다.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                유지하기
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {cancelling ? "처리 중..." : "구독 취소"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
