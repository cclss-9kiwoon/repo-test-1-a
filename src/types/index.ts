export interface Test {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isFree: boolean;
  isPremium: boolean;
  questionCount: number;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  hintText?: string;
  answerType: "text" | "choice";
  choices?: string[];
}

export interface UserAnswers {
  testId: string;
  answers: Record<string, string>;
  createdAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  personalitySummary: string;
  relationshipStyle: string;
  loveStyle: string;
  rarityScore: number;
  rarityLabel: string;
  oneLineSummary: string;
  typeName: string;
  traits: string[];
  answers: Record<string, string>;
  createdAt: string;
}
