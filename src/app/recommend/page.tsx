"use client";

import { useState } from "react";
import { ChevronLeft, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherFeeling, MoodLevel, TimeConstraint, Recommendation } from "@/types";
import { WEATHER_OPTIONS, MOOD_OPTIONS, TIME_OPTIONS } from "@/lib/constants";
import { getRecommendations } from "@/lib/recommendations";
import RecommendationCard from "@/components/RecommendationCard";

type Phase = "weather" | "mood" | "time" | "result";

export default function RecommendPage() {
  const [phase, setPhase] = useState<Phase>("weather");
  const [weather, setWeather] = useState<WeatherFeeling | null>(null);
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [timeConstraint, setTimeConstraint] = useState<TimeConstraint | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  function handleWeather(w: WeatherFeeling) {
    setWeather(w);
    setPhase("mood");
  }

  function handleMood(m: MoodLevel) {
    setMood(m);
    setPhase("time");
  }

  function handleTime(t: TimeConstraint) {
    setTimeConstraint(t);
    const recs = getRecommendations(weather!, mood!, t);
    setRecommendations(recs);
    setPhase("result");
  }

  function handleRetry() {
    if (weather && mood && timeConstraint) {
      const recs = getRecommendations(weather, mood, timeConstraint);
      setRecommendations(recs);
    }
  }

  function handleReset() {
    setPhase("weather");
    setWeather(null);
    setMood(null);
    setTimeConstraint(null);
    setRecommendations([]);
  }

  return (
    <div className="px-5 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card-border/50 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-base font-semibold">점심 추천</h1>
          <p className="text-xs text-muted">오늘 뭐 먹을지 골라줄게!</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(["weather", "mood", "time", "result"] as Phase[]).map((p, i) => (
          <div
            key={p}
            className={`h-2 rounded-full transition-all duration-300 ${
              phase === p
                ? "w-8 bg-accent"
                : i < ["weather", "mood", "time", "result"].indexOf(phase)
                ? "w-2 bg-accent-light"
                : "w-2 bg-card-border"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "weather" && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-center text-sm font-medium mb-4">오늘 밖에 날씨 어때?</p>
            <div className="grid grid-cols-4 gap-2">
              {WEATHER_OPTIONS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => handleWeather(value)}
                  className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-card-bg border border-card-border hover:border-accent-secondary hover:bg-accent-secondary-light/20 transition-all active:scale-95"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-[10px] text-muted">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "mood" && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-center text-sm font-medium mb-4">오늘 컨디션은?</p>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => handleMood(value)}
                  className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-card-bg border border-card-border hover:border-accent hover:bg-ai-bubble transition-all active:scale-95"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs text-muted">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "time" && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-center text-sm font-medium mb-4">시간은 얼마나 있어?</p>
            <div className="grid grid-cols-2 gap-3">
              {TIME_OPTIONS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => handleTime(value)}
                  className="flex items-center gap-3 py-4 px-4 rounded-2xl bg-card-bg border border-card-border hover:border-accent hover:bg-ai-bubble transition-all active:scale-95"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <Sparkles size={24} className="mx-auto text-accent mb-2" />
              <p className="text-sm font-medium">오늘의 추천!</p>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted">아직 기록이 부족해서 잘 모르겠어 😅</p>
                <p className="text-xs text-muted mt-1">
                  점심 기록을 좀 더 쌓으면 더 좋은 추천을 해줄 수 있어!
                </p>
                <Link
                  href="/log"
                  className="inline-block mt-4 px-5 py-2 text-sm rounded-full bg-accent text-white"
                >
                  점심 기록하러 가기
                </Link>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-card-bg border border-card-border text-sm hover:bg-ai-bubble transition-all active:scale-[0.98]"
              >
                <RefreshCw size={16} />
                다른 추천
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-2xl bg-accent text-white text-sm transition-all active:scale-[0.98]"
              >
                처음부터
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
