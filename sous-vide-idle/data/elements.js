export const ELEMENTS = {
  FIRE: 'fire',
  WATER: 'water',
  LIGHTNING: 'lightning',
};

// advantage[attacker][defender] = multiplier
const advantageTable = {
  fire:      { fire: 1.0, water: 0.5, lightning: 2.0 },
  water:     { fire: 2.0, water: 1.0, lightning: 0.5 },
  lightning: { fire: 0.5, water: 2.0, lightning: 1.0 },
};

export function getMultiplier(attackerElement, defenderElement) {
  return advantageTable[attackerElement]?.[defenderElement] ?? 1.0;
}
