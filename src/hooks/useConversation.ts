"use client";

import { useState, useCallback } from "react";
import {
  ChatMessage,
  ConversationState,
  ConversationStep,
  MealLog,
  WeatherFeeling,
  MoodLevel,
  TimeConstraint,
  SatisfactionLevel,
  CuisineCategory,
} from "@/types";
import { saveMealLog, findOrCreateRestaurant } from "@/lib/storage";
import { CUISINE_LABELS, WAIT_TIME_OPTIONS } from "@/lib/constants";

function makeMsg(
  role: "assistant" | "user",
  content: string,
  extra?: Partial<ChatMessage>
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

function getMoodReaction(mood: MoodLevel): string {
  const reactions: Record<MoodLevel, string> = {
    very_tired: "피곤한 날이구나 😢",
    tired: "좀 노곤한 하루구나~",
    neutral: "보통 컨디션이구나!",
    good: "오 좋은 컨디션이네! 😊",
    energetic: "에너지 넘치는 날이네! 💪",
    stressed: "스트레스 받는 날이구나 😮‍💨",
  };
  return reactions[mood];
}

function getSatisfactionReaction(level: number): string {
  if (level >= 4) return "오 맛있었구나! 😋";
  if (level === 3) return "괜찮았구나~";
  return "아 아쉽다 😅";
}

function guessCuisineCategory(menuItem: string): CuisineCategory {
  const lower = menuItem.toLowerCase();
  const mappings: [string[], CuisineCategory][] = [
    [["국밥", "순대국", "설렁탕", "곰탕", "갈비탕", "찌개", "된장", "김치찌개", "부대찌개", "탕", "알탕", "동태탕", "해장국", "육개장", "삼계탕", "감자탕"], "korean_soup"],
    [["면", "국수", "라면", "라멘", "냉면", "쌀국수", "파스타", "우동", "소바", "짬뽕", "칼국수", "잔치국수", "비빔면"], "korean_noodle"],
    [["삼겹살", "갈비", "불고기", "고기", "스테이크", "소고기", "돼지", "치킨", "닭갈비", "족발", "보쌈"], "korean_meat"],
    [["초밥", "스시", "사시미", "회", "돈카츠", "돈까스", "카츠", "규동", "덮밥"], "japanese"],
    [["짜장", "짬뽕", "탕수육", "중국", "마라", "마라탕", "볶음밥", "잡채밥"], "chinese"],
    [["피자", "버거", "햄버거", "샌드위치", "리조또", "스테이크", "오므라이스"], "western"],
    [["쌀국수", "팟타이", "똠얌", "월남쌈", "반미", "커리", "카레", "태국", "베트남"], "southeast_asian"],
    [["샐러드", "포케", "그릭", "랩"], "salad_light"],
    [["맥도날드", "버거킹", "롯데리아", "KFC", "서브웨이"], "fast_food"],
    [["커피", "빵", "케이크", "베이커리", "카페", "토스트", "와플", "크로플"], "cafe_bakery"],
    [["김밥", "비빔밥", "제육", "볶음", "정식", "백반", "한정식", "밥"], "korean_rice"],
  ];

  for (const [keywords, category] of mappings) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "other";
}

const STEP_CONFIG: Record<
  ConversationStep,
  {
    getMessage: (data: Partial<MealLog>) => string;
    inputType: ChatMessage["inputType"];
    quickReplies?: string[];
    nextStep: ConversationStep;
  }
> = {
  greeting: {
    getMessage: () => "안녕! 오늘 점심 어땠어? 기록해볼까? 🍚",
    inputType: "choice",
    quickReplies: ["응 기록할래!", "뭐 먹었는지 바로 말할게"],
    nextStep: "weather",
  },
  weather: {
    getMessage: () => "좋아! 오늘 밖에 날씨 어때?",
    inputType: "weather",
    nextStep: "mood",
  },
  mood: {
    getMessage: () => "오늘 컨디션은 어때?",
    inputType: "mood",
    nextStep: "time_constraint",
  },
  time_constraint: {
    getMessage: (data) => {
      const reaction = data.mood ? getMoodReaction(data.mood) : "";
      return `${reaction} 시간은 좀 있었어?`;
    },
    inputType: "choice",
    quickReplies: ["⏰ 빠듯했어", "🕐 보통이었어", "☕ 여유있었어", "🌿 천천히 먹었어"],
    nextStep: "what_ate",
  },
  what_ate: {
    getMessage: () => "그래서 뭐 먹었어? 메뉴랑 식당 이름 알려줘!",
    inputType: "text",
    nextStep: "restaurant_name",
  },
  restaurant_name: {
    getMessage: (data) => {
      const menu = data.menuItem || "맛있는 거";
      return `오 ${menu}! 어디서 먹었어?`;
    },
    inputType: "text",
    nextStep: "satisfaction",
  },
  satisfaction: {
    getMessage: () => "맛있었어? 점수 줘봐! ⭐",
    inputType: "rating",
    nextStep: "wait_time",
  },
  wait_time: {
    getMessage: (data) => {
      const reaction = getSatisfactionReaction(data.satisfaction || 3);
      return `${reaction} 오래 기다렸어?`;
    },
    inputType: "choice",
    quickReplies: WAIT_TIME_OPTIONS.map((o) => o.label),
    nextStep: "would_return",
  },
  would_return: {
    getMessage: () => "다음에 또 갈 것 같아?",
    inputType: "yesno",
    quickReplies: ["응 또 갈래!", "글쎄...", "안 갈 듯"],
    nextStep: "notes",
  },
  notes: {
    getMessage: () => "다른 특이사항 있어? 없으면 넘어가도 돼!",
    inputType: "text",
    quickReplies: ["없어 됐어!"],
    nextStep: "summary",
  },
  summary: {
    getMessage: (data) => {
      const cat = data.cuisineCategory ? CUISINE_LABELS[data.cuisineCategory] : "";
      const stars = data.satisfaction ? "★".repeat(data.satisfaction) : "";
      return `오늘 점심 기록 완료! 📝\n\n🍽️ ${data.menuItem} @ ${data.restaurantName}\n📂 ${cat}\n⭐ ${stars}\n${data.wouldReturn ? "👍 다음에 또 갈 곳!" : "🤔 다음엔 다른 데 가볼까"}\n\n고마워! 이 기록 잘 기억해둘게 😊`;
    },
    inputType: "choice",
    quickReplies: ["고마워!"],
    nextStep: "complete",
  },
  complete: {
    getMessage: () => "",
    inputType: "text",
    nextStep: "complete",
  },
};

export function useConversation() {
  const [state, setState] = useState<ConversationState>(() => {
    const initialMsg = makeMsg("assistant", STEP_CONFIG.greeting.getMessage({}), {
      quickReplies: STEP_CONFIG.greeting.quickReplies,
      inputType: STEP_CONFIG.greeting.inputType,
    });
    return {
      step: "greeting" as ConversationStep,
      messages: [initialMsg],
      collectedData: {},
      isComplete: false,
    };
  });

  const processUserInput = useCallback(
    (input: string) => {
      setState((prev) => {
        const newMessages = [...prev.messages];
        const newData = { ...prev.collectedData };

        // Add user message
        newMessages.push(makeMsg("user", input));

        const currentStep = prev.step;
        let nextStep = STEP_CONFIG[currentStep].nextStep;

        // Extract data based on current step
        switch (currentStep) {
          case "greeting":
            break;

          case "weather": {
            // The input comes as "emoji label", we map it
            const weatherMap: Record<string, WeatherFeeling> = {
              "맑고 따뜻": "sunny_warm",
              "맑지만 추워": "sunny_cold",
              "흐림": "cloudy",
              "비 와": "rainy",
              "눈 와": "snowy",
              "덥고 습해": "humid_hot",
              "바람 많이 불어": "windy",
              "완벽한 날씨!": "perfect",
            };
            const clean = input.replace(/^[\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D]+\s*/u, "").trim();
            newData.weatherFeeling = weatherMap[clean] || "cloudy";
            break;
          }

          case "mood": {
            const moodMap: Record<string, MoodLevel> = {
              "완전 피곤": "very_tired",
              "좀 피곤": "tired",
              "보통": "neutral",
              "좋아": "good",
              "에너지 넘쳐": "energetic",
              "스트레스": "stressed",
            };
            const clean = input.replace(/^[\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D]+\s*/u, "").trim();
            newData.mood = moodMap[clean] || "neutral";
            break;
          }

          case "time_constraint": {
            const timeMap: Record<string, TimeConstraint> = {
              "빠듯했어": "very_tight",
              "보통이었어": "normal",
              "여유있었어": "relaxed",
              "천천히 먹었어": "no_rush",
            };
            const clean = input.replace(/^[\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D]+\s*/u, "").trim();
            newData.timeConstraint = timeMap[clean] || "normal";
            break;
          }

          case "what_ate": {
            // Try to extract both menu and restaurant from input
            // e.g., "김밥천국에서 참치김밥" or just "참치김밥"
            const atMatch = input.match(/(.+?)에서\s+(.+)/);
            if (atMatch) {
              newData.restaurantName = atMatch[1].trim();
              newData.menuItem = atMatch[2].trim();
              newData.cuisineCategory = guessCuisineCategory(newData.menuItem);
              nextStep = "satisfaction"; // skip restaurant_name
            } else {
              newData.menuItem = input.trim();
              newData.cuisineCategory = guessCuisineCategory(input);
            }
            break;
          }

          case "restaurant_name":
            newData.restaurantName = input.trim();
            break;

          case "satisfaction": {
            const starMatch = input.match(/★/g);
            if (starMatch) {
              newData.satisfaction = Math.min(5, Math.max(1, starMatch.length)) as SatisfactionLevel;
            } else {
              const num = parseInt(input);
              newData.satisfaction = (num >= 1 && num <= 5 ? num : 3) as SatisfactionLevel;
            }
            break;
          }

          case "wait_time": {
            const waitMap: Record<string, number> = {};
            WAIT_TIME_OPTIONS.forEach((o) => (waitMap[o.label] = o.value));
            newData.waitTimeMinutes = waitMap[input] ?? 10;
            break;
          }

          case "would_return":
            newData.wouldReturn = input.includes("응") || input.includes("갈래");
            break;

          case "notes":
            if (!input.includes("없어") && !input.includes("됐어")) {
              newData.notes = input;
            }
            break;

          case "summary": {
            // Save the meal
            const meal: MealLog = {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              weatherFeeling: newData.weatherFeeling || "cloudy",
              mood: newData.mood || "neutral",
              timeConstraint: newData.timeConstraint || "normal",
              restaurantName: newData.restaurantName || "알 수 없음",
              menuItem: newData.menuItem || "알 수 없음",
              cuisineCategory: newData.cuisineCategory || "other",
              satisfaction: newData.satisfaction || (3 as SatisfactionLevel),
              waitTimeMinutes: newData.waitTimeMinutes,
              wouldReturn: newData.wouldReturn ?? true,
              notes: newData.notes,
              createdAt: new Date().toISOString(),
            };
            saveMealLog(meal);
            findOrCreateRestaurant(
              meal.restaurantName,
              meal.cuisineCategory,
              meal.satisfaction
            );
            return {
              ...prev,
              messages: newMessages,
              collectedData: newData,
              step: "complete" as ConversationStep,
              isComplete: true,
            };
          }
        }

        // Add AI response for next step
        if (nextStep !== "complete") {
          const config = STEP_CONFIG[nextStep];
          const aiMsg = makeMsg("assistant", config.getMessage(newData), {
            quickReplies: config.quickReplies,
            inputType: config.inputType,
          });
          newMessages.push(aiMsg);
        }

        return {
          ...prev,
          messages: newMessages,
          collectedData: newData,
          step: nextStep,
          isComplete: nextStep === "complete",
        };
      });
    },
    []
  );

  return { state, processUserInput };
}
