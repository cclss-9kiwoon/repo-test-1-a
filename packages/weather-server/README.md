# Weather MCP Server

Open-Meteo API를 연동한 날씨 MCP 서버입니다. 무료 API로 API 키가 필요 없습니다.

## 빌드

```bash
npm install
npm run build
```

## MCP Inspector로 테스트

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Claude Desktop 설정

`claude_desktop_config.json`에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/절대경로/packages/weather-server/build/index.js"]
    }
  }
}
```

## 사용 가능한 기능

### Tools (도구)
| 도구 | 설명 |
|------|------|
| `search_city` | 도시 이름으로 좌표 검색 |
| `get_current_weather` | 좌표로 현재 날씨 조회 |
| `get_forecast` | 좌표로 7일 예보 조회 |

### Resources (리소스)
| URI | 설명 |
|-----|------|
| `weather://codes` | WMO 날씨 코드 한국어 매핑 |

### Prompts (프롬프트)
| 프롬프트 | 설명 |
|----------|------|
| `travel-weather-check` | 여행지 날씨 분석 |
