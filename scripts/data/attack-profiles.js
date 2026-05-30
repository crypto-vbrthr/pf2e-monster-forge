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
    name: "Claw",
    damageType: "slashing",
    traits: ["agile", "finesse"]
  },

  bite: {
    name: "Bite",
    damageType: "piercing",
    traits: []
  },

  jaws: {
    name: "Jaws",
    damageType: "piercing",
    traits: ["deadly-d10"]
  },

  slam: {
    name: "Slam",
    damageType: "bludgeoning",
    traits: ["forceful"]
  },

  graveSlam: {
    name: "Grave Slam",
    damageType: "bludgeoning",
    traits: ["void"]
  },

  spear: {
    name: "Spear",
    damageType: "piercing",
    traits: ["reach"]
  },

  sword: {
    name: "Sword",
    damageType: "slashing",
    traits: ["versatile-p"]
  },

  greatsword: {
    name: "Greatsword",
    damageType: "slashing",
    traits: ["forceful"]
  },

  hellblade: {
    name: "Hellblade",
    damageType: "slashing",
    traits: ["unholy", "magical"]
  },

  holyBlade: {
    name: "Holy Blade",
    damageType: "slashing",
    traits: ["holy", "magical"]
  },

  radiantStrike: {
    name: "Radiant Strike",
    damageType: "spirit",
    traits: ["holy", "magical"]
  },

  spellRay: {
    name: "Spell Ray",
    damageType: "force",
    traits: ["magical", "range-60"]
  },

  staff: {
    name: "Staff",
    damageType: "bludgeoning",
    traits: ["magical", "two-hand-d8"]
  }
};
