import { PF2E_STAT_TABLES } from "../data/pf2e-stat-tables.js";

export function generateStats({ level, preset, overrides = {} }) {
  const table = PF2E_STAT_TABLES[level] ?? PF2E_STAT_TABLES[1];
  const pick = (group, key, fallback = "moderate") => {
    const rank = overrides[key] ?? preset[key] ?? fallback;
    return table[group]?.[rank] ?? table[group]?.[fallback];
  };

  return {
    level,
    ac: pick("ac", "ac"),
    hp: pick("hp", "hp"),
    fortitude: pick("save", "fortitude"),
    reflex: pick("save", "reflex"),
    will: pick("save", "will"),
    perception: pick("perception", "perception"),
    attack: pick("attack", "attack"),
    damage: pick("damage", "damage"),
    spellDC: preset.spellDC ? pick("dc", "spellDC") : null
  };
}
