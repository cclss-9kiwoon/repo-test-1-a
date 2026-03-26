import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchCity, getWeather } from "./api.js";
import { WEATHER_CODES } from "./types.js";

const server = new McpServer({
  name: "weather-mcp-server",
  version: "1.0.0",
});

// ============================================
// Tools (도구)
// ============================================

// 1. 도시 검색
server.tool(
  "search_city",
  "도시 이름으로 위치를 검색합니다 (좌표, 국가, 시간대 정보 반환)",
  {
    name: z.string().describe("검색할 도시 이름 (예: 서울, Tokyo, New York)"),
    count: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .describe("검색 결과 수 (기본값: 5)"),
  },
  async ({ name, count }) => {
    try {
      const data = await searchCity(name, count || 5);

      if (!data.results || data.results.length === 0) {
        return {
          content: [
            { type: "text", text: `'${name}'에 대한 검색 결과가 없습니다.` },
          ],
        };
      }

      const formatted = data.results
        .map(
          (r, i) =>
            `${i + 1}. ${r.name}, ${r.admin1 || ""} ${r.country} (${r.country_code})\n   위도: ${r.latitude}, 경도: ${r.longitude}\n   시간대: ${r.timezone}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `'${name}' 검색 결과:\n\n${formatted}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `도시 검색 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 2. 현재 날씨 조회
server.tool(
  "get_current_weather",
  "좌표(위도, 경도)로 현재 날씨를 조회합니다",
  {
    latitude: z.number().min(-90).max(90).describe("위도"),
    longitude: z.number().min(-180).max(180).describe("경도"),
  },
  async ({ latitude, longitude }) => {
    try {
      const data = await getWeather(latitude, longitude);
      const current = data.current;
      const units = data.current_units;
      const weatherDesc =
        WEATHER_CODES[current.weather_code] ||
        `알 수 없음 (코드: ${current.weather_code})`;

      const text = [
        `위치: ${data.latitude}, ${data.longitude}`,
        `시간: ${current.time}`,
        `기온: ${current.temperature_2m}${units.temperature_2m}`,
        `체감온도: ${current.apparent_temperature}${units.apparent_temperature}`,
        `습도: ${current.relative_humidity_2m}${units.relative_humidity_2m}`,
        `바람: ${current.wind_speed_10m}${units.wind_speed_10m} (${current.wind_direction_10m} 방향)`,
        `날씨: ${weatherDesc}`,
      ].join("\n");

      return {
        content: [{ type: "text", text }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `날씨 조회 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 3. 7일 예보 조회
server.tool(
  "get_forecast",
  "좌표(위도, 경도)로 7일간의 날씨 예보를 조회합니다",
  {
    latitude: z.number().min(-90).max(90).describe("위도"),
    longitude: z.number().min(-180).max(180).describe("경도"),
  },
  async ({ latitude, longitude }) => {
    try {
      const data = await getWeather(latitude, longitude);
      const daily = data.daily;

      const forecast = daily.time
        .map((date, i) => {
          const weatherDesc =
            WEATHER_CODES[daily.weather_code[i]] || "알 수 없음";
          return `${date}: ${weatherDesc}\n   ${daily.temperature_2m_min[i]}C ~ ${daily.temperature_2m_max[i]}C | 강수확률: ${daily.precipitation_probability_max[i]}%`;
        })
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `${data.latitude}, ${data.longitude} 7일 예보:\n\n${forecast}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `예보 조회 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// ============================================
// Resources (리소스)
// ============================================

// 지원하는 날씨 코드 목록
server.resource(
  "weather-codes",
  "weather://codes",
  {
    description: "WMO 날씨 코드와 한국어 설명 목록",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(WEATHER_CODES, null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// ============================================
// Prompts (프롬프트)
// ============================================

// 여행 날씨 체크 프롬프트
server.prompt(
  "travel-weather-check",
  "여행 계획에 맞는 날씨 정보를 분석합니다",
  {
    destination: z.string().describe("여행 목적지 (도시 이름)"),
    activity: z
      .string()
      .optional()
      .describe("계획한 활동 (예: 등산, 해수욕, 관광)"),
  },
  ({ destination, activity }) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `여행 날씨 분석을 도와주세요.\n\n목적지: ${destination}${activity ? `\n계획한 활동: ${activity}` : ""}\n\n다음을 수행해주세요:\n1. search_city 도구로 '${destination}'을 검색하세요\n2. get_forecast 도구로 7일 예보를 확인하세요\n3. 날씨를 분석하여 다음을 알려주세요:\n   - 여행에 적합한 날\n   - 준비물 추천 (우산, 선크림 등)\n   ${activity ? `- '${activity}' 활동에 적합한지 평가` : ""}`,
        },
      },
    ],
  })
);

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server가 시작되었습니다 (stdio)");
}

main().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exit(1);
});
