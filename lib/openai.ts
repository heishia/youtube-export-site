import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }
  return new OpenAI({ apiKey });
}

const MAX_TEXT_LENGTH = 100_000;

export function truncateText(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) return text;
  const half = Math.floor(MAX_TEXT_LENGTH / 2);
  return (
    text.slice(0, half) +
    "\n\n[... 중간 내용 생략 ...]\n\n" +
    text.slice(-half)
  );
}

export const SUMMARY_SYSTEM_PROMPT = `당신은 유튜브 영상 자막을 분석하는 전문 요약 AI입니다.
사용자가 제공한 자막 텍스트를 아래 형식으로 요약해주세요. 반드시 한국어로 작성하세요.

## 📌 핵심 요약
- 영상의 핵심 내용을 3줄로 요약합니다.

## 📋 주요 내용
- 영상에서 다루는 주요 포인트를 bullet point로 5~10개 정리합니다.
- 각 포인트는 구체적이고 정보를 담고 있어야 합니다.

## 🏷️ 키워드
영상의 핵심 키워드 5개를 쉼표로 구분하여 나열합니다.

## ⏱️ 타임라인 요약
- 영상의 흐름에 따라 주요 구간별 한 줄 요약을 제공합니다.
- 자막의 순서를 기반으로 시간 흐름을 추정합니다.

형식을 정확히 지켜주세요. 마크다운 문법을 사용합니다.`;
