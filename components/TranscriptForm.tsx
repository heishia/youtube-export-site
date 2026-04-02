"use client";

import { useState } from "react";

export default function TranscriptForm() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 추출 로직 연결
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="유튜브 URL을 붙여넣으세요"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          추출하기
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        무료로 하루 3회 사용 가능
      </p>
    </form>
  );
}
