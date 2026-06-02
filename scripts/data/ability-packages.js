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
    save: "reflex",
    basicSave: true,
    description: "PF2EMF.AbilityDescriptions.DragonBreath"
  },

  frightfulPresence: {
    name: "PF2EMF.AbilityNames.FrightfulPresence",
    type: "passive",
    save: "will",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.FrightfulPresence"
  },

  voidHealing: {
    name: "PF2EMF.AbilityNames.VoidHealing",
    type: "passive",
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.VoidHealing"
  },

  graveChill: {
    name: "PF2EMF.AbilityNames.GraveChill",
    type: "action",
    actionCost: 1,
    save: "fortitude",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.GraveChill"
  },

  infernalCurse: {
    name: "PF2EMF.AbilityNames.InfernalCurse",
    type: "action",
    actionCost: 2,
    save: "will",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.InfernalCurse"
  },

  radiantAid: {
    name: "PF2EMF.AbilityNames.RadiantAid",
    type: "action",
    actionCost: 1,
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.RadiantAid"
  },

  constructBody: {
    name: "PF2EMF.AbilityNames.ConstructBody",
    type: "passive",
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.ConstructBody"
  },

  tricksterGlamour: {
    name: "PF2EMF.AbilityNames.TricksterGlamour",
    type: "reaction",
    save: "will",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.TricksterGlamour"
  },

  fireBurst: {
    name: "PF2EMF.AbilityNames.FireBurst",
    type: "action",
    actionCost: 2,
    save: "reflex",
    basicSave: true,
    description: "PF2EMF.AbilityDescriptions.FireBurst"
  },

  freezingAura: {
    name: "PF2EMF.AbilityNames.FreezingAura",
    type: "passive",
    save: "fortitude",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.FreezingAura"
  },

  regeneration: {
  name: "PF2EMF.AbilityNames.Regeneration",
  type: "passive",
  save: null,
  basicSave: false,
  damage: null,
  description: "PF2EMF.AbilityDescriptions.Regeneration"
},

  aura: {
    name: "PF2EMF.AbilityNames.Aura",
    type: "passive",
    save: "will",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.Aura"
  },

  deathBurst: {
    name: "PF2EMF.AbilityNames.DeathBurst",
    type: "reaction",
    save: "reflex",
    basicSave: true,
    description: "PF2EMF.AbilityDescriptions.DeathBurst"
  },

  packTactics: {
    name: "PF2EMF.AbilityNames.PackTactics",
    type: "passive",
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.PackTactics"
  },

  swallowWhole: {
    name: "PF2EMF.AbilityNames.SwallowWhole",
    type: "action",
    actionCost: 1,
    save: "fortitude",
    basicSave: false,
    description: "PF2EMF.AbilityDescriptions.SwallowWhole"
  },

  teleport: {
    name: "PF2EMF.AbilityNames.Teleport",
    type: "action",
    actionCost: 1,
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.Teleport"
  },

  invisibility: {
    name: "PF2EMF.AbilityNames.Invisibility",
    type: "action",
    actionCost: 2,
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.Invisibility"
  },

  spellcasting: {
    name: "PF2EMF.AbilityNames.Spellcasting",
    type: "passive",
    save: null,
    basicSave: false,
    damage: null,
    description: "PF2EMF.AbilityDescriptions.Spellcasting"
  }
};
