export interface UserInput {
  topic: string;
  feelings?: string;
  keywords?: string[];
}

export interface BlogContent {
  title: string;
  body: string;
  summary: string;
  hashtags: string[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ContentDraft {
  content: BlogContent;
  image: GeneratedImage;
}

export type ReviewAction =
  | "approve"
  | "edit_content"
  | "regenerate_image"
  | "regenerate_all"
  | "cancel";

export interface PublishResult {
  platform: "notion";
  url: string;
  success: boolean;
}
