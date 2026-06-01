export const ABILITY_PACKAGES = {
  dragon: ["dragonBreath", "frightfulPresence"],
  undead: ["voidHealing", "graveChill"],
  fiend: ["infernalCurse"],
  celestial: ["radiantAid"],
  construct: ["constructBody"],
  fey: ["tricksterGlamour"],
  fire: ["fireBurst"],
  cold: ["freezingAura"]
};

export const MONSTER_ABILITIES = {
  dragonBreath: {
    name: "PF2EMF.AbilityNames.DragonBreath",
    type: "action",
    actionCost: 2,
    description: "PF2EMF.AbilityDescriptions.DragonBreath"
  },

  frightfulPresence: {
    name: "PF2EMF.AbilityNames.FrightfulPresence",
    type: "passive",
    description: "PF2EMF.AbilityDescriptions.FrightfulPresence"
  },

  voidHealing: {
    name: "PF2EMF.AbilityNames.VoidHealing",
    type: "passive",
    description: "PF2EMF.AbilityDescriptions.VoidHealing"
  },

  graveChill: {
    name: "PF2EMF.AbilityNames.GraveChill",
    type: "action",
    actionCost: 1,
    description: "PF2EMF.AbilityDescriptions.GraveChill"
  },

  infernalCurse: {
    name: "PF2EMF.AbilityNames.InfernalCurse",
    type: "action",
    actionCost: 2,
    description: "PF2EMF.AbilityDescriptions.InfernalCurse"
  },

  radiantAid: {
    name: "PF2EMF.AbilityNames.RadiantAid",
    type: "action",
    actionCost: 1,
    description: "PF2EMF.AbilityDescriptions.RadiantAid"
  },

  constructBody: {
    name: "PF2EMF.AbilityNames.ConstructBody",
    type: "passive",
    description: "PF2EMF.AbilityDescriptions.ConstructBody"
  },

  tricksterGlamour: {
    name: "PF2EMF.AbilityNames.TricksterGlamour",
    type: "reaction",
    description: "PF2EMF.AbilityDescriptions.TricksterGlamour"
  },

  fireBurst: {
    name: "PF2EMF.AbilityNames.FireBurst",
    type: "action",
    actionCost: 2,
    description: "PF2EMF.AbilityDescriptions.FireBurst"
  },

  freezingAura: {
    name: "PF2EMF.AbilityNames.FreezingAura",
    type: "passive",
    description: "PF2EMF.AbilityDescriptions.FreezingAura"
  }
};
