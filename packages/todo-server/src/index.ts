import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. 서버 인스턴스 생성
const server = new McpServer({
  name: "todo-mcp-server",
  version: "1.0.0",
});

// 2. 첫 번째 도구: echo
// 입력받은 메시지를 그대로 돌려주는 간단한 테스트용 도구
server.tool(
  "echo",
  "입력받은 메시지를 그대로 돌려줍니다 (테스트용)",
  {
    message: z.string().describe("되돌려 받을 메시지"),
  },
  async ({ message }) => ({
    content: [
      {
        type: "text",
        text: `에코: ${message}`,
      },
    ],
  })
);

// 3. 서버 시작
// 중요: console.log()가 아닌 console.error()를 사용!
// stdout은 MCP 프로토콜 통신에 사용되므로 절대 오염시키면 안 됩니다.
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todo MCP Server가 시작되었습니다 (stdio)");
}

main().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exit(1);
});
