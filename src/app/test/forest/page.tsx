import TestRunner from "@/components/TestRunner";
import { forestQuestions, tests } from "@/data/tests";

export default function ForestTestPage() {
  const test = tests.find((t) => t.id === "forest")!;

  return (
    <TestRunner
      testId="forest"
      testTitle={test.title}
      questions={forestQuestions}
    />
  );
}
