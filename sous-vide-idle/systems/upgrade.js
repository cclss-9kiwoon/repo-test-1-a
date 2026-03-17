export class UpgradeSystem {
  constructor() {
    this.levels = {
      attack: 0,
      hp: 0,
    };
  }

  getCost(type) {
    const level = this.levels[type];
    return 100 * Math.pow(2, level);
  }

  canUpgrade(type, gold) {
    return gold >= this.getCost(type);
  }

  // Returns cost spent, or 0 if cannot afford.
  upgrade(type, gold) {
    const cost = this.getCost(type);
    if (gold < cost) return 0;
    this.levels[type]++;
    return cost;
  }

  getAttackBonus() {
    return this.levels.attack * 2;
  }

  getHpBonus() {
    return this.levels.hp * 10;
  }

  getLevel(type) {
    return this.levels[type];
  }
}
