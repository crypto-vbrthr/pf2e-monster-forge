export const ADJUSTMENT_PROFILES = {
  normal: {
    label: "PF2EMF.Adjustments.Normal",
    modifier: 0,
    damage: 0,
    hpMode: "none"
  },

  weak: {
    label: "PF2EMF.Adjustments.Weak",
    modifier: -2,
    damage: -2,
    hpMode: "weak"
  },

  elite: {
    label: "PF2EMF.Adjustments.Elite",
    modifier: 2,
    damage: 2,
    hpMode: "elite"
  }
};

export function getHpAdjustment(level, hpMode) {
  if (hpMode === "none") return 0;

  const absoluteLevel = Number(level);

  let amount = 20;

  if (absoluteLevel <= 1) amount = 10;
  else if (absoluteLevel <= 4) amount = 15;
  else if (absoluteLevel >= 20) amount = 30;

  return hpMode === "weak" ? -amount : amount;
}
