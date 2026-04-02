import { TranscriptEntry } from "@/types";
import { formatSRTTimestamp } from "@/lib/youtube";

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateSRT(entries: TranscriptEntry[]): string {
  return entries
    .map((entry, i) => {
      const startTime = formatSRTTimestamp(entry.start);
      const endTime = formatSRTTimestamp(entry.start + entry.duration);
      return `${i + 1}\n${startTime} --> ${endTime}\n${entry.text}\n`;
    })
    .join("\n");
}

export function generateTXT(entries: TranscriptEntry[], withTimestamp = false): string {
  if (!withTimestamp) {
    return entries.map((e) => e.text).join(" ");
  }
  return entries
    .map((e) => {
      const h = Math.floor(e.start / 3600);
      const m = Math.floor((e.start % 3600) / 60);
      const s = Math.floor(e.start % 60);
      const ts = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      return `[${ts}] ${e.text}`;
    })
    .join("\n");
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
