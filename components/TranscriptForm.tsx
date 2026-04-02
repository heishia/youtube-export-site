"use client";

import { useState, useRef, useCallback } from "react";
import { extractVideoId } from "@/lib/youtube";
import { TranscriptApiResponse, TranscriptApiError } from "@/types";

interface TranscriptFormProps {
  onResult: (data: TranscriptApiResponse) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  isLoading: boolean;
}

export default function TranscriptForm({
  onResult,
  onLoading,
  onError,
  isLoading,
}: TranscriptFormProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSubmittedUrl = useRef("");

  const handleExtract = useCallback(
    async (targetUrl: string) => {
      const trimmed = targetUrl.trim();
      if (!trimmed) return;

      if (!extractVideoId(trimmed)) {
        onError("유효한 유튜브 URL을 입력해주세요.");
        return;
      }

      if (trimmed === lastSubmittedUrl.current && isLoading) return;
      lastSubmittedUrl.current = trimmed;

      onError(null);
      onLoading(true);

      try {
        const res = await fetch("/api/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });

        const data: TranscriptApiResponse | TranscriptApiError =
          await res.json();

        if (!data.success) {
          onError((data as TranscriptApiError).message);
          return;
        }

        onResult(data as TranscriptApiResponse);
      } catch {
        onError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
      } finally {
        onLoading(false);
      }
    },
    [onResult, onLoading, onError, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExtract(url);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (extractVideoId(pasted.trim())) {
      setTimeout(() => handleExtract(pasted.trim()), 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="유튜브 영상 URL을 붙여넣으세요"
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              추출 중...
            </>
          ) : (
            "추출하기"
          )}
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        무료로 하루 3회 사용 가능
      </p>
    </form>
  );
}
