import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractVideoId, fetchTranscript, getVideoInfo } from "@/lib/youtube";
import { checkUsageLimit, incrementUsage, checkAnonUsage } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let anonUsageResult: ReturnType<typeof checkAnonUsage> | null = null;

    if (session?.user?.id) {
      const usage = await checkUsageLimit(session.user.id);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `일일 사용 한도(${usage.limit}회)를 초과했습니다. Pro로 업그레이드하면 무제한으로 사용할 수 있습니다.`,
            code: "USAGE_LIMIT",
          },
          { status: 402 }
        );
      }
    } else {
      const cookieValue = req.cookies.get("sg_anon_usage")?.value;
      anonUsageResult = checkAnonUsage(cookieValue);
      if (!anonUsageResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: "비로그인 사용자의 일일 한도(3회)를 초과했습니다. 로그인하면 더 많이 사용할 수 있습니다.",
            code: "USAGE_LIMIT",
          },
          { status: 402 }
        );
      }
    }

    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "URL을 입력해주세요.", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url.trim());

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 유튜브 URL입니다. youtube.com 또는 youtu.be 링크를 입력해주세요.",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    const [{ entries, language }, videoInfo] = await Promise.all([
      fetchTranscript(videoId),
      getVideoInfo(videoId),
    ]);

    if (entries.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "이 영상에는 자막이 없습니다.",
          code: "NO_TRANSCRIPT",
        },
        { status: 404 }
      );
    }

    const fullText = entries.map((e) => e.text).join(" ");

    if (session?.user?.id) {
      await incrementUsage(session.user.id, {
        videoId,
        videoTitle: videoInfo.title,
        language,
        charCount: fullText.length,
      });
    }

    const response = NextResponse.json({
      success: true,
      videoId,
      title: videoInfo.title,
      transcript: entries,
      fullText,
      language,
    });

    if (!session?.user?.id && anonUsageResult) {
      response.cookies.set("sg_anon_usage", anonUsageResult.newCookieValue, {
        httpOnly: true,
        maxAge: 86400,
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";

    if (message === "NO_TRANSCRIPT") {
      return NextResponse.json(
        {
          success: false,
          message: "이 영상에서 자막을 찾을 수 없습니다. 자막이 제공되지 않는 영상일 수 있습니다.",
          code: "NO_TRANSCRIPT",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "자막 추출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
