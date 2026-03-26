// Open-Meteo Geocoding API 응답 타입
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  timezone: string;
  admin1?: string; // 시/도
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

// Open-Meteo Weather API 응답 타입
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    wind_speed_10m: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
}

// WMO 날씨 코드 -> 한국어 설명 매핑
export const WEATHER_CODES: Record<number, string> = {
  0: "맑음",
  1: "대체로 맑음",
  2: "약간 흐림",
  3: "흐림",
  45: "안개",
  48: "짙은 안개",
  51: "이슬비",
  53: "이슬비",
  55: "강한 이슬비",
  61: "약한 비",
  63: "비",
  65: "강한 비",
  71: "약한 눈",
  73: "눈",
  75: "강한 눈",
  77: "싸락눈",
  80: "소나기",
  81: "소나기",
  82: "강한 소나기",
  85: "눈 소나기",
  86: "강한 눈 소나기",
  95: "뇌우",
  96: "우박 동반 뇌우",
  99: "강한 우박 동반 뇌우",
};
