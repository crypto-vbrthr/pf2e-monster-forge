export const ATTACK_PROFILES = {
  standard: {
    label: "PF2EMF.AttackProfiles.Standard",
    mode: "standard"
  },

  accurateAndHeavy: {
    label: "PF2EMF.AttackProfiles.AccurateAndHeavy",
    mode: "accurateAndHeavy"
  }
};

export const ROLE_ATTACK_STYLES = {
  brute: {
    preferred: "naturalHeavy",
    accurate: "claw",
    heavy: "slam"
  },

  soldier: {
    preferred: "weapon",
    accurate: "spear",
    heavy: "greatsword"
  },

  skirmisher: {
    preferred: "naturalFast",
    accurate: "claw",
    heavy: "bite"
  },

  spellcaster: {
    preferred: "magical",
    accurate: "spellRay",
    heavy: "staff"
  }
};

export const TRAIT_ATTACK_OVERRIDES = {
  animal: {
    preferred: "naturalFast",
    accurate: "claw",
    heavy: "bite"
  },

  beast: {
    preferred: "naturalHeavy",
    accurate: "claw",
    heavy: "jaws"
  },

  dragon: {
    preferred: "dragon",
    accurate: "claw",
    heavy: "jaws"
  },

  undead: {
    preferred: "undead",
    accurate: "claw",
    heavy: "graveSlam"
  },

  fiend: {
    preferred: "fiend",
    accurate: "claw",
    heavy: "hellblade"
  },

  celestial: {
    preferred: "celestial",
    accurate: "radiantStrike",
    heavy: "holyBlade"
  },

  humanoid: {
    preferred: "weapon",
    accurate: "spear",
    heavy: "sword"
  },

  fire: {
    damageType: "fire",
    extraTrait: "fire"
  },

  cold: {
    damageType: "cold",
    extraTrait: "cold"
  },

  electricity: {
    damageType: "electricity",
    extraTrait: "electricity"
  },

  acid: {
    damageType: "acid",
    extraTrait: "acid"
  }
};

export const ATTACK_TEMPLATES = {
  claw: {
  name: "PF2EMF.Attacks.Claw",
  damageType: "slashing",
  traits: ["agile", "finesse"]
},

  bite: {
    name: "PF2EMF.Attacks.Bite",
    damageType: "piercing",
    traits: []
  },

  jaws: {
    name: "PF2EMF.Attacks.Jaws",
    damageType: "piercing",
    traits: ["deadly-d10"]
  },

  slam: {
    name: "PF2EMF.Attacks.Slam",
    damageType: "bludgeoning",
    traits: ["forceful"]
  },

  graveSlam: {
    name: "PF2EMF.Attacks.GraveSlam",
    damageType: "bludgeoning",
    traits: ["void"]
  },

  spear: {
    name: "PF2EMF.Attacks.Spear",
    damageType: "piercing",
    traits: ["reach"]
  },

  sword: {
    name: "PF2EMF.Attacks.Sword",
    damageType: "slashing",
    traits: ["versatile-p"]
  },

  greatsword: {
    name: "PF2EMF.Attacks.Greatsword",
    damageType: "slashing",
    traits: ["forceful"]
  },

  hellblade: {
    name: "PF2EMF.Attacks.Hellblade",
    damageType: "slashing",
    traits: ["unholy", "magical"]
  },

  holyBlade: {
    name: "PF2EMF.Attacks.HolyBlade",
    damageType: "slashing",
    traits: ["holy", "magical"]
  },

  radiantStrike: {
    name: "PF2EMF.Attacks.RadiantStrike",
    damageType: "spirit",
    traits: ["holy", "magical"]
  },

  spellRay: {
    name: "PF2EMF.Attacks.SpellRay",
    damageType: "force",
    traits: ["magical", "range-60"]
  },

  staff: {
    name: "PF2EMF.Attacks.Staff",
    damageType: "bludgeoning",
    traits: ["magical", "two-hand-d8"]
  }
};
