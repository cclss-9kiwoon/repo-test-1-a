export class HUD {
  constructor(gameState) {
    this.gs = gameState;
    this.el = document.getElementById('hud');
    this.nameEl = document.getElementById('hud-name');
    this.levelEl = document.getElementById('hud-level');
    this.hpEl = document.getElementById('hud-hp');
    this.maxHpEl = document.getElementById('hud-maxhp');
    this.goldEl = document.getElementById('hud-gold');
    this.stageEl = document.getElementById('hud-stage');
  }

  show() {
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }

  update() {
    if (this.gs.storyData) {
      this.nameEl.textContent = this.gs.storyData.heroName;
    }
    this.levelEl.textContent = this.gs.level;
    this.hpEl.textContent = this.gs.hp;
    this.maxHpEl.textContent = this.gs.maxHp;
    this.goldEl.textContent = this.gs.gold;
    this.stageEl.textContent = this.gs.currentStage;
  }
}
