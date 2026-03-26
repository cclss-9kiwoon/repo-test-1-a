# MCP 실전 입문: TypeScript로 AI 도구 서버 만들기

이 저장소는 MCP (Model Context Protocol) 핸즈온 튜토리얼 강좌의 코드입니다.

## 프로젝트 구조

```
packages/
  todo-server/    - Todo Manager MCP 서버 (Tools 5, Resources 3, Prompts 3)
  weather-server/ - Weather API MCP 서버 (Tools 3, Resource 1, Prompt 1)
docs/
  architecture.md - MCP 아키텍처 개요 및 연동 가이드
```

## 사전 요구사항

- Node.js 18+
- TypeScript 기본 지식
- Claude Desktop (무료)

## 빠른 시작

```bash
# 1. 의존성 설치 & 빌드
cd packages/todo-server && npm install && npm run build
cd ../weather-server && npm install && npm run build

# 2. MCP Inspector로 테스트
cd packages/todo-server
npx @modelcontextprotocol/inspector node build/index.js

# 3. Claude Desktop 연동
# ~/Library/Application Support/Claude/claude_desktop_config.json 편집
# 자세한 방법은 docs/architecture.md 참조
```

## 강좌 커리큘럼

| 모듈 | 내용 | 소요시간 |
|------|------|----------|
| 0 | MCP 개괄 - 개념, 아키텍처, 3가지 Primitive | 15분 |
| 1 | 환경 설정 - 모노레포, TypeScript, SDK 설치 | 15분 |
| 2 | 첫 MCP 서버 - echo 도구, Inspector 테스트 | 30분 |
| 3 | Todo CRUD - 5개 도구, Zod 스키마, 인메모리 저장소 | 45분 |
| 4 | Resources & Prompts - MCP 3가지 Primitive 완성 | 30분 |
| 5 | Weather 서버 - Open-Meteo API, 외부 연동 패턴 | 45분 |
| 6 | Claude Desktop 연동 - 실전 사용, 트러블슈팅 | 30분 |
| 7 | 배포 & 다음 단계 - npm 배포, 확장 가이드 | 15분 |

## npm 배포 방법

만든 서버를 npm에 배포하면 누구나 `npx`로 사용할 수 있습니다:

```bash
# 1. package.json의 name을 고유하게 변경
# 예: "name": "@yourname/todo-mcp-server"

# 2. npm 로그인 & 배포
npm login
cd packages/todo-server
npm publish --access public

# 3. 배포 후 사용법 (Claude Desktop config)
# "command": "npx", "args": ["@yourname/todo-mcp-server"]
```

## 실제 서비스로 확장하려면

- **영구 저장**: 인메모리 → SQLite (`better-sqlite3`) 또는 JSON 파일
- **원격 배포**: stdio → Streamable HTTP transport
- **인증**: 멀티유저 시 OAuth 또는 API 키 인증 추가
- **에러 처리**: 입력 검증 강화, 재시도 로직, rate limiting

## MCP 생태계 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io)
- [MCP 스펙](https://spec.modelcontextprotocol.io)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [공식 MCP 서버 모음](https://github.com/modelcontextprotocol/servers)
