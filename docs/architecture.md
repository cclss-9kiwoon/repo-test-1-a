# MCP (Model Context Protocol) 아키텍처 개요

## MCP란?

MCP(Model Context Protocol)는 Anthropic이 만든 **AI-도구 연동 오픈 표준**입니다.
LLM이 외부 도구, 데이터, 서비스와 표준화된 방식으로 소통할 수 있게 해줍니다.

## 아키텍처

```
┌─────────────────────────────────────────────┐
│  Host (호스트)                                │
│  예: Claude Desktop, IDE, 브라우저 확장       │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Client A │  │ Client B │  │ Client C │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼──────────────┼──────────────┼────────┘
        │              │              │
   JSON-RPC 2.0   JSON-RPC 2.0  JSON-RPC 2.0
   (stdio)        (stdio)       (HTTP)
        │              │              │
  ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
  │ Server A  │ │ Server B  │ │ Server C  │
  │ (Todo)    │ │ (Weather) │ │ (GitHub)  │
  └───────────┘ └───────────┘ └───────────┘
```

- **Host**: 사용자가 직접 쓰는 앱 (Claude Desktop 등). 여러 Client를 관리.
- **Client**: Host 안에서 Server 하나와 1:1 연결을 유지하는 컴포넌트.
- **Server**: 도구/데이터/템플릿을 제공하는 프로그램. (우리가 만들 것!)

통신: **JSON-RPC 2.0** 프로토콜
전송 방식: **stdio** (로컬) 또는 **Streamable HTTP** (원격)

## 3가지 Primitive

### 1. Tools (도구) - "이거 실행해줘"
- 함수 호출. AI가 판단해서 호출.
- 부수 효과 있음: 파일 생성, DB 수정, API 호출 등.
- 예: `create_todo("TypeScript 공부")`, `get_weather("서울")`

### 2. Resources (리소스) - "이 데이터 읽어줘"
- 읽기 전용 데이터. URI로 식별.
- 예: `todo://list` → 전체 할일 목록 JSON

### 3. Prompts (프롬프트) - "이렇게 대화 시작해"
- 재사용 가능한 대화 템플릿.
- 예: "할일 정리해줘" → 현재 할일 포함한 분석 요청 자동 생성

## 비교표

| | Tools | Resources | Prompts |
|---|---|---|---|
| 하는 일 | 함수 실행 | 데이터 제공 | 대화 템플릿 |
| 호출자 | AI가 판단 | 앱이 요청 | 사용자가 선택 |
| 부수효과 | 있음 | 없음 | 없음 |

## 이 강좌에서 만드는 것

1. **Todo Manager MCP 서버** - Tools 5개, Resources 3개, Prompts 3개
2. **Weather MCP 서버** - Open-Meteo API 연동 (무료, API 키 불필요)
3. **Claude Desktop 연동** - 실제 AI와 대화하며 도구 사용

## Claude Desktop 연동 방법

### 1. 빌드

두 서버 모두 빌드해야 합니다:

```bash
cd packages/todo-server && npm run build
cd packages/weather-server && npm run build
```

### 2. 설정 파일 편집

설정 파일 위치:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

아래 내용을 작성하세요 (경로는 본인의 절대 경로로 변경):

```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/절대경로/packages/todo-server/build/index.js"]
    },
    "weather": {
      "command": "node",
      "args": ["/절대경로/packages/weather-server/build/index.js"]
    }
  }
}
```

### 3. Claude Desktop 재시작

설정 저장 후 Claude Desktop을 **완전히 종료 후 다시 시작**하세요.
입력창 좌측에 망치 아이콘이 보이면 MCP 서버가 연결된 것입니다.

### 4. 사용 시나리오

**시나리오 A: 할일 관리**
> "오늘 해야 할 일 정리해줘: TypeScript 공부, 점심 약속, 운동"
> → Claude가 `create_todo`를 3번 호출

**시나리오 B: 날씨 조회**
> "서울 날씨 어때?"
> → Claude가 `search_city("서울")` → `get_current_weather(37.57, 126.98)` 순서로 호출

**시나리오 C: 두 서버 조합**
> "서울 날씨 보고, 날씨에 맞는 할일 만들어줘"
> → Weather 서버로 날씨 확인 후, Todo 서버로 할일 생성

## 트러블슈팅

### 서버가 연결되지 않을 때

1. **경로 확인**: `args`의 경로가 **절대 경로**인지 확인. 상대 경로는 동작하지 않습니다.
2. **빌드 확인**: `build/index.js` 파일이 존재하는지 확인. `npm run build`를 먼저 실행하세요.
3. **로그 확인** (macOS): `~/Library/Logs/Claude/mcp*.log` 파일에서 에러를 확인하세요.
4. **재시작**: Claude Desktop을 완전히 종료 후 다시 시작하세요.

### console.log 문제

서버 코드에서 `console.log()`를 사용하면 stdout이 오염되어 JSON-RPC 통신이 깨집니다.
반드시 `console.error()`만 사용하세요.

### 도구가 목록에 안 보일 때

- 입력창 좌측 망치 아이콘 클릭 → 등록된 도구 목록 확인
- 서버 이름이 `claude_desktop_config.json`의 키와 일치하는지 확인
- MCP Inspector로 먼저 테스트하여 서버 자체가 정상인지 확인
