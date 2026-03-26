import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { todoStore } from "./store.js";

const server = new McpServer({
  name: "todo-mcp-server",
  version: "1.0.0",
});

// ============================================
// Tools (도구) - CRUD 작업
// ============================================

// 1. 할일 생성
server.tool(
  "create_todo",
  "새로운 할일을 생성합니다",
  {
    title: z.string().describe("할일 제목"),
    description: z.string().optional().describe("할일 상세 설명"),
  },
  async ({ title, description }) => {
    const todo = todoStore.create(title, description || "");
    return {
      content: [
        {
          type: "text",
          text: `할일이 생성되었습니다:\n${JSON.stringify(todo, null, 2)}`,
        },
      ],
    };
  }
);

// 2. 할일 목록 조회
server.tool(
  "list_todos",
  "모든 할일 목록을 조회합니다. 상태로 필터링할 수 있습니다.",
  {
    status: z
      .enum(["all", "completed", "pending"])
      .optional()
      .describe("필터: all(전체), completed(완료), pending(미완료)"),
  },
  async ({ status }) => {
    let todos;
    switch (status) {
      case "completed":
        todos = todoStore.listByStatus(true);
        break;
      case "pending":
        todos = todoStore.listByStatus(false);
        break;
      default:
        todos = todoStore.list();
    }

    if (todos.length === 0) {
      return {
        content: [{ type: "text", text: "할일이 없습니다." }],
      };
    }

    const formatted = todos
      .map(
        (t) =>
          `[${t.completed ? "v" : " "}] ${t.id}: ${t.title}${t.description ? ` - ${t.description}` : ""}`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `할일 목록 (${todos.length}개):\n${formatted}`,
        },
      ],
    };
  }
);

// 3. 할일 수정
server.tool(
  "update_todo",
  "기존 할일을 수정합니다",
  {
    id: z.string().describe("수정할 할일의 ID"),
    title: z.string().optional().describe("새로운 제목"),
    description: z.string().optional().describe("새로운 설명"),
    completed: z.boolean().optional().describe("완료 여부"),
  },
  async ({ id, title, description, completed }) => {
    const updated = todoStore.update(id, { title, description, completed });

    if (!updated) {
      return {
        content: [
          {
            type: "text",
            text: `ID '${id}'에 해당하는 할일을 찾을 수 없습니다.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `할일이 수정되었습니다:\n${JSON.stringify(updated, null, 2)}`,
        },
      ],
    };
  }
);

// 4. 할일 삭제
server.tool(
  "delete_todo",
  "할일을 삭제합니다",
  {
    id: z.string().describe("삭제할 할일의 ID"),
  },
  async ({ id }) => {
    const deleted = todoStore.delete(id);

    if (!deleted) {
      return {
        content: [
          {
            type: "text",
            text: `ID '${id}'에 해당하는 할일을 찾을 수 없습니다.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `할일 '${id}'가 삭제되었습니다.`,
        },
      ],
    };
  }
);

// 5. 할일 요약
server.tool(
  "get_todo_summary",
  "할일 현황 요약을 보여줍니다 (전체, 완료, 미완료 개수)",
  async () => {
    const summary = todoStore.getSummary();
    return {
      content: [
        {
          type: "text",
          text: `할일 현황:\n- 전체: ${summary.total}개\n- 완료: ${summary.completed}개\n- 미완료: ${summary.pending}개`,
        },
      ],
    };
  }
);

// ============================================
// Resources (리소스) - 읽기 전용 데이터
// ============================================

// 1. 정적 리소스: 전체 할일 목록 (JSON)
server.resource(
  "all-todos",
  "todo://list",
  { description: "전체 할일 목록을 JSON 형태로 제공합니다", mimeType: "application/json" },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(todoStore.list(), null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// 2. 정적 리소스: 할일 요약 통계
server.resource(
  "todo-summary",
  "todo://summary",
  { description: "할일 현황 요약 통계를 제공합니다", mimeType: "application/json" },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(todoStore.getSummary(), null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// 3. 동적 리소스: 개별 할일 조회 (URI 템플릿)
//    todo://item/todo-1, todo://item/todo-2 등으로 개별 접근
server.resource(
  "todo-by-id",
  new ResourceTemplate("todo://item/{id}", {
    list: async () => ({
      resources: todoStore.list().map((todo) => ({
        uri: `todo://item/${todo.id}`,
        name: todo.title,
        description: `할일: ${todo.title} (${todo.completed ? "완료" : "미완료"})`,
      })),
    }),
  }),
  { description: "ID로 개별 할일의 상세 정보를 조회합니다", mimeType: "application/json" },
  async (uri, { id }) => {
    const todo = todoStore.get(id as string);
    if (!todo) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: `ID '${id}'에 해당하는 할일이 없습니다.` }),
            mimeType: "application/json",
          },
        ],
      };
    }
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(todo, null, 2),
          mimeType: "application/json",
        },
      ],
    };
  }
);

// ============================================
// Prompts (프롬프트) - 재사용 가능한 대화 템플릿
// ============================================

// 1. 할일 정리 도우미: 현재 할일을 분석하고 우선순위 제안
server.prompt(
  "organize-todos",
  "현재 할일 목록을 분석하고 우선순위를 제안합니다",
  () => {
    const todos = todoStore.list();
    const todoText =
      todos.length > 0
        ? todos
            .map((t) => `- [${t.completed ? "v" : " "}] ${t.title}: ${t.description}`)
            .join("\n")
        : "(할일이 없습니다)";

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `다음은 현재 나의 할일 목록입니다:\n\n${todoText}\n\n이 할일들을 분석해서:\n1. 우선순위를 제안해주세요\n2. 비슷한 항목끼리 그룹으로 묶어주세요\n3. 예상 소요 시간을 추정해주세요`,
          },
        },
      ],
    };
  }
);

// 2. 목표 분해 프롬프트: 큰 목표를 작은 할일로 쪼개기 (인자 있음)
server.prompt(
  "create-todo-from-goal",
  "큰 목표를 작은 할일 단위로 분해합니다",
  { goal: z.string().describe("달성하고 싶은 큰 목표") },
  ({ goal }) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `나의 목표: "${goal}"\n\n이 목표를 달성하기 위한 구체적인 할일 목록을 만들어주세요. 각 항목은:\n- 30분 이내에 완료할 수 있는 크기\n- 명확한 완료 기준이 있을 것\n- 순서대로 진행 가능할 것\n\n할일 목록을 만든 후, create_todo 도구로 각각 생성해주세요.`,
        },
      },
    ],
  })
);

// 3. 주간 회고 프롬프트: 완료/미완료 할일 기반 회고
server.prompt(
  "weekly-review",
  "완료된 할일을 바탕으로 주간 회고를 진행합니다",
  () => {
    const completed = todoStore.listByStatus(true);
    const pending = todoStore.listByStatus(false);
    const summary = todoStore.getSummary();

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `주간 회고를 도와주세요.\n\n현황: 전체 ${summary.total}개 중 ${summary.completed}개 완료\n\n완료한 할일:\n${completed.map((t) => `- ${t.title}`).join("\n") || "(없음)"}\n\n미완료 할일:\n${pending.map((t) => `- ${t.title}`).join("\n") || "(없음)"}\n\n다음을 분석해주세요:\n1. 이번 주 잘한 점\n2. 개선할 점\n3. 다음 주 집중해야 할 것`,
          },
        },
      ],
    };
  }
);

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todo MCP Server가 시작되었습니다 (stdio)");
}

main().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exit(1);
});
