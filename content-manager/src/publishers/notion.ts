import { Client } from "@notionhq/client";
import { config } from "../config.js";
import type { ContentDraft, PublishResult } from "../types.js";
import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints.js";

const notion = new Client({ auth: config.notionApiKey });

export async function publishToNotion(
  draft: ContentDraft
): Promise<PublishResult> {
  const children = buildNotionBlocks(draft);

  const response = await notion.pages.create({
    parent: { page_id: config.notionParentPageId },
    properties: {
      title: {
        title: [{ text: { content: draft.content.title } }],
      },
    },
    children,
  });

  const url =
    "url" in response ? (response.url as string) : "https://notion.so";

  return {
    platform: "notion",
    url,
    success: true,
  };
}

function buildNotionBlocks(draft: ContentDraft): BlockObjectRequest[] {
  const blocks: BlockObjectRequest[] = [];

  // 대표 이미지
  blocks.push({
    object: "block",
    type: "image",
    image: {
      type: "external",
      external: { url: draft.image.url },
    },
  });

  // 구분선
  blocks.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  // 본문 (마크다운 → Notion 블록)
  const bodyBlocks = markdownToNotionBlocks(draft.content.body);
  blocks.push(...bodyBlocks);

  // 구분선
  blocks.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  // 해시태그
  if (draft.content.hashtags.length > 0) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: draft.content.hashtags.map((t) => `#${t}`).join("  "),
            },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: "gray",
            },
          },
        ],
      },
    });
  }

  return blocks;
}

function markdownToNotionBlocks(markdown: string): BlockObjectRequest[] {
  const lines = markdown.split("\n");
  const blocks: BlockObjectRequest[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 빈 줄 스킵
    if (line.trim() === "") continue;

    // Heading 2 (##)
    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: parseInlineMarkdown(line.slice(3).trim()),
        },
      });
      continue;
    }

    // Heading 3 (###)
    if (line.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: parseInlineMarkdown(line.slice(4).trim()),
        },
      });
      continue;
    }

    // Heading 1 (#)
    if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: parseInlineMarkdown(line.slice(2).trim()),
        },
      });
      continue;
    }

    // Bulleted list (- or *)
    if (/^[-*]\s/.test(line)) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: parseInlineMarkdown(line.replace(/^[-*]\s/, "").trim()),
        },
      });
      continue;
    }

    // Numbered list (1. 2. 등)
    if (/^\d+\.\s/.test(line)) {
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: parseInlineMarkdown(
            line.replace(/^\d+\.\s/, "").trim()
          ),
        },
      });
      continue;
    }

    // 일반 문단
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: parseInlineMarkdown(line.trim()),
      },
    });
  }

  return blocks;
}

type RichTextItem = {
  type: "text";
  text: { content: string };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default";
  };
};

function parseInlineMarkdown(text: string): RichTextItem[] {
  const items: RichTextItem[] = [];
  // **bold**, *italic*, `code` 처리
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // match 이전의 일반 텍스트
    if (match.index > lastIndex) {
      items.push(makeRichText(text.slice(lastIndex, match.index)));
    }

    if (match[2]) {
      // **bold**
      items.push(makeRichText(match[2], { bold: true }));
    } else if (match[3]) {
      // *italic*
      items.push(makeRichText(match[3], { italic: true }));
    } else if (match[4]) {
      // `code`
      items.push(makeRichText(match[4], { code: true }));
    }

    lastIndex = match.index + match[0].length;
  }

  // 남은 텍스트
  if (lastIndex < text.length) {
    items.push(makeRichText(text.slice(lastIndex)));
  }

  // 빈 배열 방지
  if (items.length === 0) {
    items.push(makeRichText(text));
  }

  return items;
}

function makeRichText(
  content: string,
  opts: { bold?: boolean; italic?: boolean; code?: boolean } = {}
): RichTextItem {
  return {
    type: "text",
    text: { content },
    annotations: {
      bold: opts.bold ?? false,
      italic: opts.italic ?? false,
      strikethrough: false,
      underline: false,
      code: opts.code ?? false,
      color: "default",
    },
  };
}
