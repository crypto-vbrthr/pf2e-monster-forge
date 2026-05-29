export function generateAttacks({ roleKey, stats, traits }) {
  const isCaster = roleKey === "spellcaster";
  const damageType = traits.includes("fire") ? "fire" : traits.includes("cold") ? "cold" : "slashing";

  if (isCaster) {
    return [
      {
        name: game.i18n.localize("PF2EMF.attack.energyBolt"),
        type: "ranged",
        bonus: stats.attack,
        damage: stats.damage,
        damageType: damageType === "slashing" ? "force" : damageType,
        range: 60
      }
    ];
  }

  return [
    {
      name: game.i18n.localize("PF2EMF.attack.primaryStrike"),
      type: "melee",
      bonus: stats.attack,
      damage: stats.damage,
      damageType,
      traits: ["magical"]
    }
  ];
}
