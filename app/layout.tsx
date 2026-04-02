import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://scriptgrab.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ScriptGrab – 유튜브 영상, 텍스트로 3초 만에",
    template: "%s | ScriptGrab",
  },
  description:
    "유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에. 타임스탬프 대본, 키워드 검색, TXT/SRT 다운로드까지.",
  keywords: [
    "유튜브 자막 추출",
    "YouTube transcript",
    "AI 요약",
    "ScriptGrab",
    "유튜브 대본",
    "자막 다운로드",
    "SRT 변환",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "ScriptGrab",
    title: "ScriptGrab – 유튜브 영상, 텍스트로 3초 만에",
    description:
      "유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에. 무료로 시작하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScriptGrab – 유튜브 자막 추출 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptGrab – 유튜브 영상, 텍스트로 3초 만에",
    description:
      "유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
