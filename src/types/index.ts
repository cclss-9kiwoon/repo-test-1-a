export type WeatherFeeling =
  | "sunny_warm"
  | "sunny_cold"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "humid_hot"
  | "windy"
  | "perfect";

export type MoodLevel =
  | "very_tired"
  | "tired"
  | "neutral"
  | "good"
  | "energetic"
  | "stressed";

export type TimeConstraint =
  | "very_tight"
  | "normal"
  | "relaxed"
  | "no_rush";

export type CuisineCategory =
  | "korean_rice"
  | "korean_soup"
  | "korean_noodle"
  | "korean_meat"
  | "japanese"
  | "chinese"
  | "western"
  | "southeast_asian"
  | "salad_light"
  | "fast_food"
  | "cafe_bakery"
  | "other";

export type SatisfactionLevel = 1 | 2 | 3 | 4 | 5;

export interface MealLog {
  id: string;
  date: string;
  weatherFeeling: WeatherFeeling;
  mood: MoodLevel;
  timeConstraint: TimeConstraint;
  restaurantId?: string;
  restaurantName: string;
  menuItem: string;
  cuisineCategory: CuisineCategory;
  price?: number;
  satisfaction: SatisfactionLevel;
  waitTimeMinutes?: number;
  totalTimeMinutes?: number;
  wouldReturn: boolean;
  isStillOpen?: boolean;
  notes?: string;
  aiSummary?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: CuisineCategory;
  address?: string;
  distanceMinutes?: number;
  priceRange?: "budget" | "moderate" | "premium";
  hours?: string;
  menuHighlights?: string[];
  nearbySpots?: NearbySpot[];
  userVisitCount: number;
  averageSatisfaction: number;
  lastVisited?: string;
  notes?: string;
  createdAt: string;
}

export interface NearbySpot {
  name: string;
  type: "cafe" | "dessert" | "convenience_store" | "park" | "other";
  description?: string;
}

export interface UserPreferences {
  defaultLocation?: string;
  lunchWindowStart: string;
  lunchWindowEnd: string;
  maxWalkMinutes: number;
  dietaryRestrictions?: string[];
  favoriteCuisines?: CuisineCategory[];
  dislikedCuisines?: CuisineCategory[];
  budgetPreference?: "budget" | "moderate" | "premium" | "any";
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  quickReplies?: string[];
  inputType?: "text" | "mood" | "weather" | "rating" | "choice" | "yesno";
}

export type ConversationStep =
  | "greeting"
  | "weather"
  | "mood"
  | "time_constraint"
  | "what_ate"
  | "restaurant_name"
  | "satisfaction"
  | "wait_time"
  | "would_return"
  | "notes"
  | "summary"
  | "complete";

export interface ConversationState {
  step: ConversationStep;
  messages: ChatMessage[];
  collectedData: Partial<MealLog>;
  isComplete: boolean;
}

export interface Recommendation {
  id: string;
  restaurantName: string;
  restaurantId?: string;
  menuSuggestion?: string;
  reasoning: string;
  cuisineCategory: CuisineCategory;
  estimatedTimeMinutes?: number;
  confidence: "high" | "medium" | "low";
  complementaryTip?: string;
}
