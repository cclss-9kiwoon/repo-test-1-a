import { ELEMENTS, getMultiplier } from '../data/elements.js';

export class ElementSystem {
  constructor() {
    this.currentElement = ELEMENTS.FIRE;
  }

  setElement(element) {
    this.currentElement = element;
  }

  getElement() {
    return this.currentElement;
  }

  getDamageMultiplier(defenderElement) {
    return getMultiplier(this.currentElement, defenderElement);
  }

  getElementLabel(element) {
    const labels = {
      fire: '🔥 불',
      water: '💧 물',
      lightning: '⚡ 번개',
    };
    return labels[element] || element;
  }
}
