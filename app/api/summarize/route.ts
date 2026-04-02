import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { videoId, transcript } = await req.json();

    if (!videoId || !transcript?.length) {
      return NextResponse.json(
        { message: "자막 데이터가 필요합니다.", code: "MISSING_DATA" },
        { status: 400 }
      );
    }

    // TODO: AI 요약 로직 구현
    return NextResponse.json({
      videoId,
      summary: "",
      keyPoints: [],
    });
  } catch {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
