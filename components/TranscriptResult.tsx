"use client";

import { useState, useMemo, useCallback, useRef, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { TranscriptEntry, TranscriptApiResponse } from "@/types";
import { formatTimestamp } from "@/lib/youtube";
import { cn, generateSRT, generateTXT, downloadFile } from "@/lib/utils";

type Tab = "timestamp" | "fulltext" | "summary";

interface TranscriptResultProps {
  data: TranscriptApiResponse;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

export default function TranscriptResult({ data }: TranscriptResultProps) {
  const [tab, setTab] = useState<Tab>("timestamp");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const [summaryText, setSummaryText] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { transcript, title, fullText } = data;

  const totalDuration = useMemo(() => {
    if (transcript.length === 0) return "0:00";
    const last = transcript[transcript.length - 1];
    return formatTimestamp(last.start + last.duration);
  }, [transcript]);

  const charCount = useMemo(() => fullText.length, [fullText]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return transcript;
    const q = search.toLowerCase();
    return transcript.filter((e) => e.text.toLowerCase().includes(q));
  }, [transcript, search]);

  const handleCopy = async () => {
    const text =
      tab === "timestamp"
        ? generateTXT(transcript, true)
        : fullText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTXT = () => {
    const content = generateTXT(transcript, true);
    downloadFile(content, `${data.videoId}_transcript.txt`);
  };

  const handleDownloadSRT = () => {
    const content = generateSRT(transcript);
    downloadFile(content, `${data.videoId}_transcript.srt`);
  };

  const handleSummarize = useCallback(async () => {
    if (summaryLoading) return;
    if (summaryDone && summaryText) {
      setTab("summary");
      return;
    }

    setSummaryText("");
    setSummaryLoading(true);
    setSummaryDone(false);
    setSummaryError(null);
    setTab("summary");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullText, title }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setSummaryError(errData?.error ?? "요약 생성에 실패했습니다.");
        setSummaryLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setSummaryError("스트리밍 응답을 받을 수 없습니다.");
        setSummaryLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setSummaryText(accumulated);
      }

      setSummaryDone(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setSummaryError("네트워크 오류가 발생했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  }, [summaryLoading, summaryDone, summaryText, fullText, title]);

  const handleSummaryCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Meta */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
          <span>총 길이 {totalDuration}</span>
          <span>·</span>
          <span>{charCount.toLocaleString()}자</span>
          <span>·</span>
          <span>{transcript.length}개 구간</span>
          <span>·</span>
          <span>언어: {data.language.toUpperCase()}</span>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 px-6 py-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setTab("timestamp")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              tab === "timestamp"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            타임스탬프
          </button>
          <button
            onClick={() => setTab("fulltext")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              tab === "fulltext"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            전체 텍스트
          </button>
          {(summaryText || summaryLoading) && (
            <button
              onClick={() => setTab("summary")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                tab === "summary"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              ✨ AI 요약
            </button>
          )}
        </div>

        {tab !== "summary" && (
          <div className="relative w-full sm:w-56">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="자막 검색..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/30"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[420px] overflow-y-auto px-6 py-4">
        {tab === "timestamp" && (
          <div className="space-y-1.5">
            {filteredEntries.length === 0 && search.trim() ? (
              <p className="text-sm text-gray-400 text-center py-8">
                &quot;{search}&quot;에 대한 검색 결과가 없습니다.
              </p>
            ) : (
              filteredEntries.map((entry: TranscriptEntry, i: number) => (
                <div
                  key={i}
                  className="flex gap-3 py-1.5 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="shrink-0 w-20 text-xs font-mono text-indigo-500 pt-0.5 text-right">
                    {formatTimestamp(entry.start)}
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    <HighlightText text={entry.text} query={search} />
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "fulltext" && (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            <HighlightText text={fullText} query={search} />
          </div>
        )}

        {tab === "summary" && (
          <div className="min-h-[200px]">
            {summaryError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-600">
                {summaryError}
              </div>
            )}

            {summaryLoading && !summaryText && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]" />
                </div>
                <p className="text-sm text-gray-500 animate-pulse">
                  AI가 영상을 분석하고 있습니다...
                </p>
              </div>
            )}

            {summaryText && (
              <div className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-li:text-gray-700 prose-p:text-gray-700 prose-strong:text-gray-900">
                <ReactMarkdown>{summaryText}</ReactMarkdown>
                {summaryLoading && (
                  <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-gray-100 px-6 py-4">
        {tab === "summary" ? (
          <button
            onClick={handleSummaryCopy}
            disabled={!summaryDone}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              summaryDone
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            )}
          >
            {summaryCopied ? "✅ 복사됨!" : "📋 요약 복사"}
          </button>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {copied ? "✅ 복사됨!" : "📋 전체 복사"}
            </button>
            <button
              onClick={handleDownloadTXT}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              📄 TXT 다운로드
            </button>
            <button
              onClick={handleDownloadSRT}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              🎬 SRT 다운로드
            </button>
          </>
        )}

        <button
          onClick={handleSummarize}
          disabled={summaryLoading}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors ml-auto",
            summaryLoading
              ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
              : summaryDone
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          {summaryLoading
            ? "⏳ 분석 중..."
            : summaryDone
              ? "✨ 요약 보기"
              : "✨ AI 요약"}
        </button>
      </div>
    </div>
  );
}
