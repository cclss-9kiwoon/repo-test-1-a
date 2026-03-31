import { WeatherFeeling, MoodLevel, TimeConstraint, CuisineCategory } from "@/types";

export const WEATHER_OPTIONS: { value: WeatherFeeling; emoji: string; label: string }[] = [
  { value: "sunny_warm", emoji: "☀️", label: "맑고 따뜻" },
  { value: "sunny_cold", emoji: "🌤️", label: "맑지만 추워" },
  { value: "cloudy", emoji: "☁️", label: "흐림" },
  { value: "rainy", emoji: "🌧️", label: "비 와" },
  { value: "snowy", emoji: "❄️", label: "눈 와" },
  { value: "humid_hot", emoji: "🥵", label: "덥고 습해" },
  { value: "windy", emoji: "💨", label: "바람 많이 불어" },
  { value: "perfect", emoji: "🌈", label: "완벽한 날씨!" },
];

export const MOOD_OPTIONS: { value: MoodLevel; emoji: string; label: string }[] = [
  { value: "very_tired", emoji: "😫", label: "완전 피곤" },
  { value: "tired", emoji: "😴", label: "좀 피곤" },
  { value: "neutral", emoji: "😐", label: "보통" },
  { value: "good", emoji: "😊", label: "좋아" },
  { value: "energetic", emoji: "💪", label: "에너지 넘쳐" },
  { value: "stressed", emoji: "😤", label: "스트레스" },
];

export const TIME_OPTIONS: { value: TimeConstraint; emoji: string; label: string }[] = [
  { value: "very_tight", emoji: "⏰", label: "빠듯해 (30분)" },
  { value: "normal", emoji: "🕐", label: "보통 (1시간)" },
  { value: "relaxed", emoji: "☕", label: "여유있어 (1시간+)" },
  { value: "no_rush", emoji: "🌿", label: "천천히 (상관없어)" },
];

export const CUISINE_LABELS: Record<CuisineCategory, string> = {
  korean_rice: "한식 밥류",
  korean_soup: "국/찌개/탕",
  korean_noodle: "면류",
  korean_meat: "고기",
  japanese: "일식",
  chinese: "중식",
  western: "양식",
  southeast_asian: "동남아",
  salad_light: "샐러드/가벼운",
  fast_food: "패스트푸드",
  cafe_bakery: "카페/베이커리",
  other: "기타",
};

export const WAIT_TIME_OPTIONS = [
  { label: "바로 나왔어", value: 0 },
  { label: "5~10분", value: 7 },
  { label: "10~20분", value: 15 },
  { label: "20분 넘게", value: 25 },
];

export const SATISFACTION_LABELS = ["", "별로...", "그저 그래", "괜찮았어", "맛있었어!", "최고!!"];
