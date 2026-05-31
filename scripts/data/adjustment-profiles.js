export const ADJUSTMENT_PROFILES = {
  normal: {
    label: "PF2EMF.Adjustments.Normal",
    ac: 0,
    perception: 0,
    saves: 0,
    attack: 0,
    damageStep: 0,
    skill: 0,
    hpMultiplier: 1
  },

  weak: {
    label: "PF2EMF.Adjustments.Weak",
    ac: -2,
    perception: -2,
    saves: -2,
    attack: -2,
    damageStep: -1,
    skill: -2,
    hpMultiplier: 0.8
  },

  elite: {
    label: "PF2EMF.Adjustments.Elite",
    ac: 2,
    perception: 2,
    saves: 2,
    attack: 2,
    damageStep: 1,
    skill: 2,
    hpMultiplier: 1.2
  }
};
