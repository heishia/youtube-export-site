import { TranscriptEntry, VideoInfo } from "@/types";

export async function fetchTranscript(
  _videoId: string
): Promise<TranscriptEntry[]> {
  throw new Error("Not implemented");
}

export async function fetchVideoInfo(_videoId: string): Promise<VideoInfo> {
  throw new Error("Not implemented");
}

export function buildThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
