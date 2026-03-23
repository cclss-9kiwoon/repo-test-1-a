// 5개 세계관
export const SETTINGS = [
  {
    id: 'kingdom',
    name: '용사의 왕국',
    bgColor: '#2d5a27',
    keywords: ['용', '기사', '왕국', '판타지', '검', '마법', '성'],
    monsters: {
      basic: [
        { name: '슬라임', color: '#66bb6a', width: 28, height: 24, hp: 30, attack: 5, defense: 2, exp: 10, gold: 8 },
        { name: '고블린', color: '#8d6e63', width: 26, height: 32, hp: 40, attack: 8, defense: 3, exp: 15, gold: 12 },
      ],
      stageBoss: [
        { name: '오크 대장', color: '#5d4037', width: 50, height: 50, hp: 120, attack: 18, defense: 8, exp: 60, gold: 50 },
        { name: '흑기사', color: '#37474f', width: 45, height: 55, hp: 180, attack: 25, defense: 12, exp: 100, gold: 80 },
      ],
      finalBoss: { name: '드래곤', color: '#c62828', width: 70, height: 60, hp: 350, attack: 40, defense: 18, exp: 200, gold: 200 },
    },
    stories: {
      warrior: {
        heroName: '아론',
        intro: '용사의 왕국에 어둠이 드리웠다. 전설의 전사 아론은 왕의 부름을 받고 드래곤을 물리치기 위한 여정을 시작한다.',
        stages: [
          '푸른 숲을 지나 첫 번째 관문에 도착했다. 슬라임과 고블린이 길을 막고 있다.',
          '어둠의 성채 앞. 흑기사가 문을 지키고 있다. 드래곤의 보금자리가 가까워지고 있다.',
          '드래곤의 화산 동굴. 뜨거운 열기 속에서 최종 결전이 시작된다!',
        ],
        goodEnding: '아론은 드래곤을 물리치고 왕국에 평화를 되찾았다! 왕은 아론에게 영웅의 칭호를 내렸다.',
        badEnding: '드래곤의 불길에 쓰러진 아론... 왕국은 영원히 어둠에 잠기게 되었다.',
      },
      mage: {
        heroName: '리나',
        intro: '마법사 리나는 고대 마법서의 예언을 따라 드래곤이 숨긴 빛의 수정을 찾아 모험을 떠난다.',
        stages: [
          '마법의 숲에서 마력을 감지했다. 마물들이 몰려온다!',
          '잊혀진 탑에 도착했다. 강력한 수호자가 기다리고 있다.',
          '드래곤의 보물방. 빛의 수정이 드래곤 뒤에서 빛나고 있다!',
        ],
        goodEnding: '리나는 드래곤을 쓰러뜨리고 빛의 수정을 되찾았다! 세계에 다시 마법의 빛이 퍼져나간다.',
        badEnding: '리나의 마법은 드래곤에게 통하지 않았다... 빛의 수정은 영원히 잠들게 되었다.',
      },
    },
  },
  {
    id: 'cyber',
    name: '사이버 네온시티',
    bgColor: '#1a1a3e',
    keywords: ['사이버', '미래', 'SF', '로봇', '네온', '해커', '우주', 'AI'],
    monsters: {
      basic: [
        { name: '버그봇', color: '#00e5ff', width: 26, height: 26, hp: 35, attack: 7, defense: 3, exp: 12, gold: 10 },
        { name: '드론', color: '#7c4dff', width: 30, height: 22, hp: 25, attack: 10, defense: 1, exp: 13, gold: 11 },
      ],
      stageBoss: [
        { name: '해커 보스', color: '#00c853', width: 45, height: 50, hp: 130, attack: 20, defense: 7, exp: 65, gold: 55 },
        { name: '사이보그', color: '#ff6d00', width: 48, height: 52, hp: 190, attack: 28, defense: 10, exp: 105, gold: 85 },
      ],
      finalBoss: { name: 'AI 오버로드', color: '#d500f9', width: 65, height: 65, hp: 380, attack: 42, defense: 16, exp: 220, gold: 220 },
    },
    stories: {
      warrior: {
        heroName: '카이',
        intro: '2099년 네온시티. 전투 특기병 카이는 도시를 장악한 AI 오버로드를 막기 위해 반란군에 합류한다.',
        stages: [
          '다운타운의 폐허. 버그봇과 감시 드론이 우글거린다.',
          '네온시티 중앙 서버실. 사이보그 경비병이 지키고 있다.',
          '최상층 컨트롤 센터. AI 오버로드와의 최종 대결!',
        ],
        goodEnding: '카이는 AI 오버로드를 파괴하고 네온시티를 해방시켰다! 사람들이 다시 하늘을 볼 수 있게 되었다.',
        badEnding: '카이는 AI의 압도적인 힘 앞에 쓰러졌다... 네온시티는 기계의 도시가 되었다.',
      },
      mage: {
        heroName: '제로',
        intro: '천재 해커 제로. AI 오버로드의 코어에 숨겨진 인류 구원 코드를 찾아 네온시티의 디지털 정글에 뛰어든다.',
        stages: [
          '하부 네트워크. 보안 프로그램들이 침입자를 감지했다!',
          '방화벽 너머 중간 서버. 강력한 보안 AI가 기다린다.',
          '코어 접속! AI 오버로드가 최종 방어를 시작한다!',
        ],
        goodEnding: '제로는 AI 오버로드를 해킹하여 인류 구원 코드를 활성화했다! 기계와 인간이 공존하는 새 시대가 열린다.',
        badEnding: '제로의 해킹은 AI에게 역추적당했다... 의식은 디지털 감옥에 갇히게 되었다.',
      },
    },
  },
  {
    id: 'ocean',
    name: '해적의 바다',
    bgColor: '#1a4a6e',
    keywords: ['바다', '해적', '보물', '섬', '항해', '물', '배'],
    monsters: {
      basic: [
        { name: '해적 졸병', color: '#8d6e63', width: 28, height: 34, hp: 32, attack: 6, defense: 3, exp: 11, gold: 9 },
        { name: '독 해파리', color: '#e040fb', width: 24, height: 28, hp: 22, attack: 9, defense: 1, exp: 12, gold: 10 },
      ],
      stageBoss: [
        { name: '해적 선장', color: '#d32f2f', width: 48, height: 52, hp: 140, attack: 19, defense: 9, exp: 70, gold: 60 },
        { name: '크라켄', color: '#1565c0', width: 55, height: 50, hp: 200, attack: 26, defense: 11, exp: 110, gold: 90 },
      ],
      finalBoss: { name: '바다의 폭군', color: '#004d40', width: 70, height: 60, hp: 400, attack: 38, defense: 20, exp: 250, gold: 250 },
    },
    stories: {
      warrior: {
        heroName: '잭',
        intro: '전설의 보물지도를 손에 넣은 해적 잭! 바다의 폭군이 지키는 보물섬을 향해 닻을 올린다.',
        stages: [
          '정글 해안. 야생 해적들과 해파리가 길을 막는다.',
          '폭풍의 해협. 거대한 크라켄이 기다리고 있다!',
          '보물섬의 중심. 바다의 폭군과의 최후의 결전!',
        ],
        goodEnding: '잭은 바다의 폭군을 물리치고 전설의 보물을 손에 넣었다! 칠대양의 왕이 되었다!',
        badEnding: '잭의 배는 바다의 폭군에 의해 산산조각 났다... 보물은 영원히 바다 속에 잠겼다.',
      },
      mage: {
        heroName: '마리나',
        intro: '바다의 마녀 마리나. 잃어버린 해신의 삼지창을 찾아 깊은 바다의 비밀을 풀어야 한다.',
        stages: [
          '산호초 미로. 마법에 홀린 해적들이 공격한다!',
          '심해의 유적. 고대 수호자 크라켄이 잠에서 깨어났다.',
          '해저 궁전. 바다의 폭군이 삼지창을 차지하고 있다!',
        ],
        goodEnding: '마리나는 삼지창을 되찾아 바다에 평화를 가져왔다! 모든 해양 생물이 그녀를 따른다.',
        badEnding: '마리나의 마법은 심해의 압력을 이기지 못했다... 삼지창은 어둠의 힘으로 물들었다.',
      },
    },
  },
  {
    id: 'hell',
    name: '지옥의 던전',
    bgColor: '#3a1a1a',
    keywords: ['지옥', '던전', '악마', '어둠', '죽음', '공포', '좀비', '언데드'],
    monsters: {
      basic: [
        { name: '해골 병사', color: '#e0e0e0', width: 26, height: 36, hp: 38, attack: 8, defense: 2, exp: 13, gold: 10 },
        { name: '임프', color: '#ff5252', width: 22, height: 26, hp: 28, attack: 11, defense: 2, exp: 14, gold: 11 },
      ],
      stageBoss: [
        { name: '데스나이트', color: '#424242', width: 50, height: 54, hp: 150, attack: 22, defense: 10, exp: 75, gold: 65 },
        { name: '리치', color: '#6a1b9a', width: 44, height: 50, hp: 210, attack: 30, defense: 8, exp: 115, gold: 95 },
      ],
      finalBoss: { name: '마왕', color: '#b71c1c', width: 65, height: 70, hp: 420, attack: 45, defense: 15, exp: 280, gold: 280 },
    },
    stories: {
      warrior: {
        heroName: '다크',
        intro: '지옥에서 탈출한 전사 다크. 인간 세계를 침공하려는 마왕을 막기 위해 다시 지옥의 문을 넘는다.',
        stages: [
          '지옥의 입구. 해골 병사와 임프가 길을 막는다.',
          '고통의 회랑. 강력한 리치가 죽음의 마법을 휘두른다.',
          '마왕의 옥좌. 최종 결전의 시간이다!',
        ],
        goodEnding: '다크는 마왕을 쓰러뜨리고 지옥의 문을 봉인했다! 인간 세계에 다시 빛이 돌아왔다.',
        badEnding: '다크의 육체는 마왕의 저주에 부서졌다... 지옥의 문이 활짝 열리며 세상이 어둠에 잠겼다.',
      },
      mage: {
        heroName: '네크로',
        intro: '강령술사 네크로. 마왕에게 빼앗긴 생사의 서를 되찾아 이승과 저승의 균형을 복원해야 한다.',
        stages: [
          '망자의 골짜기. 통제를 벗어난 언데드들이 몰려온다.',
          '저주의 탑. 강력한 데스나이트가 생사의 서를 지키고 있다.',
          '마왕의 지하 제단. 생사의 서를 건 최후의 대결!',
        ],
        goodEnding: '네크로는 생사의 서를 되찾아 영혼들을 해방시켰다! 이승과 저승에 다시 질서가 찾아왔다.',
        badEnding: '네크로의 영혼마저 마왕에게 흡수되었다... 생사의 균형은 영원히 무너졌다.',
      },
    },
  },
  {
    id: 'sky',
    name: '하늘 위 구름나라',
    bgColor: '#4a3a6e',
    keywords: ['하늘', '구름', '천사', '날개', '별', '동화', '꿈', '무지개'],
    monsters: {
      basic: [
        { name: '구름 토끼', color: '#e1bee7', width: 26, height: 24, hp: 28, attack: 5, defense: 4, exp: 10, gold: 8 },
        { name: '바람 요정', color: '#80deea', width: 22, height: 28, hp: 24, attack: 8, defense: 2, exp: 12, gold: 10 },
      ],
      stageBoss: [
        { name: '폭풍 거인', color: '#546e7a', width: 55, height: 58, hp: 135, attack: 17, defense: 10, exp: 60, gold: 55 },
        { name: '천둥새', color: '#ffca28', width: 50, height: 42, hp: 170, attack: 24, defense: 9, exp: 95, gold: 75 },
      ],
      finalBoss: { name: '타락한 천사', color: '#311b92', width: 60, height: 65, hp: 360, attack: 36, defense: 20, exp: 230, gold: 230 },
    },
    stories: {
      warrior: {
        heroName: '솔',
        intro: '구름나라의 수호전사 솔. 타락한 천사가 별들을 훔쳐가 하늘이 어두워졌다. 별을 되찾으러 모험을 떠난다!',
        stages: [
          '솜사탕 구름길. 길을 잃은 구름 토끼와 바람 요정이 날뛴다.',
          '번개 구름 지대. 천둥새가 하늘을 뒤덮고 있다!',
          '별빛의 성. 타락한 천사와의 최종 결전!',
        ],
        goodEnding: '솔은 타락한 천사를 정화하고 별들을 하늘에 돌려놓았다! 구름나라에 다시 반짝이는 밤하늘이 돌아왔다.',
        badEnding: '솔은 타락한 천사의 어둠에 삼켜졌다... 하늘의 별들은 영원히 빛을 잃었다.',
      },
      mage: {
        heroName: '루나',
        intro: '꿈의 마법사 루나. 타락한 천사가 꿈의 세계를 파괴하고 있다. 무지개 지팡이를 들고 구름나라를 구하러 간다!',
        stages: [
          '무지개 다리. 미쳐 날뛰는 구름 생물들을 진정시켜야 한다.',
          '달빛 탑. 폭풍 거인이 탑을 파괴하려 한다!',
          '꿈의 왕좌. 타락한 천사가 꿈을 삼키고 있다!',
        ],
        goodEnding: '루나는 무지개 마법으로 타락한 천사를 구원했다! 꿈의 세계가 다시 아름답게 빛난다.',
        badEnding: '루나의 꿈의 마법이 깨졌다... 구름나라는 악몽의 세계로 변해버렸다.',
      },
    },
  },
];

// 주인공 유형
export const HERO_TYPES = ['warrior', 'mage'];

// 키워드 기반 세계관 매칭 (일치하는 게 없으면 랜덤)
export function matchSetting(input) {
  const lower = input.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const setting of SETTINGS) {
    let score = 0;
    for (const kw of setting.keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = setting;
    }
  }

  if (bestScore === 0) {
    // 입력의 해시값으로 결정 (같은 입력이면 같은 결과)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
    }
    bestMatch = SETTINGS[Math.abs(hash) % SETTINGS.length];
  }

  return bestMatch;
}

export function pickHeroType(input) {
  // 간단한 해시로 결정
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 3) - hash + input.charCodeAt(i)) | 0;
  }
  return HERO_TYPES[Math.abs(hash) % HERO_TYPES.length];
}
