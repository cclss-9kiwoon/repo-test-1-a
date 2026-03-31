import { MealLog, Restaurant, Recommendation, WeatherFeeling, MoodLevel, TimeConstraint, CuisineCategory } from "@/types";
import { getMealLogs, getRestaurants } from "./storage";
import { CUISINE_LABELS } from "./constants";
import { isWithinInterval, subDays } from "date-fns";

interface RecommendationContext {
  recentMeals: MealLog[];
  weather: WeatherFeeling;
  mood: MoodLevel;
  timeConstraint: TimeConstraint;
  restaurants: Restaurant[];
}

// Which cuisines go well with which weather
const WEATHER_CUISINE_MAP: Partial<Record<WeatherFeeling, CuisineCategory[]>> = {
  sunny_cold: ["korean_soup", "korean_noodle"],
  snowy: ["korean_soup", "korean_meat"],
  rainy: ["korean_soup", "korean_noodle"],
  humid_hot: ["korean_noodle", "salad_light", "japanese"],
  sunny_warm: ["salad_light", "japanese", "western", "southeast_asian"],
  perfect: ["western", "japanese", "salad_light", "korean_rice"],
};

// Comfort foods for tough moods
const MOOD_CUISINE_MAP: Partial<Record<MoodLevel, CuisineCategory[]>> = {
  very_tired: ["korean_soup", "korean_rice", "fast_food"],
  tired: ["korean_soup", "korean_rice"],
  stressed: ["korean_meat", "korean_soup", "fast_food"],
  energetic: ["western", "japanese", "southeast_asian", "salad_light"],
  good: ["japanese", "western", "korean_meat"],
};

// Get consecutive days eating the same cuisine category
function getCuisineStreak(meals: MealLog[]): { category: CuisineCategory; count: number } | null {
  if (meals.length < 2) return null;
  const sorted = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const category = sorted[0].cuisineCategory;
  let count = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].cuisineCategory === category) count++;
    else break;
  }
  return count >= 2 ? { category, count } : null;
}

// Generate weather-appropriate reasoning
function getWeatherReasoning(weather: WeatherFeeling): string {
  const map: Record<WeatherFeeling, string> = {
    sunny_cold: "날씨가 좀 쌀쌀하니까 따뜻한 거 어때?",
    snowy: "눈 오는 날엔 뜨끈한 국물이 최고지!",
    rainy: "비 오는 날엔 역시 뜨끈한 게 좋지~",
    humid_hot: "더운 날이니까 시원한 거 먹자!",
    sunny_warm: "날씨 좋으니까 가볍게 먹어도 좋겠다!",
    cloudy: "흐린 날이지만 맛있는 거 먹으면 기분 좋아질 거야!",
    windy: "바람 부니까 실내에서 따뜻하게 먹자!",
    perfect: "날씨 완벽한 날이네! 뭘 먹어도 맛있을 듯!",
  };
  return map[weather];
}

function getMoodReasoning(mood: MoodLevel): string {
  const map: Record<MoodLevel, string> = {
    very_tired: "많이 피곤하구나... 든든하게 먹고 힘내자!",
    tired: "좀 노곤한 날엔 편하게 먹는 게 좋아",
    neutral: "",
    good: "기분 좋은 날이니까 평소 안 가던 데 도전해볼까?",
    energetic: "에너지 넘치니까 새로운 거 먹어보는 건 어때?",
    stressed: "스트레스 받는 날엔 맛있는 거 먹어야지! 충전하자!",
  };
  return map[mood];
}

function generateRecommendations(ctx: RecommendationContext): Recommendation[] {
  const { recentMeals, weather, mood, timeConstraint, restaurants } = ctx;
  const recommendations: Recommendation[] = [];

  const streak = getCuisineStreak(recentMeals);
  const weatherCuisines = WEATHER_CUISINE_MAP[weather] || [];
  const moodCuisines = MOOD_CUISINE_MAP[mood] || [];

  // Score each restaurant
  const scored = restaurants
    .filter((r) => r.averageSatisfaction >= 2.5)
    .map((r) => {
      let score = 0;
      const reasons: string[] = [];

      // Base score from satisfaction
      score += r.averageSatisfaction * 10;

      // Bonus for not visited recently
      if (r.lastVisited) {
        const daysSince = Math.floor(
          (Date.now() - new Date(r.lastVisited).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSince > 7) {
          score += 15;
          reasons.push(`${daysSince}일 만이야! 오랜만에 가보자`);
        } else if (daysSince > 3) {
          score += 5;
        }
      }

      // Weather match
      if (weatherCuisines.includes(r.category)) {
        score += 20;
        reasons.push(getWeatherReasoning(weather));
      }

      // Mood match
      if (moodCuisines.includes(r.category)) {
        score += 15;
        if (getMoodReasoning(mood)) reasons.push(getMoodReasoning(mood));
      }

      // Variety: penalize if streak in same category
      if (streak && r.category === streak.category) {
        score -= 30;
        reasons.push(
          `${streak.count}일 연속 ${CUISINE_LABELS[streak.category]} 먹었으니 오늘은 다른 거 어때?`
        );
      }

      // Time constraint: prefer closer places
      if (timeConstraint === "very_tight" && r.distanceMinutes && r.distanceMinutes > 10) {
        score -= 20;
      }

      // High satisfaction bonus
      if (r.averageSatisfaction >= 4) {
        reasons.push("전에 여기 맛있다고 했었잖아!");
      }

      return { restaurant: r, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  // Take top 3
  const top = scored.slice(0, 3);

  for (const { restaurant, reasons } of top) {
    const reasoning = reasons.length > 0
      ? reasons[0]
      : `${restaurant.name} ${CUISINE_LABELS[restaurant.category]} 먹으러 가볼까?`;

    const rec: Recommendation = {
      id: crypto.randomUUID(),
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      cuisineCategory: restaurant.category,
      reasoning,
      estimatedTimeMinutes: restaurant.distanceMinutes
        ? restaurant.distanceMinutes * 2 + 30
        : undefined,
      confidence: restaurant.averageSatisfaction >= 4 ? "high" : "medium",
    };

    if (restaurant.nearbySpots?.length) {
      const spot = restaurant.nearbySpots[0];
      rec.complementaryTip = `가는 길에 ${spot.name}도 있어!`;
    }

    recommendations.push(rec);
  }

  // If no restaurants yet, give generic suggestions
  if (recommendations.length === 0) {
    const suggestions = getSuggestionsForContext(weather, mood, streak);
    return suggestions;
  }

  return recommendations;
}

function getSuggestionsForContext(
  weather: WeatherFeeling,
  mood: MoodLevel,
  streak: { category: CuisineCategory; count: number } | null
): Recommendation[] {
  const ideas: { menu: string; category: CuisineCategory; reasoning: string }[] = [];

  // Weather-based suggestions
  if (["sunny_cold", "snowy", "rainy", "windy"].includes(weather)) {
    ideas.push(
      { menu: "순대국", category: "korean_soup", reasoning: getWeatherReasoning(weather) + " 순대국 한 그릇 어때?" },
      { menu: "김치찌개", category: "korean_soup", reasoning: "뜨끈한 김치찌개 어때? 밥이랑 딱이야" },
      { menu: "칼국수", category: "korean_noodle", reasoning: "따뜻한 칼국수도 이런 날 딱이야!" },
    );
  } else if (["humid_hot", "sunny_warm"].includes(weather)) {
    ideas.push(
      { menu: "냉면", category: "korean_noodle", reasoning: "더운 날엔 시원한 냉면이 최고지!" },
      { menu: "포케볼", category: "salad_light", reasoning: "가볍고 시원한 포케볼 어때?" },
      { menu: "회덮밥", category: "japanese", reasoning: "시원한 회덮밥 먹으러 가자!" },
    );
  } else {
    ideas.push(
      { menu: "비빔밥", category: "korean_rice", reasoning: "비빔밥은 언제 먹어도 맛있지!" },
      { menu: "돈까스", category: "japanese", reasoning: "돈까스 바삭하게 먹으러 가볼까?" },
      { menu: "제육볶음", category: "korean_rice", reasoning: "제육볶음에 밥 한 공기 어때?" },
    );
  }

  // Mood adjustments
  if (mood === "stressed" || mood === "very_tired") {
    ideas.unshift({
      menu: "삼겹살",
      category: "korean_meat",
      reasoning: getMoodReasoning(mood) + " 고기 구워먹자!",
    });
  }

  // Streak avoidance
  if (streak) {
    const filtered = ideas.filter((i) => i.category !== streak.category);
    if (filtered.length >= 2) {
      return filtered.slice(0, 3).map((idea) => ({
        id: crypto.randomUUID(),
        restaurantName: "",
        menuSuggestion: idea.menu,
        cuisineCategory: idea.category,
        reasoning: `${streak.count}일 연속 ${CUISINE_LABELS[streak.category]} 먹었으니~ ${idea.reasoning}`,
        confidence: "medium" as const,
      }));
    }
  }

  return ideas.slice(0, 3).map((idea) => ({
    id: crypto.randomUUID(),
    restaurantName: "",
    menuSuggestion: idea.menu,
    cuisineCategory: idea.category,
    reasoning: idea.reasoning,
    confidence: "medium" as const,
  }));
}

export function getRecommendations(
  weather: WeatherFeeling,
  mood: MoodLevel,
  timeConstraint: TimeConstraint
): Recommendation[] {
  const now = new Date();
  const weekAgo = subDays(now, 7);

  const allMeals = getMealLogs();
  const recentMeals = allMeals.filter((m) =>
    isWithinInterval(new Date(m.date), { start: weekAgo, end: now })
  );

  const restaurants = getRestaurants();

  return generateRecommendations({
    recentMeals,
    weather,
    mood,
    timeConstraint,
    restaurants,
  });
}
