"use client";

import { TranscriptEntry } from "@/types";
import { formatTimestamp } from "@/lib/utils";

interface TranscriptResultProps {
  entries: TranscriptEntry[];
  title?: string;
}

export default function TranscriptResult({ entries, title }: TranscriptResultProps) {
  if (entries.length === 0) return null;

  const fullText = entries.map((e) => e.text).join(" ");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-2xl border border-gray-200 bg-white p-6">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <div className="max-h-80 overflow-y-auto space-y-2 text-sm text-gray-700">
        {entries.map((entry, i) => (
          <p key={i}>
            <span className="mr-2 text-xs font-mono text-indigo-500">
              {formatTimestamp(entry.start)}
            </span>
            {entry.text}
          </p>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCopy}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          📋 복사하기
        </button>
        <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
          💾 다운로드
        </button>
      </div>
    </div>
  );
}
