export const ROLE_SKILL_PRESETS = {
  brute: {
    athletics: "high",
    intimidation: "moderate"
  },

  soldier: {
    athletics: "moderate",
    intimidation: "moderate",
    warfareLore: "high"
  },

  skirmisher: {
    acrobatics: "high",
    stealth: "high",
    athletics: "moderate",
    survival: "moderate"
  },

  spellcaster: {
    arcana: "high",
    occultism: "high",
    religion: "moderate",
    nature: "moderate",
    diplomacy: "moderate"
  }
};

/**
 * Fallbacks für den Fall, dass ein Sprachschlüssel fehlt.
 * Die eigentliche Anzeige sollte über
 * PF2EMF.Skills.<slug>
 * in den Sprachdateien erfolgen.
 */
export const SKILL_FALLBACK_LABELS = {
  acrobatics: "Acrobatics",
  arcana: "Arcana",
  athletics: "Athletics",
  crafting: "Crafting",
  deception: "Deception",
  diplomacy: "Diplomacy",
  intimidation: "Intimidation",
  medicine: "Medicine",
  nature: "Nature",
  occultism: "Occultism",
  performance: "Performance",
  religion: "Religion",
  society: "Society",
  stealth: "Stealth",
  survival: "Survival",
  thievery: "Thievery",

  lore: "Lore",
  warfareLore: "Warfare Lore",
  sailingLore: "Sailing Lore",
  underworldLore: "Underworld Lore",
  engineeringLore: "Engineering Lore"
};
