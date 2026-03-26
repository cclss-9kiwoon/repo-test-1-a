import { GeocodingResponse, WeatherResponse } from "./types.js";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_BASE = "https://api.open-meteo.com/v1";

// 도시 이름으로 좌표 검색
export async function searchCity(
  name: string,
  count: number = 5
): Promise<GeocodingResponse> {
  const url = `${GEOCODING_BASE}/search?name=${encodeURIComponent(name)}&count=${count}&language=ko&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding API 오류: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<GeocodingResponse>;
}

// 좌표로 현재 날씨 + 7일 예보 조회
export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });

  const url = `${WEATHER_BASE}/forecast?${params}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API 오류: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<WeatherResponse>;
}
