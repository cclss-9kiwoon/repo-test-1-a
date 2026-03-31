"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/types";
import { analyzeLocally, saveResult } from "@/lib/analyze-client";

interface TestRunnerProps {
  testId: string;
  testTitle: string;
  questions: Question[];
}

export default function TestRunner({
  testId,
  testTitle,
  questions,
}: TestRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  function handleAnswer(answer: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitAnswers(newAnswers);
    }
  }

  function submitAnswers(finalAnswers: Record<string, string>) {
    setIsSubmitting(true);

    // Simulate analysis delay for UX
    setTimeout(() => {
      try {
        const result = analyzeLocally({
          testId,
          testTitle,
          questions: questions.map((q) => ({
            text: q.text,
            answer: finalAnswers[q.id] || "",
          })),
        });

        saveResult(result);
        router.push(`/result/${result.id}/`);
      } catch {
        setIsSubmitting(false);
        alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }, 1500);
  }

  if (isSubmitting) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-pulse-glow inline-block p-8 rounded-full bg-card-bg mb-6">
          <span className="text-5xl">🔮</span>
        </div>
        <h2 className="text-xl font-bold mb-2">AI가 당신을 분석 중...</h2>
        <p className="text-gray-400">잠시만 기다려주세요</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{testTitle}</span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-card-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={currentQuestion.id} className="animate-fade-in">
        <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
        {currentQuestion.hintText && (
          <p className="text-sm text-gray-400 mb-6">
            {currentQuestion.hintText}
          </p>
        )}

        {/* Choices */}
        <div className="space-y-3">
          {currentQuestion.choices?.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(choice)}
              className="w-full text-left p-4 bg-card-bg border border-card-border rounded-xl hover:border-accent hover:bg-accent/10 transition-all duration-200 active:scale-[0.98]"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← 이전 질문
        </button>
      )}
    </div>
  );
}
