import TestRunner from "@/components/TestRunner";
import { cubeQuestions, tests } from "@/data/tests";

export default function CubeTestPage() {
  const test = tests.find((t) => t.id === "cube")!;

  return (
    <TestRunner
      testId="cube"
      testTitle={test.title}
      questions={cubeQuestions}
    />
  );
}
