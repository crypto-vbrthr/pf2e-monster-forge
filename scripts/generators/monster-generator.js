import {
  PF2E_CREATURE_STATS,
  PF2E_PERCEPTION_STATS
} from "../data/pf2e-stat-tables.js";

import { ROLE_PRESETS } from "../data/role-presets.js";
import { ABILITY_MODIFIERS } from "../data/ability-modifiers.js";
import {
  ROLE_SKILL_PRESETS,
  SKILL_FALLBACK_LABELS
} from "../data/skill-presets.js";
import { TRAIT_EFFECTS, scaleTraitValue } from "../data/trait-effects.js";

import {
  ADJUSTMENT_PROFILES,
  getHpAdjustment
} from "../data/adjustment-profiles.js";

import {
  ATTACK_PROFILES,
  ROLE_ATTACK_STYLES,
  TRAIT_ATTACK_OVERRIDES,
  ATTACK_TEMPLATES
} from "../data/attack-profiles.js";

import {
  ABILITY_PACKAGES,
  MONSTER_ABILITIES
} from "../data/ability-packages.js"

import {
  SPELL_PACKAGES,
  SPELL_LABELS,
  SPELL_TRAIT_PREFERENCES,
  SPELL_FAMILY_PREFERENCES
} from "../data/spell-packages.js";


export function generateMonsterDraft(input = {}) {
  const level = Number(input.level ?? 1);
  const role = input.role ?? "brute";
  const traits = input.traits ?? [];
  const attackProfile = input.attackProfile ?? "standard";

  const adjustmentKey = input.adjustment ?? "normal";
  const adjustment =
    ADJUSTMENT_PROFILES[adjustmentKey] ??
    ADJUSTMENT_PROFILES.normal;

  const adjustmentMod = Number(adjustment.modifier ?? 0);

  const preset =
    ROLE_PRESETS[role] ??
    ROLE_PRESETS.brute;

  const acRank = input.ac ?? preset.ac ?? "moderate";
  const hpRank = input.hp ?? preset.hp ?? "moderate";
  const perceptionRank = input.perception ?? preset.perception ?? "moderate";
  const fortRank = input.fortitude ?? preset.fortitude ?? "moderate";
  const reflexRank = input.reflex ?? preset.reflex ?? "moderate";
  const willRank = input.will ?? preset.will ?? "moderate";
  const attackRank = input.attack ?? preset.attack ?? "moderate";
  const damageRank = input.damage ?? preset.damage ?? "moderate";

  const baseAttack = getStat(level, "attack", attackRank);
  const baseDamage = getStat(level, "damage", damageRank);

  const traitEffects = generateTraitEffects(level, traits);
  const abilities = generateAbilities(level, preset, traitEffects);
  const specialAbilities = generateSpecialAbilities(
    level,
    traits,
    input
  );

  const spellcasting = generateSpellcasting(level, input, traits);

  const skills = applySkillAdjustment(
    generateSkills(level, role, traitEffects),
    adjustmentMod
  );

  const perception =
    getPerception(level, perceptionRank, traits) + adjustmentMod;

  return {
    name: input.name || "Forged Monster",
    level,
    role,
    size: input.size ?? "med",
    adjustment: adjustmentKey,

    traits,
    extraTraits: traitEffects.extraTraits,

    ac: getStat(level, "ac", acRank) + adjustmentMod,

    hp: Math.max(
      1,
      getStat(level, "hp", hpRank) +
        getHpAdjustment(level, adjustment.hpMode)
    ),

    perception,

    saves: {
      fortitude: getStat(level, "saves", fortRank) + adjustmentMod,
      reflex: getStat(level, "saves", reflexRank) + adjustmentMod,
      will: getStat(level, "saves", willRank) + adjustmentMod
    },

    attack: baseAttack + adjustmentMod,
    damage: adjustDamageFormula(baseDamage, adjustment.damage),

    abilities,
    skills,
    specialAbilities,
    spellcasting,

    senses: traitEffects.senses,
    speeds: traitEffects.speeds,
    languages: traitEffects.languages,
    resistances: traitEffects.resistances,
    weaknesses: traitEffects.weaknesses,
    immunities: traitEffects.immunities,

    attacks: generateAttacks(
      level,
      baseAttack + adjustmentMod,
      damageRank,
      attackProfile,
      role,
      traits,
      adjustment.damage
    )
  };
}

function generateTraitEffects(level, traits = []) {
  const result = {
    senses: [],
    speeds: {
      land: 25
    },
    languages: [],
    resistances: {},
    weaknesses: {},
    immunities: [],
    extraTraits: [],
    skillOverrides: {},
    abilityOverrides: {}
  };

  for (const trait of traits) {
    const effect = TRAIT_EFFECTS[trait];
    if (!effect) continue;

    for (const sense of effect.senses ?? []) {
      if (!result.senses.includes(sense)) {
        result.senses.push(sense);
      }
    }

    for (const language of effect.languages ?? []) {
      if (!result.languages.includes(language)) {
        result.languages.push(language);
      }
    }

    for (const immunity of effect.immunities ?? []) {
      if (!result.immunities.includes(immunity)) {
        result.immunities.push(immunity);
      }
    }

    for (const extraTrait of effect.traits ?? []) {
      if (!result.extraTraits.includes(extraTrait)) {
        result.extraTraits.push(extraTrait);
      }
    }

    for (const [speed, value] of Object.entries(effect.speeds ?? {})) {
      result.speeds[speed] = Math.max(
        result.speeds[speed] ?? 0,
        value
      );
    }

    for (const [type, value] of Object.entries(effect.resistances ?? {})) {
      result.resistances[type] = Math.max(
        result.resistances[type] ?? 0,
        scaleTraitValue(level, value)
      );
    }

    for (const [type, value] of Object.entries(effect.weaknesses ?? {})) {
      result.weaknesses[type] = Math.max(
        result.weaknesses[type] ?? 0,
        scaleTraitValue(level, value)
      );
    }

    Object.assign(result.skillOverrides, effect.skills ?? {});
    Object.assign(result.abilityOverrides, effect.abilityOverrides ?? {});
  }

  return result;
}

function generateSpecialAbilities(level, traits = [], input = {}) {
  const abilityKeys = new Set();

  const autoAbilities = input.autoAbilities !== false;
  const selectedAbilities = Array.isArray(input.selectedAbilities)
    ? input.selectedAbilities
    : [];

  if (autoAbilities) {
    for (const trait of traits) {
      const packageAbilities = ABILITY_PACKAGES[trait] ?? [];

      for (const abilityKey of packageAbilities) {
        abilityKeys.add(abilityKey);
      }
    }
  }

  for (const abilityKey of selectedAbilities) {
    abilityKeys.add(abilityKey);
  }

  return [...abilityKeys]
    .map(key => buildSpecialAbility(key, level))
    .filter(Boolean);
}

function buildSpecialAbility(key, level) {
  const ability = MONSTER_ABILITIES[key];

  if (!ability) return null;

  return {
    key,
    name: ability.name,
    type: ability.type ?? "passive",
    actionCost: ability.actionCost ?? null,
    description: ability.description,
    dc: ability.save ? getAbilityDC(level) : null,
    save: ability.save ?? null,
    basicSave: Boolean(ability.basicSave),
    damage: ability.damage === null ? null : getAbilityDamage(level)
  };
}

function getAbilityDamage(level) {
  const table =
    PF2E_CREATURE_STATS[level] ??
    PF2E_CREATURE_STATS[String(level)] ??
    PF2E_CREATURE_STATS[1];

  return table?.damage?.moderate ?? "1d6";
}

function getAbilityDC(level) {
  const table =
    PF2E_CREATURE_STATS[level] ??
    PF2E_CREATURE_STATS[String(level)] ??
    PF2E_CREATURE_STATS[1];

  const spellDc =
    table?.dc?.moderate ??
    table?.spellDc?.moderate;

  if (spellDc) return spellDc;

  return 14 + Number(level);
}

function getPerception(level, rank, traits = []) {
  const table =
    PF2E_PERCEPTION_STATS[level] ??
    PF2E_PERCEPTION_STATS[String(level)] ??
    PF2E_PERCEPTION_STATS[1];

  const value =
    table?.[rank] ??
    table?.moderate ??
    0;

  return value + getPerceptionTraitModifier(traits);
}

function getPerceptionTraitModifier(traits = []) {
  let modifier = 0;

  if (traits.includes("animal")) {
    modifier += 2;
  }

  if (traits.includes("dragon")) {
    modifier += 2;
  }

  if (traits.includes("beast")) {
    modifier += 1;
  }

  if (traits.includes("construct")) {
    modifier -= 2;
  }

  return modifier;
}

function generateAttacks(
  level,
  baseAttack,
  damageRank,
  profileKey,
  role = "brute",
  traits = [],
  damageAdjustment = 0
) {
  const profile =
    ATTACK_PROFILES[profileKey] ??
    ATTACK_PROFILES.standard;

  const style = resolveAttackStyle(role, traits);
  const elemental = resolveElementalTrait(traits);

  if (profile.mode === "accurateAndHeavy") {
    return [
      buildAttack({
        key: "accurate",
        templateKey: style.accurate,
        level,
        attack: baseAttack + 2,
        damageRank: adjustDamageRank(damageRank, "lower"),
        elemental,
        damageAdjustment
      }),

      buildAttack({
        key: "heavy",
        templateKey: style.heavy,
        level,
        attack: baseAttack - 2,
        damageRank: adjustDamageRank(damageRank, "higher"),
        elemental,
        damageAdjustment
      })
    ];
  }

  return [
    buildAttack({
      key: "primary",
      templateKey:
        style.heavy ??
        style.accurate ??
        "slam",
      level,
      attack: baseAttack,
      damageRank,
      elemental,
      damageAdjustment
    })
  ];
}

function resolveAttackStyle(role, traits = []) {
  const base =
    ROLE_ATTACK_STYLES[role] ??
    ROLE_ATTACK_STYLES.brute;

  for (const trait of traits) {
    const override = TRAIT_ATTACK_OVERRIDES[trait];

    if (override?.preferred) {
      return {
        ...base,
        ...override
      };
    }
  }

  return base;
}

function resolveElementalTrait(traits = []) {
  for (const trait of traits) {
    const override = TRAIT_ATTACK_OVERRIDES[trait];

    if (override?.damageType || override?.extraTrait) {
      return override;
    }
  }

  return null;
}

function buildAttack({
  key,
  templateKey,
  level,
  attack,
  damageRank,
  elemental,
  damageAdjustment = 0
}) {
  const template =
    ATTACK_TEMPLATES[templateKey] ??
    ATTACK_TEMPLATES.slam;

  const traits = [
    ...(template.traits ?? [])
  ];

  if (elemental?.extraTrait && !traits.includes(elemental.extraTrait)) {
    traits.push(elemental.extraTrait);
  }

  const baseDamage = getStat(level, "damage", damageRank);

  return {
    key,
    name: localizeMaybe(template.name, template.name),
    attack,
    damage: adjustDamageFormula(baseDamage, damageAdjustment),
    damageType: elemental?.damageType ?? template.damageType ?? "bludgeoning",
    traits
  };
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

function adjustDamageFormula(formula, adjustment = 0) {
  const amount = Number(adjustment ?? 0);
  if (!amount) return formula;

  if (amount > 0) return `${formula}+${amount}`;
  return `${formula}${amount}`;
}

function getStat(level, category, rank) {
  const levelTable =
    PF2E_CREATURE_STATS[level] ??
    PF2E_CREATURE_STATS[String(level)] ??
    PF2E_CREATURE_STATS[1];

  if (!levelTable) {
    return fallback(category);
  }

  const categoryTable = levelTable[category];

  if (!categoryTable) {
    return fallback(category);
  }

  return (
    categoryTable[rank] ??
    categoryTable.moderate ??
    fallback(category)
  );
}

function generateAbilities(level, preset, traitEffects = {}) {
  const abilityPreset = {
    ...(preset.abilities ?? {}),
    ...(traitEffects.abilityOverrides ?? {})
  };

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

function generateSkills(level, role, traitEffects = {}) {
  const skills = {
    ...(ROLE_SKILL_PRESETS[role] ?? ROLE_SKILL_PRESETS.brute),
    ...(traitEffects.skillOverrides ?? {})
  };

  const result = {};

  for (const [slug, rank] of Object.entries(skills)) {
    result[slug] = {
      label:
        game.i18n.localize(`PF2EMF.Skills.${slug}`) !== `PF2EMF.Skills.${slug}`
          ? game.i18n.localize(`PF2EMF.Skills.${slug}`)
          : (SKILL_FALLBACK_LABELS[slug] ?? slug),
      value: getSkillModifier(level, rank)
    };
  }

  return result;
}

function getSkillModifier(level, rank) {
  const base = Number(level);

  const ranks = {
    terrible: base + 2,
    low: base + 5,
    moderate: base + 8,
    high: base + 11,
    extreme: base + 13
  };

  return ranks[rank] ?? ranks.moderate;
}

function applySkillAdjustment(skills, modifier) {
  const result = {};

  for (const [slug, skill] of Object.entries(skills ?? {})) {
    result[slug] = {
      ...skill,
      value: Number(skill.value ?? 0) + Number(modifier ?? 0)
    };
  }

  return result;
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

function localizeMaybe(key, fallback) {
  if (typeof key !== "string") return String(fallback ?? "");

  const localized = game.i18n.localize(key);
  return localized && localized !== key
    ? localized
    : String(fallback ?? key);
}

function generateSpellcasting(level, input = {}, traits = []) {
  if (!input.spellcasting) return null;

  const tradition = input.spellTradition ?? "arcane";
  const style = input.spellStyle ?? "artillery";
  const listStyle = input.spellListStyle ?? "bestiary";

  const dc = getAbilityDC(level);
  const attack = dc - 8;

  const spellKeys = pickSpells(level, tradition, style, listStyle, {
    traits,
    family: input.family
  });

  return {
    enabled: true,
    tradition,
    style,
    listStyle,
    dc,
    attack,
    spells: spellKeys.map(key => ({
      key,
      name: key
    }))
  };
}

function pickSpells(level, tradition, style, listStyle, context = {}) {
  const pack =
    SPELL_PACKAGES[style]?.[tradition] ??
    SPELL_PACKAGES.artillery?.[tradition] ??
    SPELL_PACKAGES.artillery.arcane;

  const tiers = getSpellTiers(level);
  const weighted = [];

  // Basiszauber aus Stil + Tradition
  for (const tier of tiers) {
    addWeighted(weighted, pack[tier] ?? [], 1);
  }

  // Familienpräferenzen stärker gewichten
  const familyPrefs = SPELL_FAMILY_PREFERENCES[context.family] ?? {};
  for (const tier of tiers) {
    addWeighted(weighted, familyPrefs[tier] ?? [], 3);
  }

  // Traitpräferenzen mittel gewichten
  for (const trait of context.traits ?? []) {
    const traitPrefs = SPELL_TRAIT_PREFERENCES[trait] ?? {};
    for (const tier of tiers) {
      addWeighted(weighted, traitPrefs[tier] ?? [], 2);
    }
  }

  const ordered = collapseWeighted(weighted);

  if (listStyle === "few") return ordered.slice(0, 2);
  if (listStyle === "full") return ordered.slice(0, 8);

  return ordered.slice(0, 5);
}

function addWeighted(target, spells = [], weight = 1) {
  for (const spell of spells) {
    target.push({
      spell,
      weight
    });
  }
}

function collapseWeighted(entries = []) {
  const scores = new Map();

  for (const entry of entries) {
    scores.set(
      entry.spell,
      (scores.get(entry.spell) ?? 0) + entry.weight
    );
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([spell]) => spell);
}

function getSpellTiers(level) {
  if (level <= 4) return ["low"];
  if (level <= 10) return ["mid", "low"];
  return ["high", "mid", "low"];
}
