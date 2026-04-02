import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-2 text-gray-500">추출 내역과 저장된 대본을 관리하세요.</p>

          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-400">아직 추출한 대본이 없습니다.</p>
            <p className="mt-1 text-sm text-gray-400">
              메인 페이지에서 유튜브 URL을 입력해 보세요.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
