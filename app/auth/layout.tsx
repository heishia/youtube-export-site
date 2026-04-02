import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "ScriptGrab에 로그인하고 더 많은 기능을 사용하세요.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
