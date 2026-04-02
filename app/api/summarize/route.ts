import { NextRequest } from "next/server";
import { getOpenAIClient, truncateText, SUMMARY_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { fullText, title } = await req.json();

    if (!fullText || typeof fullText !== "string" || fullText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "요약할 자막 텍스트가 필요합니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let client;
    try {
      client = getOpenAIClient();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "OPENAI_API_KEY_MISSING") {
        return new Response(
          JSON.stringify({ error: "OpenAI API 키를 설정해주세요. .env.local에 OPENAI_API_KEY를 추가하세요." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      throw err;
    }

    const trimmedText = truncateText(fullText);
    const userMessage = title
      ? `영상 제목: ${title}\n\n자막 내용:\n${trimmedText}`
      : trimmedText;

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 2000,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (message.includes("rate_limit") || message.includes("429")) {
            controller.enqueue(
              encoder.encode("\n\n⚠️ 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.")
            );
          } else {
            controller.enqueue(
              encoder.encode("\n\n⚠️ 요약 생성 중 오류가 발생했습니다.")
            );
          }
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
