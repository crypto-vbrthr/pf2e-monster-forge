export function registerMonsterForgeSettings() {
  game.settings.register("pf2e-monster-forge", "defaultLevel", {
    name: "PF2EMF.settings.defaultLevel.name",
    hint: "PF2EMF.settings.defaultLevel.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 1,
    range: { min: 0, max: 20, step: 1 }
  });
}
