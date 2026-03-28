import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`\n[ERROR] 환경변수 ${name}이(가) 설정되지 않았습니다.`);
    console.error(`.env 파일을 확인해주세요. (.env.example 참고)\n`);
    process.exit(1);
  }
  return value;
}

export const config = {
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  notionApiKey: requireEnv("NOTION_API_KEY"),
  notionParentPageId: requireEnv("NOTION_PARENT_PAGE_ID"),
};
