export class ShopUI {
  constructor(shopManager, gameState) {
    this.sm = shopManager;
    this.gs = gameState;
    this.el = document.getElementById('shop-screen');
    this.goldEl = document.getElementById('shop-gold');
    this.buyItems = document.getElementById('shop-buy-items');
    this.enhanceItems = document.getElementById('shop-enhance-items');
    this.enhanceResult = document.getElementById('enhance-result');
    this.btnClose = document.getElementById('btn-shop-close');
    this._resolve = null;

    this.btnClose.addEventListener('click', () => {
      if (this._resolve) {
        this._resolve();
        this._resolve = null;
      }
    });
  }

  show() {
    this._render();
    this.enhanceResult.textContent = '';
    this.enhanceResult.className = 'enhance-result';
    this.el.classList.add('active');

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  hide() {
    this.el.classList.remove('active');
  }

  _render() {
    this.goldEl.textContent = this.gs.gold;

    // 구매 아이템
    this.buyItems.innerHTML = '';
    this._addBuyItem('무기 (공격력 +5)', '100 Gold', () => {
      const r = this.sm.buyWeapon();
      this._showResult(r);
    });
    this._addBuyItem('갑옷 (방어력 +3)', '80 Gold', () => {
      const r = this.sm.buyArmor();
      this._showResult(r);
    });
    this._addBuyItem(`물약 (HP 30% 회복) [${this.gs.potions}/${this.gs.maxPotions}]`, '30 Gold', () => {
      const r = this.sm.buyPotion();
      this._showResult(r);
    });

    // 강화 아이템
    this.enhanceItems.innerHTML = '';
    if (this.gs.weapon) {
      const cost = this.sm.getEnhanceCost(this.gs.weapon);
      this._addEnhanceItem(
        `무기 +${this.gs.weapon.enhance} (공격: ${this.gs.weapon.attack})`,
        `강화비용: ${cost} Gold`,
        () => {
          const r = this.sm.enhance(this.gs.weapon, 'weapon');
          this._showEnhanceResult(r);
        }
      );
    }
    if (this.gs.armor) {
      const cost = this.sm.getEnhanceCost(this.gs.armor);
      this._addEnhanceItem(
        `갑옷 +${this.gs.armor.enhance} (방어: ${this.gs.armor.defense})`,
        `강화비용: ${cost} Gold`,
        () => {
          const r = this.sm.enhance(this.gs.armor, 'armor');
          this._showEnhanceResult(r);
        }
      );
    }
    if (!this.gs.weapon && !this.gs.armor) {
      this.enhanceItems.innerHTML = '<div style="color:#888;padding:8px;">강화할 장비가 없습니다. 먼저 구매하세요!</div>';
    }
  }

  _addBuyItem(name, price, onClick) {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <div class="item-info">
        <div class="item-name">${name}</div>
      </div>
      <button class="btn" style="padding:6px 16px;font-size:14px;">${price}</button>
    `;
    div.querySelector('button').addEventListener('click', onClick);
    this.buyItems.appendChild(div);
  }

  _addEnhanceItem(name, cost, onClick) {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <div class="item-info">
        <div class="item-name">${name}</div>
        <div class="item-desc">+5 이상 실패 가능 / +8 이상 파괴 가능</div>
      </div>
      <button class="btn" style="padding:6px 16px;font-size:14px;">${cost}</button>
    `;
    div.querySelector('button').addEventListener('click', onClick);
    this.enhanceItems.appendChild(div);
  }

  _showResult(r) {
    this.enhanceResult.textContent = r.msg;
    this.enhanceResult.className = 'enhance-result ' + (r.success ? 'success' : 'fail');
    this._render();
  }

  _showEnhanceResult(r) {
    this.enhanceResult.textContent = r.msg;
    this.enhanceResult.className = 'enhance-result ' + (r.type || (r.success ? 'success' : 'fail'));
    this._render();
  }
}
