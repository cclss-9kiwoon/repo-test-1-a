import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
