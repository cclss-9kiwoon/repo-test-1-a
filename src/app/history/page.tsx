"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMealLogs } from "@/lib/storage";
import { MealLog } from "@/types";
import { CUISINE_LABELS, WEATHER_OPTIONS, MOOD_OPTIONS } from "@/lib/constants";
import { format, isToday, isYesterday } from "date-fns";
import { ko } from "date-fns/locale";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "오늘";
  if (isYesterday(d)) return "어제";
  return format(d, "M월 d일 (EEE)", { locale: ko });
}

function MealHistoryCard({ meal, index }: { meal: MealLog; index: number }) {
  const weatherEmoji = WEATHER_OPTIONS.find((w) => w.value === meal.weatherFeeling)?.emoji || "";
  const moodEmoji = MOOD_OPTIONS.find((m) => m.value === meal.mood)?.emoji || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card-bg rounded-2xl p-4 border border-card-border shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold">{meal.menuItem}</p>
          <p className="text-xs text-muted mt-0.5">{meal.restaurantName}</p>
        </div>
        <span className="text-xs text-accent font-medium">
          {"★".repeat(meal.satisfaction)}
          {"☆".repeat(5 - meal.satisfaction)}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span>{formatDate(meal.date)}</span>
        <span className="text-card-border">|</span>
        <span>{CUISINE_LABELS[meal.cuisineCategory]}</span>
        <span className="text-card-border">|</span>
        <span>{weatherEmoji} {moodEmoji}</span>
      </div>

      {meal.waitTimeMinutes !== undefined && (
        <p className="text-xs text-muted mt-1.5">
          대기 {meal.waitTimeMinutes === 0 ? "없음" : `${meal.waitTimeMinutes}분`}
          {meal.wouldReturn ? " · 재방문 의사 있음 👍" : " · 재방문 글쎄 🤔"}
        </p>
      )}

      {meal.notes && (
        <p className="text-xs text-foreground/70 mt-1.5 bg-ai-bubble rounded-xl px-3 py-2">
          {meal.notes}
        </p>
      )}
    </motion.div>
  );
}

export default function HistoryPage() {
  const [meals, setMeals] = useState<MealLog[]>([]);

  useEffect(() => {
    setMeals(getMealLogs());
  }, []);

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
          <h1 className="text-base font-semibold">식사 히스토리</h1>
          <p className="text-xs text-muted">
            {meals.length > 0 ? `총 ${meals.length}개의 기록` : "아직 기록이 없어"}
          </p>
        </div>
      </div>

      {meals.length > 0 ? (
        <div className="space-y-3">
          {meals.map((meal, i) => (
            <MealHistoryCard key={meal.id} meal={meal} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <UtensilsCrossed size={48} className="mx-auto text-accent-light mb-3" />
          <p className="text-sm text-muted">아직 기록이 없어!</p>
          <p className="text-xs text-muted mt-1">점심 먹고 기록해보자</p>
          <Link
            href="/log"
            className="inline-block mt-4 px-5 py-2 text-sm rounded-full bg-accent text-white"
          >
            기록하러 가기
          </Link>
        </div>
      )}
    </div>
  );
}
