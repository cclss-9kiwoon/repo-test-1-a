export class UpgradeSystem {
  constructor() {
    this.levels = {
      attack: 0,
      hp: 0,
    };
  }

  getCost(type) {
    const level = this.levels[type];
    return 80 + level * 40 + level * level * 20;
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
    return this.levels.attack * 3;
  }

  getHpBonus() {
    return this.levels.hp * 15;
  }

  getLevel(type) {
    return this.levels[type];
  }
}
