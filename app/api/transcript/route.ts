import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript, getVideoInfo } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      videoId,
      title: videoInfo.title,
      transcript: entries,
      fullText,
      language,
    });
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
