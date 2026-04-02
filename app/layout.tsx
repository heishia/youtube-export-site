import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ScriptGrab – 유튜브 영상, 텍스트로 3초 만에",
  description:
    "유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에. 무료로 시작하세요.",
  keywords: ["유튜브 자막 추출", "YouTube transcript", "AI 요약", "ScriptGrab"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
