import { ENEMIES } from '../data/enemies.js';

export class StageSystem {
  constructor() {
    this.currentStage = 1;
    this.maxStage = 20;
  }

  spawnEnemy() {
    // Gradual enemy pool shift: every 3 stages, one weak enemy leaves, one stronger enters
    const startIdx = Math.min(Math.floor((this.currentStage - 1) / 3), 6);
    const endIdx = Math.min(startIdx + 4, ENEMIES.length);
    const pool = ENEMIES.slice(startIdx, endIdx);

    const template = pool[Math.floor(Math.random() * pool.length)];
    const stage = this.currentStage;

    // Gentle early/mid curve, steeper late game
    const hp = template.baseHp + Math.round(stage * 6 + stage * stage * 0.3);
    const atk = template.baseAttack + Math.round(stage * 1.2 + stage * stage * 0.05);

    return {
      name: template.name,
      emoji: template.emoji,
      element: template.element,
      maxHp: hp,
      currentHp: hp,
      attack: atk,
    };
  }

  getGoldReward() {
    return 30 + this.currentStage * 15 + Math.floor(this.currentStage * this.currentStage * 2);
  }

  canAdvance() {
    return this.currentStage < this.maxStage;
  }

  advance() {
    if (this.canAdvance()) {
      this.currentStage++;
      return true;
    }
    return false;
  }

  goBack() {
    if (this.currentStage > 1) {
      this.currentStage--;
      return true;
    }
    return false;
  }

  getStage() {
    return this.currentStage;
  }
}
