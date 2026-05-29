import { ROLE_PRESETS } from "../data/role-presets.js";
import { SIZE_DATA } from "../data/size-data.js";
import { generateStats } from "./stats-generator.js";
import { generateAttacks } from "./attack-generator.js";

export function generateMonsterDraft(formData) {
  const level = Number(formData.level ?? 1);
  const roleKey = formData.role ?? "brute";
  const preset = ROLE_PRESETS[roleKey] ?? ROLE_PRESETS.brute;
  const traits = Array.isArray(formData.traits) ? formData.traits : [];

  const overrides = {
    hp: formData.hpRank,
    ac: formData.acRank,
    fortitude: formData.fortitudeRank,
    reflex: formData.reflexRank,
    will: formData.willRank,
    attack: formData.attackRank,
    damage: formData.damageRank
  };

  const stats = generateStats({ level, preset, overrides });
  const attacks = generateAttacks({ roleKey, stats, traits });

  return {
    name: formData.name?.trim() || game.i18n.localize("PF2EMF.defaultMonsterName"),
    level,
    roleKey,
    roleLabel: game.i18n.localize(preset.i18n),
    size: SIZE_DATA[formData.size ?? "med"]?.pf2e ?? "med",
    traits,
    stats,
    attacks
  };
}
