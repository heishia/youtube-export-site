import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <span className="text-lg font-bold text-gray-900">
              Script<span className="text-indigo-600">Grab</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              개인정보처리방침
            </Link>
            <a href="mailto:support@scriptgrab.com" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              문의하기
            </a>
          </nav>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ScriptGrab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
