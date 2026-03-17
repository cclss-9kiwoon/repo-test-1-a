export const ELEMENTS = {
  FIRE: 'fire',
  WATER: 'water',
  LIGHTNING: 'lightning',
};

// advantage[attacker][defender] = multiplier
const advantageTable = {
  fire:      { fire: 1.0, water: 0.7, lightning: 1.5 },
  water:     { fire: 1.5, water: 1.0, lightning: 0.7 },
  lightning: { fire: 0.7, water: 1.5, lightning: 1.0 },
};

export function getMultiplier(attackerElement, defenderElement) {
  return advantageTable[attackerElement]?.[defenderElement] ?? 1.0;
}
