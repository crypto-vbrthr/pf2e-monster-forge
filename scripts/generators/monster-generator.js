import { PF2E_CREATURE_STATS } from "../data/pf2e-stat-tables.js";
import { ROLE_PRESETS } from "../data/role-presets.js";

export function generateMonsterDraft(input = {}) {
  const level = Number(input.level ?? 1);
  const role = input.role ?? "brute";

  const preset =
    ROLE_PRESETS[role] ??
    ROLE_PRESETS.brute;

  const acRank =
    input.ac ??
    preset.ac ??
    "moderate";

  const hpRank =
    input.hp ??
    preset.hp ??
    "moderate";

  const fortRank =
    input.fortitude ??
    preset.fortitude ??
    "moderate";

  const reflexRank =
    input.reflex ??
    preset.reflex ??
    "moderate";

  const willRank =
    input.will ??
    preset.will ??
    "moderate";

  const attackRank =
    input.attack ??
    preset.attack ??
    "moderate";

  const damageRank =
    input.damage ??
    preset.damage ??
    "moderate";

  return {
    name: input.name || "Forged Monster",

    level,
    role,

    size: input.size ?? "med",

    traits: input.traits ?? [],

    ac: getStat(
      level,
      "ac",
      acRank
    ),

    hp: getStat(
      level,
      "hp",
      hpRank
    ),

    saves: {
      fortitude: getStat(
        level,
        "saves",
        fortRank
      ),

      reflex: getStat(
        level,
        "saves",
        reflexRank
      ),

      will: getStat(
        level,
        "saves",
        willRank
      )
    },

    attack: getStat(
      level,
      "attack",
      attackRank
    ),

    damage: getStat(
      level,
      "damage",
      damageRank
    ),

    abilities: generateAbilities(
      level,
      preset
    )
  };
}

function getStat(
  level,
  category,
  rank
) {
  const levelTable =
    PF2E_CREATURE_STATS[level] ??
    PF2E_CREATURE_STATS[String(level)] ??
    PF2E_CREATURE_STATS[1];

  if (!levelTable) {
    console.warn(
      `PF2e Monster Forge | Missing level ${level}`
    );

    return fallback(category);
  }

  const categoryTable =
    levelTable[category];

  if (!categoryTable) {
    console.warn(
      `PF2e Monster Forge | Missing category ${category}`
    );

    return fallback(category);
  }

  const value =
    categoryTable[rank] ??
    categoryTable.moderate;

  if (value === undefined) {
    return fallback(category);
  }

  return value;
}

function generateAbilities(
  level,
  preset
) {
  const abilityPreset =
    preset.abilities ?? {};

  return {
    str: getAbilityModifier(
      level,
      abilityPreset.str ?? "moderate"
    ),

    dex: getAbilityModifier(
      level,
      abilityPreset.dex ?? "moderate"
    ),

    con: getAbilityModifier(
      level,
      abilityPreset.con ?? "moderate"
    ),

    int: getAbilityModifier(
      level,
      abilityPreset.int ?? "moderate"
    ),

    wis: getAbilityModifier(
      level,
      abilityPreset.wis ?? "moderate"
    ),

    cha: getAbilityModifier(
      level,
      abilityPreset.cha ?? "moderate"
    )
  };
}

function getAbilityModifier(
  level,
  rank
) {
  const safeLevel =
    Math.max(
      0,
      Number(level)
    );

  const tier =
    Math.floor(
      safeLevel / 5
    );

  const values = {
    terrible: -1 + tier,
    low: 0 + tier,
    moderate: 2 + tier,
    high: 4 + tier,
    extreme: 5 + tier
  };

  return (
    values[rank] ??
    values.moderate
  );
}

function fallback(category) {
  switch (category) {
    case "ac":
      return 15;

    case "hp":
      return 20;

    case "saves":
      return 5;

    case "attack":
      return 7;

    case "damage":
      return "1d6+3";

    default:
      return 0;
  }
}
