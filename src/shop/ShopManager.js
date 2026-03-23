export class ShopManager {
  constructor(gameState) {
    this.gs = gameState;
  }

  canBuyWeapon() {
    return this.gs.gold >= 100;
  }

  buyWeapon() {
    if (!this.canBuyWeapon()) return { success: false, msg: '골드가 부족합니다!' };
    this.gs.gold -= 100;
    if (!this.gs.weapon) {
      this.gs.weapon = { name: '검', attack: 5, enhance: 0 };
    } else {
      this.gs.weapon.attack += 5;
    }
    return { success: true, msg: `무기 구매! (공격력 +5, 현재 무기 공격력: ${this.gs.weapon.attack})` };
  }

  canBuyArmor() {
    return this.gs.gold >= 80;
  }

  buyArmor() {
    if (!this.canBuyArmor()) return { success: false, msg: '골드가 부족합니다!' };
    this.gs.gold -= 80;
    if (!this.gs.armor) {
      this.gs.armor = { name: '갑옷', defense: 3, enhance: 0 };
    } else {
      this.gs.armor.defense += 3;
    }
    return { success: true, msg: `갑옷 구매! (방어력 +3, 현재 갑옷 방어력: ${this.gs.armor.defense})` };
  }

  canBuyPotion() {
    return this.gs.gold >= 30 && this.gs.potions < this.gs.maxPotions;
  }

  buyPotion() {
    if (this.gs.potions >= this.gs.maxPotions) return { success: false, msg: '물약을 더 이상 가질 수 없습니다! (최대 5개)' };
    if (this.gs.gold < 30) return { success: false, msg: '골드가 부족합니다!' };
    this.gs.gold -= 30;
    this.gs.potions += 1;
    return { success: true, msg: `물약 구매! (보유: ${this.gs.potions}/${this.gs.maxPotions})` };
  }

  getEnhanceCost(item) {
    if (!item) return 0;
    return (item.enhance + 1) * 50;
  }

  canEnhance(item) {
    if (!item) return false;
    if (item.enhance >= 10) return false;
    return this.gs.gold >= this.getEnhanceCost(item);
  }

  enhance(item, itemType) {
    if (!item) return { success: false, msg: '먼저 아이템을 구매하세요!' };
    if (item.enhance >= 10) return { success: false, msg: '이미 최대 강화입니다!' };

    const cost = this.getEnhanceCost(item);
    if (this.gs.gold < cost) return { success: false, msg: '골드가 부족합니다!' };

    this.gs.gold -= cost;
    const currentEnhance = item.enhance;
    const roll = Math.random();

    if (currentEnhance < 5) {
      // +1~+4: 100% 성공
      item.enhance += 1;
      return { success: true, type: 'success', msg: `강화 성공! +${item.enhance}` };
    } else if (currentEnhance < 8) {
      // +5~+7: 70% 성공, 실패 시 수치 -1
      if (roll < 0.7) {
        item.enhance += 1;
        return { success: true, type: 'success', msg: `강화 성공! +${item.enhance}` };
      } else {
        item.enhance = Math.max(0, item.enhance - 1);
        return { success: false, type: 'fail', msg: `강화 실패... +${item.enhance}로 하락` };
      }
    } else if (currentEnhance < 10) {
      // +8~+9: 50% 성공, 실패 시 수치 -2 또는 파괴
      if (roll < 0.5) {
        item.enhance += 1;
        return { success: true, type: 'success', msg: `강화 성공! +${item.enhance}!` };
      } else if (roll < 0.75) {
        item.enhance = Math.max(0, item.enhance - 2);
        return { success: false, type: 'fail', msg: `강화 실패... +${item.enhance}로 하락` };
      } else {
        // 파괴
        if (itemType === 'weapon') {
          this.gs.weapon = null;
        } else {
          this.gs.armor = null;
        }
        return { success: false, type: 'destroy', msg: `강화 실패! 아이템이 파괴되었습니다!` };
      }
    }

    return { success: false, msg: '강화 불가' };
  }
}
