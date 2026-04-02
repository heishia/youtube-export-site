import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cancelSub } from "@/lib/lemonsqueezy";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { subscriptionId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lemonSqueezySubId: true },
    });

    if (user?.lemonSqueezySubId !== subscriptionId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    await cancelSub(subscriptionId);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lemonSqueezySubStatus: "cancelled",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "구독 취소 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
