export const ATTACK_PROFILES = {
  bite: { label: "PF2EMF.Attacks.Bite", damageType: "piercing", traits: ["unarmed"] },
  claw: { label: "PF2EMF.Attacks.Claw", damageType: "slashing", traits: ["agile", "unarmed"] },
  slam: { label: "PF2EMF.Attacks.Slam", damageType: "bludgeoning", traits: ["unarmed"] },
  weapon: { label: "PF2EMF.Attacks.Weapon", damageType: "slashing", traits: [] },
  staff: { label: "PF2EMF.Attacks.Staff", damageType: "bludgeoning", traits: ["two-hand-d8"] },
  ranged: { label: "PF2EMF.Attacks.Ranged", damageType: "piercing", traits: ["range-increment-60"] },
  spell: { label: "PF2EMF.Attacks.Spell", damageType: "force", traits: ["magical", "range-increment-120"] },
  grab: { label: "PF2EMF.Attacks.Grab", damageType: "bludgeoning", traits: ["grab", "unarmed"] },
  shield: { label: "PF2EMF.Attacks.Shield", damageType: "bludgeoning", traits: ["shove"] }
};
