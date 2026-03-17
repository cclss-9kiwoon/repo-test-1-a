"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TestResult } from "@/types";
import Link from "next/link";

export default function ResultPage() {
  const params = useParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/analyze?id=${params.id}`);
        if (!response.ok) throw new Error("결과 로드 실패");
        const data = await response.json();
        setResult(data);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [params.id]);

  async function handleShare(platform: "copy" | "twitter") {
    if (!result) return;

    const shareUrl = `${window.location.origin}/result/${result.id}`;
    const shareText = `🔮 나의 심리 테스트 결과: "${result.typeName}" - ${result.oneLineSummary}`;

    if (platform === "copy") {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-card-bg rounded-lg mb-4 w-48 mx-auto" />
          <div className="h-4 bg-card-bg rounded mb-2 w-64 mx-auto" />
          <div className="h-4 bg-card-bg rounded w-56 mx-auto" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">결과를 찾을 수 없습니다</h2>
        <Link href="/" className="text-accent-light hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Result Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-5xl mb-4 block">🔮</span>
          <p className="text-sm text-accent-light mb-1">당신의 유형</p>
          <h1 className="text-2xl font-bold">{result.typeName}</h1>
        </div>

        {/* Rarity */}
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center mb-6">
          <p className="text-sm text-gray-400 mb-1">희귀도</p>
          <p className="text-2xl font-bold text-accent-light">
            상위 {result.rarityScore}%
          </p>
          <p className="text-sm text-gray-400">{result.rarityLabel}</p>
        </div>

        {/* Traits */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">핵심 특성</h3>
          <div className="flex flex-wrap gap-2">
            {result.traits?.map((trait, i) => (
              <span
                key={i}
                className="bg-card-border/50 text-sm px-3 py-1.5 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Personality Summary */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              성격 요약
            </h3>
            <p className="text-sm leading-relaxed">
              {result.personalitySummary}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              인간관계
            </h3>
            <p className="text-sm leading-relaxed">
              {result.relationshipStyle}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              연애 성향
            </h3>
            <p className="text-sm leading-relaxed">{result.loveStyle}</p>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
        <h3 className="text-center font-semibold mb-4">결과 공유하기</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleShare("copy")}
            className="flex-1 bg-card-border/50 hover:bg-card-border rounded-xl py-3 px-4 text-sm transition-colors"
          >
            {copied ? "복사됨!" : "🔗 링크 복사"}
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex-1 bg-card-border/50 hover:bg-card-border rounded-xl py-3 px-4 text-sm transition-colors"
          >
            🐦 트위터
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-accent/80 text-white font-semibold rounded-xl py-3 px-8 transition-colors"
        >
          다른 테스트 해보기
        </Link>
      </div>
    </div>
  );
}
