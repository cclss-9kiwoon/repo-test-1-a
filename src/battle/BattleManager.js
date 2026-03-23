export class BattleManager {
  constructor(gameState) {
    this.gs = gameState;
    this.enemy = null;
    this.enemyHp = 0;
    this.enemyMaxHp = 0;
    this.playerDefending = false;
    this.active = false;
    this.log = '';
    this.result = null; // 'win' | 'lose' | 'run' | null
  }

  start(monster) {
    this.enemy = monster;
    this.enemyHp = monster.hp;
    this.enemyMaxHp = monster.maxHp;
    this.playerDefending = false;
    this.active = true;
    this.result = null;
    this.log = `${monster.name}이(가) 나타났다!`;
  }

  playerAttack() {
    this.playerDefending = false;
    const dmg = Math.max(1, this.gs.totalAttack - this.enemy.defense);
    this.enemyHp -= dmg;
    this.log = `${this.gs.storyData.heroName}의 공격! ${this.enemy.name}에게 ${dmg} 데미지!`;

    if (this.enemyHp <= 0) {
      this.enemyHp = 0;
      this._onEnemyDead();
      return;
    }
    this._enemyTurn();
  }

  playerDefend() {
    this.playerDefending = true;
    this.log = `${this.gs.storyData.heroName}은(는) 방어 자세를 취했다!`;
    this._enemyTurn();
  }

  playerDodge() {
    this.playerDefending = false;
    const dodgeSuccess = Math.random() < 0.5;

    if (dodgeSuccess) {
      this.log = `${this.gs.storyData.heroName}은(는) 회피에 성공했다!`;
      // 적도 턴 사용이지만 아무 일도 안 일어남 - 적 턴 스킵
    } else {
      // 실패 시 데미지 1.5배
      const baseDmg = Math.max(1, this.enemy.attack - this.gs.totalDefense);
      const dmg = Math.floor(baseDmg * 1.5);
      this.gs.hp -= dmg;
      this.log = `회피 실패! ${this.enemy.name}의 강타! ${dmg} 데미지!`;

      if (this.gs.hp <= 0) {
        this.gs.hp = 0;
        this._onPlayerDead();
        return;
      }
    }
  }

  playerRun() {
    this.playerDefending = false;
    if (this.enemy.isBoss) {
      this.log = '보스에게서는 도망칠 수 없다!';
      this._enemyTurn();
      return;
    }

    if (Math.random() < 0.7) {
      this.log = '도망에 성공했다!';
      this.result = 'run';
      this.active = false;
    } else {
      this.log = '도망에 실패했다!';
      this._enemyTurn();
    }
  }

  usePotion() {
    this.playerDefending = false;
    if (this.gs.potions <= 0) {
      this.log = '물약이 없다!';
      return false;
    }
    this.gs.potions -= 1;
    const healed = this.gs.heal(0.3);
    this.log = `물약 사용! HP ${healed} 회복! (남은 물약: ${this.gs.potions})`;
    this._enemyTurn();
    return true;
  }

  _enemyTurn() {
    if (!this.active) return;

    const roll = Math.random();
    let dmg;

    if (roll < 0.7) {
      // 일반 공격
      dmg = Math.max(1, this.enemy.attack - this.gs.totalDefense);
      if (this.playerDefending) {
        dmg = Math.floor(dmg * 0.5);
      }
      this.gs.hp -= dmg;
      this.log += `\n${this.enemy.name}의 공격! ${dmg} 데미지!`;
    } else if (roll < 0.9) {
      // 방어 (아무것도 안 함)
      this.log += `\n${this.enemy.name}은(는) 방어 자세를 취했다.`;
    } else {
      // 강공격
      dmg = Math.max(1, Math.floor(this.enemy.attack * 1.3) - this.gs.totalDefense);
      if (this.playerDefending) {
        dmg = Math.floor(dmg * 0.5);
      }
      this.gs.hp -= dmg;
      this.log += `\n${this.enemy.name}의 강공격! ${dmg} 데미지!`;
    }

    if (this.gs.hp <= 0) {
      this.gs.hp = 0;
      this._onPlayerDead();
    }
  }

  _onEnemyDead() {
    this.enemy.alive = false;
    this.enemy.hp = 0;
    const leveledUp = this.gs.addExp(this.enemy.exp);
    this.gs.gold += this.enemy.gold;
    this.log += `\n${this.enemy.name}을(를) 처치했다! (+${this.enemy.exp} EXP, +${this.enemy.gold} Gold)`;
    if (leveledUp) {
      this.log += `\n레벨 업! Lv.${this.gs.level}!`;
    }
    this.result = 'win';
    this.active = false;
  }

  _onPlayerDead() {
    if (this.enemy.isBoss && this.gs.currentStage === 3) {
      this.result = 'lose-boss';
    } else {
      this.result = 'lose';
    }
    this.active = false;
    this.log += `\n${this.gs.storyData.heroName}이(가) 쓰러졌다...`;
  }
}
