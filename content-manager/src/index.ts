import { input, select } from "@inquirer/prompts";
import {
  generateDraft,
  regenerateContent,
  regenerateImageOnly,
} from "./agents/manager.js";
import { publishToNotion } from "./publishers/notion.js";
import type { UserInput, ContentDraft, ReviewAction } from "./types.js";

async function main() {
  console.log("\n========================================");
  console.log("  AI Content Manager (Notion Publisher)");
  console.log("========================================\n");

  // 1. 사용자 입력 수집
  const userInput = await collectInput();

  // 2. 초안 생성
  let draft = await generateWithSpinner(userInput);

  // 3. 리뷰 루프
  while (true) {
    showPreview(draft);

    const action = await select<ReviewAction>({
      message: "어떻게 하시겠습니까?",
      choices: [
        { name: "승인 → Notion에 업로드", value: "approve" as const },
        { name: "글 수정 요청", value: "edit_content" as const },
        { name: "이미지 재생성", value: "regenerate_image" as const },
        { name: "전체 재생성", value: "regenerate_all" as const },
        { name: "취소", value: "cancel" as const },
      ],
    });

    if (action === "approve") {
      console.log("\nNotion에 업로드 중...");
      try {
        const result = await publishToNotion(draft);
        console.log("\n업로드 완료!");
        console.log(`Notion 페이지: ${result.url}\n`);
      } catch (err) {
        console.error("\n업로드 실패:", err instanceof Error ? err.message : err);
      }
      break;
    }

    if (action === "edit_content") {
      const feedback = await input({
        message: "수정 요청 사항을 입력하세요:",
      });
      console.log("\n글을 수정 중...");
      draft = await regenerateContent(userInput, feedback, draft);
      continue;
    }

    if (action === "regenerate_image") {
      console.log("\n이미지를 재생성 중...");
      draft = await regenerateImageOnly(draft);
      continue;
    }

    if (action === "regenerate_all") {
      console.log("\n전체를 재생성 중...");
      draft = await generateWithSpinner(userInput);
      continue;
    }

    if (action === "cancel") {
      console.log("\n취소되었습니다.\n");
      break;
    }
  }
}

async function collectInput(): Promise<UserInput> {
  const topic = await input({
    message: "주제를 입력하세요 (오늘 느낀점, 키워드 등):",
    validate: (v) => (v.trim() ? true : "주제를 입력해주세요."),
  });

  const feelings = await input({
    message: "오늘 느낀점이 있나요? (선택, 엔터로 스킵):",
  });

  const keywordsRaw = await input({
    message: "추가 키워드 (콤마로 구분, 선택, 엔터로 스킵):",
  });

  const keywords = keywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    topic: topic.trim(),
    feelings: feelings.trim() || undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
  };
}

async function generateWithSpinner(
  userInput: UserInput
): Promise<ContentDraft> {
  console.log("\nAI가 블로그 글과 이미지를 생성 중입니다...");
  console.log("(글 작성 + 이미지 생성이 병렬로 진행됩니다)\n");

  const draft = await generateDraft(userInput);
  console.log("생성 완료!\n");
  return draft;
}

function showPreview(draft: ContentDraft) {
  console.log("\n────────────────────────────────────────");
  console.log(`제목: ${draft.content.title}`);
  console.log("────────────────────────────────────────");

  // 본문 미리보기 (처음 500자)
  const bodyPreview =
    draft.content.body.length > 500
      ? draft.content.body.slice(0, 500) + "\n... (생략)"
      : draft.content.body;
  console.log(bodyPreview);

  console.log("\n────────────────────────────────────────");
  console.log(`요약: ${draft.content.summary}`);
  console.log(
    `태그: ${draft.content.hashtags.map((t) => `#${t}`).join(" ")}`
  );
  console.log(`이미지: ${draft.image.url}`);
  console.log("────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("\n오류가 발생했습니다:", err);
  process.exit(1);
});
