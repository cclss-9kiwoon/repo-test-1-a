export class BattleUI {
  constructor(battleManager, gameState) {
    this.bm = battleManager;
    this.gs = gameState;
    this.el = document.getElementById('battle-screen');

    this.playerSprite = document.getElementById('player-sprite');
    this.enemySprite = document.getElementById('enemy-sprite');
    this.playerName = document.getElementById('battle-player-name');
    this.enemyName = document.getElementById('battle-enemy-name');
    this.playerHpBar = document.getElementById('player-hp-bar');
    this.playerHpText = document.getElementById('player-hp-text');
    this.enemyHpBar = document.getElementById('enemy-hp-bar');
    this.enemyHpText = document.getElementById('enemy-hp-text');
    this.logEl = document.getElementById('battle-log');
    this.potionCount = document.getElementById('potion-count');

    this.mainMenu = document.getElementById('battle-main-menu');
    this.fightMenu = document.getElementById('battle-fight-menu');
    this.itemMenu = document.getElementById('battle-item-menu');

    this._resolve = null;
    this._setupButtons();
  }

  _setupButtons() {
    this.el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      this._handleAction(action);
    });
  }

  _handleAction(action) {
    switch (action) {
      case 'fight':
        this.mainMenu.style.display = 'none';
        this.fightMenu.style.display = 'flex';
        break;
      case 'item':
        this.mainMenu.style.display = 'none';
        this.itemMenu.style.display = 'flex';
        this.potionCount.textContent = this.gs.potions;
        break;
      case 'back':
        this.fightMenu.style.display = 'none';
        this.itemMenu.style.display = 'none';
        this.mainMenu.style.display = 'flex';
        break;
      case 'attack':
        this.bm.playerAttack();
        this._afterAction();
        break;
      case 'defend':
        this.bm.playerDefend();
        this._afterAction();
        break;
      case 'dodge':
        this.bm.playerDodge();
        this._afterAction();
        break;
      case 'run':
        this.bm.playerRun();
        this._afterAction();
        break;
      case 'use-potion':
        this.bm.usePotion();
        this._afterAction();
        break;
    }
  }

  _afterAction() {
    this._updateDisplay();
    if (!this.bm.active && this._resolve) {
      // 전투 종료 - 잠시 후 결과 반환
      setTimeout(() => {
        if (this._resolve) {
          this._resolve(this.bm.result);
          this._resolve = null;
        }
      }, 1200);
    }
    // 서브메뉴에서 메인메뉴로 복귀
    if (this.bm.active) {
      this.fightMenu.style.display = 'none';
      this.itemMenu.style.display = 'none';
      this.mainMenu.style.display = 'flex';
    }
  }

  show(monster) {
    this.bm.start(monster);

    // 스프라이트 색상
    this.playerSprite.style.background = this.gs.heroType === 'mage' ? '#ab47bc' : '#4fc3f7';
    this.enemySprite.style.background = monster.color;
    this.enemySprite.style.width = monster.isBoss ? '100px' : '80px';
    this.enemySprite.style.height = monster.isBoss ? '100px' : '80px';

    this.playerName.textContent = this.gs.storyData.heroName;
    this.enemyName.textContent = monster.name;

    this.mainMenu.style.display = 'flex';
    this.fightMenu.style.display = 'none';
    this.itemMenu.style.display = 'none';

    this._updateDisplay();
    this.el.classList.add('active');

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  hide() {
    this.el.classList.remove('active');
  }

  _updateDisplay() {
    const pHpPct = (this.gs.hp / this.gs.maxHp) * 100;
    this.playerHpBar.style.width = pHpPct + '%';
    this.playerHpBar.className = 'hp-bar' + (pHpPct < 30 ? ' low' : '');
    this.playerHpText.textContent = `${this.gs.hp}/${this.gs.maxHp}`;

    const eHpPct = (this.bm.enemyHp / this.bm.enemyMaxHp) * 100;
    this.enemyHpBar.style.width = eHpPct + '%';
    this.enemyHpBar.className = 'hp-bar' + (eHpPct < 30 ? ' low' : '');
    this.enemyHpText.textContent = `${this.bm.enemyHp}/${this.bm.enemyMaxHp}`;

    this.logEl.textContent = this.bm.log;
    this.potionCount.textContent = this.gs.potions;
  }
}
