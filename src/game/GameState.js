export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.level = 1;
    this.exp = 0;
    this.maxHp = 100;
    this.hp = 100;
    this.attack = 10;
    this.defense = 5;
    this.gold = 0;
    this.potions = 3;
    this.maxPotions = 5;

    this.weapon = null;       // { name, attack, enhance: 0 }
    this.armor = null;        // { name, defense, enhance: 0 }

    this.currentStage = 1;
    this.cycle = 0;           // newgame+ 회차
    this.storyData = null;    // 현재 줄거리
    this.heroType = 'warrior';
  }

  resetForNewGamePlus() {
    this.cycle += 1;
    this.level = 1;
    this.exp = 0;
    this.maxHp = 100;
    this.hp = 100;
    this.attack = 10;
    this.defense = 5;
    // gold, weapon, armor, potions 유지
    this.currentStage = 1;
  }

  get expToNext() {
    return this.level * 30;
  }

  get totalAttack() {
    let atk = this.attack;
    if (this.weapon) {
      atk += this.weapon.attack * (1 + this.weapon.enhance * 0.15);
    }
    return Math.floor(atk);
  }

  get totalDefense() {
    let def = this.defense;
    if (this.armor) {
      def += this.armor.defense * (1 + this.armor.enhance * 0.15);
    }
    return Math.floor(def);
  }

  addExp(amount) {
    this.exp += amount;
    let leveledUp = false;
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.level += 1;
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.attack += 3;
      this.defense += 2;
      leveledUp = true;
    }
    return leveledUp;
  }

  heal(percent) {
    const amount = Math.floor(this.maxHp * percent);
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return amount;
  }

  get difficultyMultiplier() {
    return 1 + this.cycle * 0.3;
  }
}
