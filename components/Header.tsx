"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold text-gray-900">
              Script<span className="text-indigo-600">Grab</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              사용법
            </a>
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              기능
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              가격
            </a>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
            >
              시작하기
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <a
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileOpen(false)}
            >
              사용법
            </a>
            <a
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileOpen(false)}
            >
              기능
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileOpen(false)}
            >
              가격
            </a>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-center transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              시작하기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
