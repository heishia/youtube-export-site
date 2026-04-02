import { TranscriptEntry, VideoInfo } from "@/types";

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatSRTTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}

export async function getVideoInfo(videoId: string): Promise<VideoInfo> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const res = await fetch(oembedUrl);
    if (!res.ok) throw new Error("oEmbed fetch failed");
    const data = await res.json();
    return {
      title: data.title ?? "제목 없음",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      author: data.author_name ?? "",
    };
  } catch {
    return {
      title: "제목을 가져올 수 없습니다",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      author: "",
    };
  }
}

const LANG_FALLBACK = ["ko", "en", undefined] as const;

export async function fetchTranscript(
  videoId: string
): Promise<{ entries: TranscriptEntry[]; language: string }> {
  const { YoutubeTranscript } = await import("youtube-transcript");

  for (const lang of LANG_FALLBACK) {
    try {
      const raw = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: lang as string | undefined,
      });

      const entries: TranscriptEntry[] = raw.map((item) => ({
        text: item.text.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]*>/g, ""),
        start: item.offset / 1000,
        duration: item.duration / 1000,
      }));

      return { entries, language: lang ?? "auto" };
    } catch {
      continue;
    }
  }

  throw new Error("NO_TRANSCRIPT");
}
