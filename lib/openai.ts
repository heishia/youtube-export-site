import { TranscriptEntry, SummaryResponse } from "@/types";

export async function summarizeTranscript(
  _videoId: string,
  _transcript: TranscriptEntry[]
): Promise<SummaryResponse> {
  throw new Error("Not implemented");
}
