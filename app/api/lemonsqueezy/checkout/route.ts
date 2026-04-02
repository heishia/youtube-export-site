import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutUrl, PLANS } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    if (plan !== "pro" && plan !== "team") {
      return NextResponse.json(
        { error: "유효하지 않은 플랜입니다." },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];
    const checkoutUrl = await createCheckoutUrl(
      planConfig.variantId,
      session.user.id,
      session.user.email
    );

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "체크아웃 URL 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch {
    return NextResponse.json(
      { error: "결제 페이지 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
