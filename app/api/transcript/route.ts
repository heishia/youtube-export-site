import { NextRequest, NextResponse } from "next/server";
import { extractVideoId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { message: "유효하지 않은 유튜브 URL입니다.", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    // TODO: 자막 추출 로직 구현
    return NextResponse.json({ videoId, transcript: [], language: "ko" });
  } catch {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
