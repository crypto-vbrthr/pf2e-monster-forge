import { PF2E_CREATURE_STATS } from "../data/pf2e-stat-tables.js";
import { ROLE_PRESETS } from "../data/role-presets.js";
import { ABILITY_MODIFIERS } from "../data/ability-modifiers.js";
import { ROLE_SKILL_PRESETS, SKILL_LABELS } from "../data/skill-presets.js";
import { ATTACK_PROFILES } from "../data/attack-profiles.js";

export function generateMonsterDraft(input = {}) {
  const level = Number(input.level ?? 1);
  const role = input.role ?? "brute";
  const attackProfile = input.attackProfile ?? "standard";

  const preset =
    ROLE_PRESETS[role] ??
    ROLE_PRESETS.brute;

  const acRank = input.ac ?? preset.ac ?? "moderate";
  const hpRank = input.hp ?? preset.hp ?? "moderate";
  const fortRank = input.fortitude ?? preset.fortitude ?? "moderate";
  const reflexRank = input.reflex ?? preset.reflex ?? "moderate";
  const willRank = input.will ?? preset.will ?? "moderate";
  const attackRank = input.attack ?? preset.attack ?? "moderate";
  const damageRank = input.damage ?? preset.damage ?? "moderate";

  const baseAttack = getStat(level, "attack", attackRank);
  const baseDamage = getStat(level, "damage", damageRank);

  return {
    name: input.name || "Forged Monster",
    level,
    role,
    size: input.size ?? "med",
    traits: input.traits ?? [],

    ac: getStat(level, "ac", acRank),
    hp: getStat(level, "hp", hpRank),

    saves: {
      fortitude: getStat(level, "saves", fortRank),
      reflex: getStat(level, "saves", reflexRank),
      will: getStat(level, "saves", willRank)
    },

    attack: baseAttack,
    damage: baseDamage,

    abilities: generateAbilities(level, preset),
    skills: generateSkills(level, role),
    attacks: generateAttacks(level, baseAttack, damageRank, attackProfile)
  };
}

function generateAttacks(level, baseAttack, damageRank, profileKey) {
  const profile =
    ATTACK_PROFILES[profileKey] ??
    ATTACK_PROFILES.standard;

  return profile.attacks.map(attack => {
    const adjustedDamageRank = adjustDamageRank(
      damageRank,
      attack.damageRank
    );

    return {
      key: attack.key,
      name: attack.name,
      attack: baseAttack + Number(attack.attackAdjustment ?? 0),
      damage: getStat(level, "damage", adjustedDamageRank),
      damageType: attack.damageType ?? "bludgeoning",
      traits: attack.traits ?? []
    };
  });
}

function adjustDamageRank(baseRank, mode) {
  const ranks = [
    "terrible",
    "low",
    "moderate",
    "high",
    "extreme"
  ];

  const index = ranks.indexOf(baseRank);
  const safeIndex = index >= 0 ? index : 2;

  if (mode === "lower") {
    return ranks[Math.max(0, safeIndex - 1)];
  }

  if (mode === "higher") {
    return ranks[Math.min(ranks.length - 1, safeIndex + 1)];
  }

  return ranks[safeIndex];
}

function getStat(level, category, rank) {
  const levelTable =
    PF2E_CREATURE_STATS[level] ??
    PF2E_CREATURE_STATS[String(level)] ??
    PF2E_CREATURE_STATS[1];

  if (!levelTable) {
    console.warn(`PF2e Monster Forge | Missing level ${level}`);
    return fallback(category);
  }

  const categoryTable = levelTable[category];

  if (!categoryTable) {
    console.warn(`PF2e Monster Forge | Missing category ${category}`);
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

function generateAbilities(level, preset) {
  const abilityPreset = preset.abilities ?? {};

  return {
    str: getAbilityModifier(level, abilityPreset.str ?? "moderate"),
    dex: getAbilityModifier(level, abilityPreset.dex ?? "moderate"),
    con: getAbilityModifier(level, abilityPreset.con ?? "moderate"),
    int: getAbilityModifier(level, abilityPreset.int ?? "moderate"),
    wis: getAbilityModifier(level, abilityPreset.wis ?? "moderate"),
    cha: getAbilityModifier(level, abilityPreset.cha ?? "moderate")
  };
}

function getAbilityModifier(level, rank) {
  const table =
    ABILITY_MODIFIERS[level] ??
    ABILITY_MODIFIERS[String(level)] ??
    ABILITY_MODIFIERS[1];

  return (
    table?.[rank] ??
    table?.moderate ??
    0
  );
}

function generateSkills(level, role) {
  const skills =
    ROLE_SKILL_PRESETS[role] ??
    ROLE_SKILL_PRESETS.brute;

  const result = {};

  for (const [slug, rank] of Object.entries(skills)) {
    result[slug] = {
      label: SKILL_LABELS[slug] ?? slug,
      value: getSkillModifier(level, rank)
    };
  }

  return result;
}

function getSkillModifier(level, rank) {
  const base = Number(level);

  const ranks = {
    terrible: base + 0,
    low: base + 3,
    moderate: base + 5,
    high: base + 7,
    extreme: base + 9
  };

  return ranks[rank] ?? ranks.moderate;
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
