export interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptApiResponse {
  success: true;
  videoId: string;
  title: string;
  transcript: TranscriptEntry[];
  fullText: string;
  language: string;
}

export interface TranscriptApiError {
  success: false;
  message: string;
  code: "INVALID_URL" | "NO_TRANSCRIPT" | "SERVER_ERROR";
}

export interface SummaryResponse {
  videoId: string;
  summary: string;
  keyPoints: string[];
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
}

export type PricingTier = "free" | "pro" | "team";

export interface PricingPlan {
  tier: PricingTier;
  name: string;
  price: string;
  priceDetail: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}
