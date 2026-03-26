# Todo Manager MCP Server

할일을 관리하는 MCP 서버입니다. Tools, Resources, Prompts 3가지 Primitive를 모두 구현합니다.

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
    "todo-manager": {
      "command": "node",
      "args": ["/절대경로/packages/todo-server/build/index.js"]
    }
  }
}
```

설정 파일 위치:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## 사용 가능한 기능

### Tools (도구)
| 도구 | 설명 |
|------|------|
| `create_todo` | 새 할일 생성 |
| `list_todos` | 할일 목록 조회 (상태 필터 가능) |
| `update_todo` | 할일 수정 |
| `delete_todo` | 할일 삭제 |
| `get_todo_summary` | 할일 현황 요약 |

### Resources (리소스)
| URI | 설명 |
|-----|------|
| `todo://list` | 전체 할일 (JSON) |
| `todo://summary` | 현황 통계 |
| `todo://item/{id}` | 개별 할일 |

### Prompts (프롬프트)
| 프롬프트 | 설명 |
|----------|------|
| `organize-todos` | 할일 우선순위 정리 |
| `create-todo-from-goal` | 목표 -> 할일 분해 |
| `weekly-review` | 주간 회고 |
