export const ATTACK_PROFILES = {
  standard: {
    label: "PF2EMF.AttackProfiles.Standard",
    attacks: [
      {
        key: "primary",
        name: "Strike",
        attackAdjustment: 0,
        damageRank: "normal",
        traits: ["magical"],
        damageType: "bludgeoning"
      }
    ]
  },

  accurateAndHeavy: {
    label: "PF2EMF.AttackProfiles.AccurateAndHeavy",
    attacks: [
      {
        key: "accurate",
        name: "Precise Strike",
        attackAdjustment: 2,
        damageRank: "lower",
        traits: ["agile"],
        damageType: "piercing"
      },
      {
        key: "heavy",
        name: "Heavy Strike",
        attackAdjustment: -2,
        damageRank: "higher",
        traits: ["forceful"],
        damageType: "slashing"
      }
    ]
  }
};
