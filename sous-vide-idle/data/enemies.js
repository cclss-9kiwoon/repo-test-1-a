import { ELEMENTS } from './elements.js';

export const ENEMIES = [
  { name: '사슴 (Deer)',     emoji: '🦌', baseHp: 40,  baseAttack: 4,  element: ELEMENTS.WATER },
  { name: '하이에나 (Hyena)', emoji: '🐺', baseHp: 50,  baseAttack: 6,  element: ELEMENTS.FIRE },
  { name: '얼룩말 (Zebra)',   emoji: '🦓', baseHp: 55,  baseAttack: 5,  element: ELEMENTS.LIGHTNING },
  { name: '타조 (Ostrich)',   emoji: '🐦', baseHp: 45,  baseAttack: 7,  element: ELEMENTS.WATER },
  { name: '늑대 (Wolf)',      emoji: '🐺', baseHp: 60,  baseAttack: 8,  element: ELEMENTS.FIRE },
  { name: '독수리 (Eagle)',   emoji: '🦅', baseHp: 50,  baseAttack: 9,  element: ELEMENTS.LIGHTNING },
  { name: '기린 (Giraffe)',   emoji: '🦒', baseHp: 80,  baseAttack: 6,  element: ELEMENTS.WATER },
  { name: '곰 (Bear)',       emoji: '🐻', baseHp: 100, baseAttack: 10, element: ELEMENTS.FIRE },
  { name: '사자 (Lion)',      emoji: '🦁', baseHp: 120, baseAttack: 12, element: ELEMENTS.LIGHTNING },
  { name: '코끼리 (Elephant)',emoji: '🐘', baseHp: 150, baseAttack: 8,  element: ELEMENTS.WATER },
];
