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
