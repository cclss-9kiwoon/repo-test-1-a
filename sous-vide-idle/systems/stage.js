import { ENEMIES } from '../data/enemies.js';

export class StageSystem {
  constructor() {
    this.currentStage = 1;
    this.maxStage = 20;
  }

  spawnEnemy() {
    // Pick enemy based on stage difficulty tier
    let pool;
    if (this.currentStage <= 5) {
      pool = ENEMIES.slice(0, 4);       // weak enemies
    } else if (this.currentStage <= 10) {
      pool = ENEMIES.slice(2, 7);       // medium enemies
    } else {
      pool = ENEMIES.slice(5, 10);      // strong enemies
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    const stage = this.currentStage;

    return {
      name: template.name,
      emoji: template.emoji,
      element: template.element,
      maxHp: template.baseHp + stage * 10,
      currentHp: template.baseHp + stage * 10,
      attack: template.baseAttack + stage * 2,
    };
  }

  getGoldReward() {
    return 30 + this.currentStage * 15;
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

  getStage() {
    return this.currentStage;
  }
}
