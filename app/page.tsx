import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranscriptForm from "@/components/TranscriptForm";
import PricingCard from "@/components/PricingCard";
import { PricingPlan } from "@/types";

const plans: PricingPlan[] = [
  {
    tier: "free",
    name: "Free",
    price: "₩0",
    priceDetail: "",
    features: [
      "하루 3회 추출",
      "기본 자막 추출",
      "TXT 다운로드",
      "타임스탬프 포함",
    ],
    cta: "무료로 시작",
  },
  {
    tier: "pro",
    name: "Pro",
    price: "₩9,900",
    priceDetail: "/ 월",
    features: [
      "무제한 추출",
      "AI 3줄 요약",
      "다국어 자막 지원",
      "SRT 다운로드",
      "우선 처리",
    ],
    cta: "Pro 시작하기",
    highlighted: true,
  },
  {
    tier: "team",
    name: "Team",
    price: "₩29,900",
    priceDetail: "/ 월",
    features: [
      "5인 팀 사용",
      "Pro 기능 전체 포함",
      "API 액세스",
      "대시보드 분석",
      "전담 지원",
    ],
    cta: "팀 플랜 문의",
  },
];

const steps = [
  { icon: "🔗", title: "URL 붙여넣기", desc: "유튜브 영상 URL을 입력창에 붙여넣으세요" },
  { icon: "⚡", title: "AI가 자막 추출", desc: "AI가 영상의 자막을 빠르게 추출합니다" },
  { icon: "📋", title: "복사 or 다운로드", desc: "추출된 대본을 복사하거나 파일로 저장하세요" },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "타임스탬프 포함 대본",
    desc: "영상의 모든 자막을 시간 정보와 함께 깔끔하게 정리합니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI 3줄 요약",
    desc: "긴 영상도 핵심만 3줄로 요약해 드립니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: "다국어 자막 지원",
    desc: "영어, 일본어, 스페인어 등 다양한 언어의 자막을 추출합니다.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "대본 다운로드 (TXT, SRT)",
    desc: "추출된 대본을 TXT 또는 SRT 파일로 다운로드하세요.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/70 via-white to-white" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              유튜브 영상,{" "}
              <span className="text-indigo-600">텍스트로 3초 만에</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에
            </p>
            <div className="mt-10">
              <TranscriptForm />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
              이렇게 사용하세요
            </h2>
            <p className="mt-3 text-center text-gray-500">
              단 3단계면 충분합니다
            </p>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                    {step.icon}
                  </div>
                  <div className="mt-1 text-xs font-bold text-indigo-500">
                    STEP {i + 1}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
              주요 기능
            </h2>
            <p className="mt-3 text-center text-gray-500">
              ScriptGrab이 제공하는 모든 것
            </p>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {feat.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
              심플한 가격
            </h2>
            <p className="mt-3 text-center text-gray-500">
              필요한 만큼만 선택하세요
            </p>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <PricingCard key={plan.tier} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
