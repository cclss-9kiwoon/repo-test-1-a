import { MealLog, Restaurant, UserPreferences } from "@/types";

const KEYS = {
  meals: "lunch-buddy-meals",
  restaurants: "lunch-buddy-restaurants",
  preferences: "lunch-buddy-preferences",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getMealLogs(): MealLog[] {
  return getItem<MealLog[]>(KEYS.meals, []);
}

export function saveMealLog(meal: MealLog): void {
  const meals = getMealLogs();
  const existing = meals.findIndex((m) => m.id === meal.id);
  if (existing >= 0) {
    meals[existing] = meal;
  } else {
    meals.unshift(meal);
  }
  setItem(KEYS.meals, meals);
}

export function getRestaurants(): Restaurant[] {
  return getItem<Restaurant[]>(KEYS.restaurants, []);
}

export function saveRestaurant(restaurant: Restaurant): void {
  const restaurants = getRestaurants();
  const existing = restaurants.findIndex((r) => r.id === restaurant.id);
  if (existing >= 0) {
    restaurants[existing] = restaurant;
  } else {
    restaurants.push(restaurant);
  }
  setItem(KEYS.restaurants, restaurants);
}

export function findOrCreateRestaurant(
  name: string,
  category: MealLog["cuisineCategory"],
  satisfaction: number
): Restaurant {
  const restaurants = getRestaurants();
  const found = restaurants.find(
    (r) => r.name.toLowerCase() === name.toLowerCase()
  );

  if (found) {
    found.userVisitCount += 1;
    found.averageSatisfaction =
      (found.averageSatisfaction * (found.userVisitCount - 1) + satisfaction) /
      found.userVisitCount;
    found.lastVisited = new Date().toISOString();
    saveRestaurant(found);
    return found;
  }

  const newRestaurant: Restaurant = {
    id: crypto.randomUUID(),
    name,
    category,
    userVisitCount: 1,
    averageSatisfaction: satisfaction,
    lastVisited: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  saveRestaurant(newRestaurant);
  return newRestaurant;
}

export function getUserPreferences(): UserPreferences {
  return getItem<UserPreferences>(KEYS.preferences, {
    lunchWindowStart: "11:30",
    lunchWindowEnd: "13:30",
    maxWalkMinutes: 15,
    budgetPreference: "any",
  });
}

export function saveUserPreferences(prefs: UserPreferences): void {
  setItem(KEYS.preferences, prefs);
}
