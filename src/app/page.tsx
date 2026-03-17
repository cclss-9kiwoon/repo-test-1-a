"use client";

import Link from "next/link";
import { MessageCircle, Sparkles, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { getMealLogs } from "@/lib/storage";
import { MealLog } from "@/types";
import { CUISINE_LABELS } from "@/lib/constants";
import { isToday, isYesterday, format } from "date-fns";
import { ko } from "date-fns/locale";

function formatRelativeDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "오늘";
  if (isYesterday(d)) return "어제";
  return format(d, "M월 d일 (EEE)", { locale: ko });
}

function MealMiniCard({ meal }: { meal: MealLog }) {
  return (
    <div className="bg-card-bg rounded-2xl p-4 border border-card-border shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted">{formatRelativeDate(meal.date)}</span>
        <span className="text-xs text-accent font-medium">
          {"★".repeat(meal.satisfaction)}
          {"☆".repeat(5 - meal.satisfaction)}
        </span>
      </div>
      <p className="font-semibold text-sm">{meal.menuItem}</p>
      <p className="text-xs text-muted mt-0.5">
        {meal.restaurantName} · {CUISINE_LABELS[meal.cuisineCategory]}
      </p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 10) return "좋은 아침!";
  if (h < 14) return "점심 시간이야!";
  if (h < 18) return "오후도 파이팅!";
  return "오늘 하루 수고했어!";
}

export default function HomePage() {
  const [meals, setMeals] = useState<MealLog[]>([]);

  useEffect(() => {
    setMeals(getMealLogs().slice(0, 5));
  }, []);

  const todayMeal = meals.find((m) => isToday(new Date(m.date)));

  return (
    <div className="px-5 pt-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{getGreeting()} 🍚</h1>
        <p className="text-muted text-sm mt-1">
          {todayMeal
            ? `오늘은 ${todayMeal.menuItem} 먹었구나!`
            : "오늘 점심은 뭐 먹을까?"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/log"
          className="flex flex-col items-center gap-2 bg-ai-bubble rounded-3xl p-5 border border-card-border hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <MessageCircle size={28} className="text-accent" />
          <span className="text-sm font-semibold">점심 기록하기</span>
          <span className="text-xs text-muted">오늘 뭐 먹었어?</span>
        </Link>
        <Link
          href="/recommend"
          className="flex flex-col items-center gap-2 bg-accent-secondary-light/30 rounded-3xl p-5 border border-card-border hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <Sparkles size={28} className="text-accent-secondary" />
          <span className="text-sm font-semibold">추천 받기</span>
          <span className="text-xs text-muted">뭐 먹을지 골라줘!</span>
        </Link>
      </div>

      {/* Recent Meals */}
      {meals.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">최근 기록</h2>
            <Link href="/history" className="text-xs text-accent">
              전체 보기
            </Link>
          </div>
          <div className="space-y-2">
            {meals.map((meal) => (
              <MealMiniCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <UtensilsCrossed size={48} className="mx-auto text-accent-light mb-3" />
          <p className="text-sm text-muted">아직 기록이 없어!</p>
          <p className="text-xs text-muted mt-1">점심 먹고 기록해보자</p>
        </div>
      )}
    </div>
  );
}
