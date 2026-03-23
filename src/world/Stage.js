import { Monster } from './Monster.js';

const STAGE_WIDTH = 4000;
const GROUND_Y = 528; // 바닥 렌더링 Y

export class Stage {
  constructor(stageNum, storyData, difficultyMultiplier = 1) {
    this.stageNum = stageNum;
    this.width = STAGE_WIDTH;
    this.groundY = GROUND_Y;
    this.bgColor = storyData.bgColor;
    this.monsters = [];
    this._spawnMonsters(storyData, difficultyMultiplier);
  }

  _spawnMonsters(story, mult) {
    const monsterTypes = story.monsters.basic;
    const bossData = this.stageNum === 3 ? story.monsters.finalBoss : story.monsters.stageBoss[this.stageNum - 1];

    // 기본 몬스터 배치 (화면 가로 800px 기준, 약 200px 간격)
    let id = 0;
    for (let x = 300; x < this.width - 400; x += 180 + Math.random() * 120) {
      const type = monsterTypes[id % monsterTypes.length];
      this.monsters.push(new Monster({
        id: id++,
        name: type.name,
        x,
        y: 488 - (type.height || 30) + 30,
        width: type.width || 30,
        height: type.height || 30,
        color: type.color,
        hp: Math.floor(type.hp * mult),
        attack: Math.floor(type.attack * mult),
        defense: Math.floor(type.defense * mult),
        exp: type.exp,
        gold: type.gold,
      }));
    }

    // 스테이지 끝에 보스 배치
    this.monsters.push(new Monster({
      id: id++,
      name: bossData.name,
      x: this.width - 200,
      y: 488 - (bossData.height || 50) + 30,
      width: bossData.width || 50,
      height: bossData.height || 50,
      color: bossData.color,
      hp: Math.floor(bossData.hp * mult),
      attack: Math.floor(bossData.attack * mult),
      defense: Math.floor(bossData.defense * mult),
      exp: bossData.exp,
      gold: bossData.gold,
      isBoss: true,
    }));
  }

  update(cameraX, viewWidth) {
    for (const m of this.monsters) {
      m.update(cameraX, viewWidth);
    }
  }

  draw(ctx, cameraX, viewWidth) {
    // 배경
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, viewWidth, 600);

    // 간단한 배경 장식 (구름/별)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 370 + 100) - cameraX * 0.3) % (viewWidth + 100) - 50;
      ctx.fillRect(bx, 60 + (i % 3) * 80, 60 + (i % 2) * 30, 20);
    }

    // 바닥
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, this.groundY, viewWidth, 600 - this.groundY);

    // 바닥 풀/텍스처
    ctx.fillStyle = '#4a6a2a';
    ctx.fillRect(0, this.groundY, viewWidth, 4);

    // 스테이지 진행 표시
    const progress = cameraX / (this.width - viewWidth);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(viewWidth / 2 - 100, 580, 200, 6);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(viewWidth / 2 - 100, 580, 200 * Math.min(1, progress), 6);

    // 몬스터
    for (const m of this.monsters) {
      m.draw(ctx, cameraX);
    }
  }

  getCollidingMonster(player) {
    for (const m of this.monsters) {
      if (m.collidesWithPlayer(player)) {
        return m;
      }
    }
    return null;
  }

  isBossDefeated() {
    const boss = this.monsters.find(m => m.isBoss);
    return boss && !boss.alive;
  }

  get boss() {
    return this.monsters.find(m => m.isBoss);
  }
}
