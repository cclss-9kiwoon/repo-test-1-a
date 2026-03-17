import { getMultiplier } from '../data/elements.js';

export class BattleSystem {
  constructor() {
    this.log = [];
  }

  clearLog() {
    this.log = [];
  }

  addLog(message) {
    this.log.push(message);
    if (this.log.length > 50) {
      this.log.shift();
    }
  }

  calculateDamage(attackerAttack, attackerElement, defenderElement) {
    const multiplier = getMultiplier(attackerElement, defenderElement);
    return Math.round(attackerAttack * multiplier);
  }

  // Team attacks enemy. Returns total damage dealt.
  teamAttackEnemy(team, teamElement, enemy) {
    let totalDamage = 0;
    for (const char of team) {
      if (char.currentHp <= 0) continue;
      const dmg = this.calculateDamage(char.attack, teamElement, enemy.element);
      enemy.currentHp = Math.max(0, enemy.currentHp - dmg);
      totalDamage += dmg;

      const multiplier = getMultiplier(teamElement, enemy.element);
      let effectText = '';
      if (multiplier > 1) effectText = ' (효과적!)';
      else if (multiplier < 1) effectText = ' (별로...)';

      this.addLog(`${char.emoji} ${char.name} → ${enemy.emoji} ${dmg} 피해${effectText}`);
    }
    return totalDamage;
  }

  // Enemy attacks a random alive team member. Returns damage dealt.
  enemyAttackTeam(enemy, team, teamElement) {
    const alive = team.filter(c => c.currentHp > 0);
    if (alive.length === 0) return 0;

    const target = alive[Math.floor(Math.random() * alive.length)];
    const dmg = this.calculateDamage(enemy.attack, enemy.element, teamElement);
    target.currentHp = Math.max(0, target.currentHp - dmg);

    this.addLog(`${enemy.emoji} ${enemy.name} → ${target.emoji} ${dmg} 피해`);
    return dmg;
  }

  isEnemyDead(enemy) {
    return enemy.currentHp <= 0;
  }

  isTeamDead(team) {
    return team.every(c => c.currentHp <= 0);
  }
}
