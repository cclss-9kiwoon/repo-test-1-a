import { Test, Question } from "@/types";

export const tests: Test[] = [
  {
    id: "cube",
    title: "큐브 테스트",
    description: "사막 위의 큐브로 알아보는 당신의 심리",
    emoji: "🧊",
    isFree: true,
    isPremium: false,
    questionCount: 7,
  },
  {
    id: "forest",
    title: "숲 오두막 테스트",
    description: "숲속 상상으로 알아보는 당신의 내면",
    emoji: "🌲",
    isFree: true,
    isPremium: false,
    questionCount: 6,
  },
];

export const cubeQuestions: Question[] = [
  {
    id: "cube-1",
    testId: "cube",
    text: "사막 한가운데 큐브가 있습니다. 큐브의 크기는 어떤가요?",
    hintText: "자유롭게 묘사해 주세요",
    answerType: "choice",
    choices: ["아주 작다", "적당한 크기", "꽤 크다", "엄청나게 크다"],
  },
  {
    id: "cube-2",
    testId: "cube",
    text: "큐브의 색은 무엇인가요?",
    hintText: "떠오르는 색을 말해주세요",
    answerType: "choice",
    choices: ["투명/유리", "흰색", "검정", "빨강", "파랑", "금색"],
  },
  {
    id: "cube-3",
    testId: "cube",
    text: "큐브는 어디에 위치해 있나요?",
    hintText: "땅 위? 공중? 반쯤 묻혀있나요?",
    answerType: "choice",
    choices: [
      "땅 위에 놓여있다",
      "공중에 떠있다",
      "반쯤 모래에 묻혀있다",
      "모래 위에 살짝 떠있다",
    ],
  },
  {
    id: "cube-4",
    testId: "cube",
    text: "근처에 사다리가 있습니다. 사다리는 큐브와 어떤 관계인가요?",
    hintText: "큐브에 기대어 있나요? 떨어져 있나요?",
    answerType: "choice",
    choices: [
      "큐브에 기대어 있다",
      "큐브 위로 올라간다",
      "큐브에서 떨어져 있다",
      "큐브 안으로 들어간다",
    ],
  },
  {
    id: "cube-5",
    testId: "cube",
    text: "말 한 마리가 보입니다. 말은 어떤 모습인가요?",
    hintText: "색, 크기, 행동 등",
    answerType: "choice",
    choices: [
      "자유롭게 달리고 있다",
      "큐브 옆에 서있다",
      "멀리서 지나가고 있다",
      "큐브 주변을 맴돌고 있다",
    ],
  },
  {
    id: "cube-6",
    testId: "cube",
    text: "꽃이 보입니다. 꽃은 몇 송이이고 어디에 있나요?",
    hintText: "개수와 위치를 떠올려 보세요",
    answerType: "choice",
    choices: [
      "한 송이, 큐브 옆에",
      "몇 송이, 여기저기",
      "많이, 큐브 주변에 가득",
      "꽃밭이 펼쳐져 있다",
    ],
  },
  {
    id: "cube-7",
    testId: "cube",
    text: "폭풍이 보입니다. 폭풍은 어떤 상태인가요?",
    hintText: "가까운가요? 먼가요? 강한가요?",
    answerType: "choice",
    choices: [
      "멀리서 작게 보인다",
      "다가오고 있지만 아직 멀다",
      "큐브 근처에서 일어나고 있다",
      "큐브를 감싸고 있다",
    ],
  },
];

export const forestQuestions: Question[] = [
  {
    id: "forest-1",
    testId: "forest",
    text: "숲에 들어섰습니다. 숲의 분위기는 어떤가요?",
    hintText: "밝은가요? 어두운가요? 조용한가요?",
    answerType: "choice",
    choices: [
      "햇살이 들어오는 밝은 숲",
      "약간 어둡지만 편안한 숲",
      "울창하고 신비로운 숲",
      "어둡고 깊은 숲",
    ],
  },
  {
    id: "forest-2",
    testId: "forest",
    text: "숲속에서 동물 한 마리를 만났습니다. 어떤 동물인가요?",
    hintText: "가장 먼저 떠오르는 동물",
    answerType: "choice",
    choices: ["사슴", "늑대", "토끼", "곰", "여우", "새"],
  },
  {
    id: "forest-3",
    testId: "forest",
    text: "숲속에 오두막이 있습니다. 어떤 모습인가요?",
    hintText: "크기, 상태, 분위기",
    answerType: "choice",
    choices: [
      "작고 아담한 오두막",
      "견고하고 정돈된 오두막",
      "오래되었지만 따뜻한 오두막",
      "크고 화려한 오두막",
    ],
  },
  {
    id: "forest-4",
    testId: "forest",
    text: "오두막 안에 컵이 있습니다. 어떤 컵인가요?",
    hintText: "재질, 상태, 내용물",
    answerType: "choice",
    choices: [
      "깨끗한 도자기 컵",
      "나무 컵, 물이 담겨있다",
      "금속 컵, 비어있다",
      "유리 컵, 반쯤 차있다",
    ],
  },
  {
    id: "forest-5",
    testId: "forest",
    text: "오두막 밖으로 물이 흐르고 있습니다. 어떤 물인가요?",
    hintText: "시내? 강? 폭포?",
    answerType: "choice",
    choices: [
      "졸졸 흐르는 시냇물",
      "잔잔한 호수",
      "힘차게 흐르는 강",
      "작은 폭포",
    ],
  },
  {
    id: "forest-6",
    testId: "forest",
    text: "숲을 지나면 바다가 보입니다. 바다의 모습은?",
    hintText: "파도, 색, 분위기",
    answerType: "choice",
    choices: [
      "잔잔하고 맑은 바다",
      "넓고 끝없는 바다",
      "파도가 치는 바다",
      "석양이 비치는 바다",
    ],
  },
];

export function getQuestions(testId: string): Question[] {
  switch (testId) {
    case "cube":
      return cubeQuestions;
    case "forest":
      return forestQuestions;
    default:
      return [];
  }
}
