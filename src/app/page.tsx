import Link from "next/link";
import { tests } from "@/data/tests";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <section className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-3">
          <span className="text-accent-light">AI</span> 심리 테스트
        </h1>
        <p className="text-gray-400 text-lg">
          졸릴 때 1~3분이면 끝!
          <br />
          당신의 숨겨진 심리를 알아보세요
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          무료 테스트
        </h2>
        {tests
          .filter((t) => t.isFree)
          .map((test) => (
            <Link
              key={test.id}
              href={`/test/${test.id}`}
              className="block bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent transition-all duration-200 animate-fade-in"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{test.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{test.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {test.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-accent/20 text-accent-light px-2 py-0.5 rounded-full">
                      무료
                    </span>
                    <span className="text-xs text-gray-500">
                      {test.questionCount}문항 · 약 2분
                    </span>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          프리미엄 테스트
        </h2>
        {["연애 성향 테스트", "친구 유형 테스트", "직장 성향 테스트"].map(
          (title, i) => (
            <div
              key={i}
              className="block bg-card-bg/50 border border-card-border rounded-2xl p-5 opacity-60"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">
                  {["💕", "🤝", "💼"][i]}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-gray-400 mt-1">Coming Soon</p>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full mt-2 inline-block">
                    990원
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
}
