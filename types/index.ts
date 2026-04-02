export interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptResponse {
  videoId: string;
  title: string;
  transcript: TranscriptEntry[];
  language: string;
}

export interface SummaryResponse {
  videoId: string;
  summary: string;
  keyPoints: string[];
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
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

export interface ApiError {
  message: string;
  code: string;
}
