interface AnalysisInput {
  testId: string;
  testTitle: string;
  questions: { text: string; answer: string }[];
}

interface AnalysisResult {
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

// Cube test interpretation mappings
const cubeInterpretations: Record<string, Record<string, string>> = {
  "cube-1": {
    "아주 작다": "겸손하고 조용한 성격",
    "적당한 크기": "균형 잡힌 자존감",
    "꽤 크다": "높은 자신감",
    "엄청나게 크다": "강한 자존감과 존재감",
  },
  "cube-2": {
    "투명/유리": "솔직하고 개방적",
    "흰색": "순수하고 깨끗한 마음",
    "검정": "신비롭고 깊은 내면",
    "빨강": "열정적이고 강렬한 성격",
    "파랑": "차분하고 지적인 성격",
    "금색": "야망과 성취 지향",
  },
  "cube-3": {
    "땅 위에 놓여있다": "현실적이고 안정적",
    "공중에 떠있다": "이상주의적 사고",
    "반쯤 모래에 묻혀있다": "과거에 얽매이는 경향",
    "모래 위에 살짝 떠있다": "현실과 이상 사이 균형",
  },
  "cube-7": {
    "멀리서 작게 보인다": "스트레스 관리 능력 뛰어남",
    "다가오고 있지만 아직 멀다": "적당한 긴장감 유지",
    "큐브 근처에서 일어나고 있다": "현재 스트레스 상태",
    "큐브를 감싸고 있다": "큰 도전 속에 있음",
  },
};

const forestInterpretations: Record<string, Record<string, string>> = {
  "forest-1": {
    "햇살이 들어오는 밝은 숲": "낙관적이고 밝은 세계관",
    "약간 어둡지만 편안한 숲": "차분하고 안정된 성격",
    "울창하고 신비로운 숲": "깊은 사고와 호기심",
    "어둡고 깊은 숲": "복잡하고 깊은 내면세계",
  },
  "forest-2": {
    "사슴": "온화하고 섬세한 성격",
    "늑대": "독립적이고 강인한 성격",
    "토끼": "사교적이고 귀여운 매력",
    "곰": "든든하고 포용력 있는 성격",
    "여우": "영리하고 적응력 높은 성격",
    "새": "자유로운 영혼의 소유자",
  },
  "forest-6": {
    "잔잔하고 맑은 바다": "평화롭고 안정된 미래관",
    "넓고 끝없는 바다": "무한한 가능성 추구",
    "파도가 치는 바다": "도전적이고 역동적인 미래관",
    "석양이 비치는 바다": "감성적이고 낭만적인 미래관",
  },
};

const typeNames = [
  "고요한 달빛 사색가",
  "불꽃 같은 탐험가",
  "숲속의 현자",
  "바다의 꿈꾸는 자",
  "별빛 아래 관찰자",
  "바람을 따르는 자유인",
  "깊은 호수의 사유자",
  "태양 아래 춤추는 자",
];

export function analyzeLocally(input: AnalysisInput): AnalysisResult {
  const { testId, questions } = input;
  const interpretations =
    testId === "cube" ? cubeInterpretations : forestInterpretations;

  // Collect traits from answers
  const traits: string[] = [];
  for (const q of questions) {
    const questionInterp = interpretations[q.text] || {};
    const trait = questionInterp[q.answer];
    if (trait) {
      traits.push(trait);
    }
  }

  // If no mapped traits, generate based on answer patterns
  if (traits.length === 0) {
    traits.push("직감적 사고", "창의적 관점", "독특한 감성", "깊은 내면");
  }

  // Generate a pseudo-random but deterministic result based on answers
  const answerString = questions.map((q) => q.answer).join("");
  let hash = 0;
  for (let i = 0; i < answerString.length; i++) {
    hash = (hash << 5) - hash + answerString.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const rarityScore = (seed % 30) + 5; // 5~34
  const rarityLabel =
    rarityScore <= 10
      ? "매우 독특"
      : rarityScore <= 20
        ? "조금 독특"
        : "일반적";

  const typeName = typeNames[seed % typeNames.length];

  const summaries = [
    "당신은 깊은 내면의 세계를 가진 사람입니다. 겉으로는 조용해 보이지만, 내면에서는 끊임없이 사유하고 상상합니다.",
    "당신은 직감과 감성이 뛰어난 사람입니다. 다른 사람들이 놓치는 것을 포착하는 능력이 있습니다.",
    "당신은 현실적이면서도 이상을 꿈꾸는 균형잡힌 사람입니다. 두 세계를 오가며 자신만의 길을 만듭니다.",
    "당신은 열정적이고 에너지가 넘치는 사람입니다. 주변을 환하게 밝히며 사람들에게 영감을 줍니다.",
  ];

  const relationships = [
    "소수의 깊은 관계를 선호하며, 한번 친해지면 오래 유지합니다.",
    "넓은 인맥을 가지고 있지만, 정작 마음을 여는 사람은 적습니다.",
    "상대의 감정을 잘 읽고 공감하지만, 때로는 자신의 감정을 숨깁니다.",
    "솔직하고 직접적인 소통을 좋아하며, 갈등을 피하지 않습니다.",
  ];

  const loves = [
    "깊은 정신적 교감을 중시하며, 서로의 내면을 이해하는 관계를 추구합니다.",
    "함께 새로운 경험을 하는 것을 좋아하며, 자유로운 연애 스타일입니다.",
    "안정적이고 따뜻한 관계를 원하며, 상대에게 헌신적입니다.",
    "로맨틱하고 감성적이며, 작은 디테일에서 사랑을 표현합니다.",
  ];

  const id = crypto.randomUUID();

  return {
    id,
    testId,
    personalitySummary: summaries[seed % summaries.length],
    relationshipStyle: relationships[seed % relationships.length],
    loveStyle: loves[seed % loves.length],
    rarityScore,
    rarityLabel,
    oneLineSummary: `${typeName} - ${traits.slice(0, 2).join(", ")}`,
    typeName,
    traits: traits.slice(0, 4),
    answers: Object.fromEntries(questions.map((q) => [q.text, q.answer])),
    createdAt: new Date().toISOString(),
  };
}

export function saveResult(result: AnalysisResult): void {
  const stored = JSON.parse(localStorage.getItem("mindpick_results") || "{}");
  stored[result.id] = result;
  localStorage.setItem("mindpick_results", JSON.stringify(stored));
}

export function loadResult(id: string): AnalysisResult | null {
  const stored = JSON.parse(localStorage.getItem("mindpick_results") || "{}");
  return stored[id] || null;
}
