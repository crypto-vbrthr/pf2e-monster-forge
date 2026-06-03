import { generateMonsterDraft } from "../generators/monster-generator.js";
import { ROLE_PRESETS } from "../data/role-presets.js";
import { ATTACK_PROFILES } from "../data/attack-profiles.js";
import { ADJUSTMENT_PROFILES } from "../data/adjustment-profiles.js";
import { MONSTER_FAMILIES } from "../data/monster-families.js";
import { SPECIAL_ABILITIES } from "../data/special-abilities.js";
import * as TraitsData from "../data/traits.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODULE_ID = "pf2e-monster-forge";

export class MonsterForgeApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "pf2e-monster-forge",
    tag: "form",
    window: {
      title: "Monster Forge",
      icon: "fa-solid fa-dragon",
      resizable: true
    },
    position: {
      width: 1040,
      height: 760
    }
  };

  static PARTS = {
    form: {
      template: "modules/pf2e-monster-forge/templates/monster-forge-app.hbs"
    }
  };

  constructor(options = {}) {
    super(options);

    const role = game.settings.get(MODULE_ID, "defaultRole") ?? "brute";
    const preset = ROLE_PRESETS[role] ?? ROLE_PRESETS.brute;

    this.openSections = {
      specialAbilities: false,
      spellcasting: false
    };

    this.formData = {
      name: "Forged Monster",
      level: game.settings.get(MODULE_ID, "defaultLevel") ?? 1,
      role,
      family: "custom",
      size: game.settings.get(MODULE_ID, "defaultSize") ?? "med",
      traits: [],
      autoAbilities: true,
      selectedAbilities: [],
      attackProfile: "standard",
      adjustment: "normal",

      spellcasting: false,
      spellTradition: "arcane",
      spellStyle: "artillery",
      spellListStyle: "bestiary",

      ac: preset.ac ?? "moderate",
      hp: preset.hp ?? "moderate",
      perception: preset.perception ?? "moderate",
      fortitude: preset.fortitude ?? "moderate",
      reflex: preset.reflex ?? "moderate",
      will: preset.will ?? "moderate",
      attack: preset.attack ?? "moderate",
      damage: preset.damage ?? "moderate"
    };

    this.preview = this.#makeMonster();
  }

  async _prepareContext(options) {
    const selectedTraits = new Set(this.formData.traits ?? []);
    const rawTraits = normalizeTraitSource(
      TraitsData.CREATURE_TRAITS ??
        TraitsData.TRAITS ??
        TraitsData.default ??
        []
    );

    const traitList = rawTraits.map(trait => {
      if (typeof trait === "string") {
        return {
          value: trait,
          label: localizeMaybe(`PF2EMF.Traits.${trait}`, trait),
          checked: selectedTraits.has(trait)
        };
      }

      const value =
        trait?.value ??
        trait?.slug ??
        trait?.id ??
        String(trait);

      const rawLabel =
        trait?.label ??
        trait?.name ??
        value;

      const fallback =
        typeof rawLabel === "string"
          ? localizeMaybe(rawLabel, value)
          : String(value);

      return {
        value,
        label: localizeMaybe(`PF2EMF.Traits.${value}`, fallback),
        checked: selectedTraits.has(value)
      };
    });

    const preview = foundry.utils.deepClone(this.preview);

    if (preview.spellcasting?.spells?.length) {
      preview.spellcasting.spells = await localizeSpellPreviewNames(
        preview.spellcasting.spells
      );
    }

    return {
      data: this.formData,
      preview,
      traits: traitList,

      statRanks: {
        terrible: localizeMaybe("PF2EMF.StatRanks.Terrible", "Terrible"),
        low: localizeMaybe("PF2EMF.StatRanks.Low", "Low"),
        moderate: localizeMaybe("PF2EMF.StatRanks.Moderate", "Moderate"),
        high: localizeMaybe("PF2EMF.StatRanks.High", "High"),
        extreme: localizeMaybe("PF2EMF.StatRanks.Extreme", "Extreme")
      },

      roles: {
        brute: localizeMaybe("PF2EMF.Roles.Brute", "Brute"),
        soldier: localizeMaybe("PF2EMF.Roles.Soldier", "Soldier"),
        skirmisher: localizeMaybe("PF2EMF.Roles.Skirmisher", "Skirmisher"),
        spellcaster: localizeMaybe("PF2EMF.Roles.Spellcaster", "Spellcaster")
      },

      sizes: {
        tiny: localizeMaybe("PF2EMF.Sizes.Tiny", "Tiny"),
        sm: localizeMaybe("PF2EMF.Sizes.Small", "Small"),
        med: localizeMaybe("PF2EMF.Sizes.Medium", "Medium"),
        lg: localizeMaybe("PF2EMF.Sizes.Large", "Large"),
        huge: localizeMaybe("PF2EMF.Sizes.Huge", "Huge"),
        grg: localizeMaybe("PF2EMF.Sizes.Gargantuan", "Gargantuan")
      },

      abilityOptions: Object.entries(SPECIAL_ABILITIES).map(([key, ability]) => ({
        key,
        label: localizeMaybe(ability.label, key),
        checked: (this.formData.selectedAbilities ?? []).includes(key)
      })),

      spellTraditions: {
        arcane: localizeMaybe("PF2EMF.SpellTraditions.Arcane", "Arcane"),
        divine: localizeMaybe("PF2EMF.SpellTraditions.Divine", "Divine"),
        occult: localizeMaybe("PF2EMF.SpellTraditions.Occult", "Occult"),
        primal: localizeMaybe("PF2EMF.SpellTraditions.Primal", "Primal")
      },

      spellStyles: {
        artillery: localizeMaybe("PF2EMF.SpellStyles.Artillery", "Artillery"),
        control: localizeMaybe("PF2EMF.SpellStyles.Control", "Control"),
        support: localizeMaybe("PF2EMF.SpellStyles.Support", "Support"),
        summoning: localizeMaybe("PF2EMF.SpellStyles.Summoning", "Summoning")
      },

      spellListStyles: {
        few: localizeMaybe("PF2EMF.SpellListStyles.Few", "Few Powerful Spells"),
        bestiary: localizeMaybe("PF2EMF.SpellListStyles.Bestiary", "Bestiary Style"),
        full: localizeMaybe("PF2EMF.SpellListStyles.Full", "Full List")
      },

      families: Object.fromEntries(
        Object.entries(MONSTER_FAMILIES).map(([key, family]) => [
          key,
          localizeMaybe(family.label, key)
        ])
      ),

      attackProfiles: Object.fromEntries(
        Object.entries(ATTACK_PROFILES).map(([key, profile]) => [
          key,
          localizeMaybe(profile.label, key)
        ])
      ),

      adjustmentProfiles: Object.fromEntries(
        Object.entries(ADJUSTMENT_PROFILES).map(([key, profile]) => [
          key,
          localizeMaybe(profile.label, key)
        ])
      )
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    const root = this.element;
    if (!root) return;

    root.querySelectorAll("details[data-section]").forEach(details => {
      const section = details.dataset.section;

      if (this.openSections?.[section]) {
        details.open = true;
      }

      details.addEventListener("toggle", () => {
        this.openSections[section] = details.open;
      });
    });

    root.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("change", () => {
        this.#readForm();

        if (input.name === "family") {
          this.#applyFamilyPreset();
        } else if (input.name === "role") {
          this.#applyRolePreset();
        }

        this.preview = this.#makeMonster();
        this.render();
      });
    });

    root.querySelector('[data-action="preview"]')?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      this.#readForm();
      this.preview = this.#makeMonster();
      this.render();
    });

    root.querySelector('[data-action="createActor"]')?.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();

      this.#readForm();

      const monster = this.#makeMonster();
      await this.#createActor(monster);

      ui.notifications.info(`Monster Forge: ${monster.name} erstellt.`);
    });
  }

  #readForm() {
    const form = this.element;
    if (!form) return;

    const fd = new FormData(form);

    this.formData = {
      name: fd.get("name") || "Forged Monster",
      level: Number(fd.get("level") ?? 1),
      role: fd.get("role") || "brute",
      family: fd.get("family") || "custom",
      size: fd.get("size") || "med",
      traits: fd.getAll("traits"),
      autoAbilities: fd.has("autoAbilities"),
      selectedAbilities: fd.getAll("selectedAbilities"),
      attackProfile: fd.get("attackProfile") || "standard",
      adjustment: fd.get("adjustment") || "normal",

      spellcasting: fd.has("spellcasting"),
      spellTradition: fd.get("spellTradition") || "arcane",
      spellStyle: fd.get("spellStyle") || "artillery",
      spellListStyle: fd.get("spellListStyle") || "bestiary",

      ac: fd.get("ac") || "moderate",
      hp: fd.get("hp") || "moderate",
      perception: fd.get("perception") || "moderate",
      fortitude: fd.get("fortitude") || "moderate",
      reflex: fd.get("reflex") || "moderate",
      will: fd.get("will") || "moderate",
      attack: fd.get("attack") || "moderate",
      damage: fd.get("damage") || "moderate"
    };
  }

  #applyRolePreset() {
    const preset =
      ROLE_PRESETS[this.formData.role] ??
      ROLE_PRESETS.brute;

    this.formData = {
      ...this.formData,
      ac: preset.ac ?? "moderate",
      hp: preset.hp ?? "moderate",
      perception: preset.perception ?? "moderate",
      fortitude: preset.fortitude ?? "moderate",
      reflex: preset.reflex ?? "moderate",
      will: preset.will ?? "moderate",
      attack: preset.attack ?? "moderate",
      damage: preset.damage ?? "moderate"
    };
  }

  #applyFamilyPreset() {
    const family =
      MONSTER_FAMILIES[this.formData.family] ??
      MONSTER_FAMILIES.custom;

    if (this.formData.family === "custom") return;

    this.formData = {
      ...this.formData,

      role: family.role ?? this.formData.role,
      size: family.size ?? this.formData.size,
      traits: family.traits ?? this.formData.traits,
      attackProfile: family.attackProfile ?? this.formData.attackProfile,

      ac: family.ac ?? this.formData.ac,
      hp: family.hp ?? this.formData.hp,
      perception: family.perception ?? this.formData.perception,
      fortitude: family.fortitude ?? this.formData.fortitude,
      reflex: family.reflex ?? this.formData.reflex,
      will: family.will ?? this.formData.will,
      attack: family.attack ?? this.formData.attack,
      damage: family.damage ?? this.formData.damage
    };
  }

  #makeMonster() {
    const raw = generateMonsterDraft(this.formData);
    return this.#normalizeMonster(raw);
  }

  #normalizeMonster(raw = {}) {
    const traits = [
      ...(raw.traits ?? this.formData.traits ?? []),
      ...(raw.extraTraits ?? [])
    ];

    const resistances = raw.resistances ?? {};
    const weaknesses = raw.weaknesses ?? {};
    const immunities = Array.isArray(raw.immunities) ? raw.immunities : [];

    return {
      name: raw.name ?? this.formData.name ?? "Forged Monster",
      level: Number(raw.level ?? this.formData.level ?? 1),
      role: raw.role ?? this.formData.role ?? "brute",
      family: this.formData.family ?? "custom",
      size: raw.size ?? this.formData.size ?? "med",
      adjustment: raw.adjustment ?? this.formData.adjustment ?? "normal",
      traits: [...new Set(traits)],

      ac: Number(raw.ac ?? raw.armorClass ?? 10),
      hp: Number(raw.hp ?? raw.hitPoints ?? 10),
      perception: Number(raw.perception ?? 0),

      saves: {
        fortitude: Number(raw.saves?.fortitude ?? raw.fortitude ?? raw.fort ?? 0),
        reflex: Number(raw.saves?.reflex ?? raw.reflex ?? raw.ref ?? 0),
        will: Number(raw.saves?.will ?? raw.will ?? 0)
      },

      attack: Number(raw.attack ?? raw.attackBonus ?? raw.strike ?? 0),
      damage: raw.damage ?? raw.damageFormula ?? "1d6",

      abilities: {
        str: Number(raw.abilities?.str ?? 0),
        dex: Number(raw.abilities?.dex ?? 0),
        con: Number(raw.abilities?.con ?? 0),
        int: Number(raw.abilities?.int ?? 0),
        wis: Number(raw.abilities?.wis ?? 0),
        cha: Number(raw.abilities?.cha ?? 0)
      },

      skills: raw.skills ?? {},

      autoAbilities: this.formData.autoAbilities ?? true,
      selectedAbilities: this.formData.selectedAbilities ?? [],

      specialAbilities: Array.isArray(raw.specialAbilities)
        ? raw.specialAbilities.map(ability => ({
            key: ability.key,
            name: ability.name,
            type: ability.type ?? "passive",
            actionCost: ability.actionCost ?? null,
            description: ability.description ?? "",
            dc: ability.dc === null ? null : Number(ability.dc ?? 0),
            save: ability.save ?? null,
            basicSave: Boolean(ability.basicSave),
            damage: ability.damage ?? null
          }))
        : [],

      spellcasting: raw.spellcasting ?? null,

      senses: Array.isArray(raw.senses) ? raw.senses : [],
      speeds: raw.speeds ?? { land: 25 },
      languages: Array.isArray(raw.languages) ? raw.languages : [],

      resistances,
      weaknesses,
      immunities,

      resistanceList: localizeValueMap(resistances, "PF2EMF.DamageTypes"),
      weaknessList: localizeValueMap(weaknesses, "PF2EMF.DamageTypes"),
      immunityList: localizeValueList(immunities, "PF2EMF.DamageTypes"),

      attacks: Array.isArray(raw.attacks)
        ? raw.attacks.map(attack => ({
            key: attack.key ?? foundry.utils.randomID(),
            name: attack.name ?? "Strike",
            attack: Number(attack.attack ?? 0),
            damage: attack.damage ?? "1d6",
            damageType: attack.damageType ?? "bludgeoning",
            traits: attack.traits ?? []
          }))
        : []
    };
  }

  async #createActor(monster) {
    const actor = await Actor.create({
      name: monster.name,
      type: "npc",
      system: {
        details: {
          level: { value: monster.level },
          languages: { value: monster.languages }
        },

        traits: {
          size: { value: monster.size },
          value: monster.traits
        },

        abilities: {
          str: { mod: monster.abilities.str },
          dex: { mod: monster.abilities.dex },
          con: { mod: monster.abilities.con },
          int: { mod: monster.abilities.int },
          wis: { mod: monster.abilities.wis },
          cha: { mod: monster.abilities.cha }
        },

        attributes: {
          ac: { value: monster.ac },
          hp: {
            value: monster.hp,
            max: monster.hp
          },
          speed: {
            value: monster.speeds.land ?? 25,
            otherSpeeds: Object.entries(monster.speeds)
              .filter(([key]) => key !== "land")
              .map(([type, value]) => ({ type, value }))
          },
          resistances: Object.entries(monster.resistances ?? {}).map(([type, value]) => ({
            type,
            value,
            exceptions: [],
            doubleVs: []
          })),
          weaknesses: Object.entries(monster.weaknesses ?? {}).map(([type, value]) => ({
            type,
            value,
            exceptions: []
          })),
          immunities: (monster.immunities ?? []).map(type => ({
            type,
            exceptions: []
          }))
        },

        perception: {
          mod: monster.perception,
          senses: monster.senses.map(sense => ({ type: sense }))
        },

        saves: {
          fortitude: { value: monster.saves.fortitude },
          reflex: { value: monster.saves.reflex },
          will: { value: monster.saves.will }
        },

        skills: Object.fromEntries(
          Object.entries(monster.skills ?? {}).map(([slug, skill]) => [
            slug,
            { base: skill.value }
          ])
        )
      }
    });

    const normalItems = [];

    if (monster.attacks?.length) {
      normalItems.push(
        ...monster.attacks.map(attack => this.#buildStrikeItem(attack))
      );
    }

    if (monster.specialAbilities?.length) {
      normalItems.push(
        ...monster.specialAbilities.map(ability => this.#buildAbilityItem(ability))
      );
    }

    if (normalItems.length) {
      await actor.createEmbeddedDocuments("Item", normalItems);
    }

    if (monster.spellcasting?.enabled) {
      const spellcastingEntries = await actor.createEmbeddedDocuments("Item", [
        this.#buildSpellcastingEntry(monster.spellcasting)
      ]);

      const spellcastingEntry = spellcastingEntries[0];

      const spellItems = await this.#buildSpellItems(
        monster.spellcasting,
        spellcastingEntry?.id
      );

      if (spellItems.length) {
        await actor.createEmbeddedDocuments("Item", spellItems);
      }
    }

    return actor;
  }

  #buildStrikeItem(attack) {
    return {
      name: attack.name,
      type: "melee",
      system: {
        bonus: { value: attack.attack },
        damageRolls: {
          main: {
            damage: attack.damage,
            damageType: attack.damageType
          }
        },
        traits: {
          value: attack.traits ?? []
        }
      }
    };
  }

  #buildAbilityItem(ability) {
    const actionType = getActionType(ability);

    return {
      name: localizeMaybe(ability.name, ability.name),
      type: "action",
      system: {
        actionType: {
          value: actionType
        },
        actions: {
          value: ability.actionCost ?? null
        },
        description: {
          value: this.#buildAbilityDescription(ability)
        },
        traits: {
          value: []
        }
      }
    };
  }

  #buildAbilityDescription(ability) {
    const description = localizeMaybe(ability.description, ability.description);

    const parts = [
      `<p>${description}</p>`
    ];

    if (ability.dc && ability.save) {
      const saveLabel = getSaveLabel(ability.save, ability.basicSave);

      parts.push(`
        <p>
          @Check[type:${ability.save}|dc:${ability.dc}${ability.basicSave ? "|basic:true" : ""}]{${saveLabel}}
        </p>
      `);
    }

    if (ability.damage) {
      parts.push(`
        <p>
          @Damage[${ability.damage}]{${localizeMaybe("PF2EMF.Rolls.Damage", "Damage")}}
        </p>
      `);
    }

    return parts.join("");
  }

  #buildSpellcastingEntry(spellcasting) {
    const tradition = spellcasting.tradition ?? "arcane";

    return {
      name: localizeMaybe(
        `PF2EMF.SpellTraditions.${capitalize(tradition)}`,
        tradition
      ),
      type: "spellcastingEntry",
      system: {
        ability: {
          value: "cha"
        },
        tradition: {
          value: tradition
        },
        prepared: {
          value: "innate"
        },
        spelldc: {
          value: spellcasting.dc ?? 10,
          dc: spellcasting.dc ?? 10,
          mod: spellcasting.attack ?? 0
        },
        slots: {}
      }
    };
  }

  async #buildSpellItems(spellcasting, spellcastingEntryId = null) {
    const pack =
      game.packs.get("pf2e.spells-srd") ??
      game.packs.find(pack =>
        pack.documentName === "Item" &&
        pack.metadata?.type === "Item" &&
        (
          pack.collection?.includes("spells") ||
          pack.metadata?.id?.includes("spells") ||
          pack.metadata?.label?.toLowerCase?.().includes("spell")
        )
      );

    if (!pack) {
      console.warn("PF2e Monster Forge | Kein Zauber-Kompendium gefunden.");
      ui.notifications.warn("PF2e Monster Forge | Kein Zauber-Kompendium gefunden.");
      return [];
    }

    const index = await pack.getIndex({
      fields: [
        "name",
        "type",
        "system.slug",
        "system.level.value"
      ]
    });

    const result = [];

    for (const spell of spellcasting.spells ?? []) {
      const slug = spell.key;

      const entry = index.find(entry =>
        entry.type === "spell" &&
        (
          entry.system?.slug === slug ||
          entry.name?.slugify?.() === slug ||
          entry.name?.toLowerCase?.().replaceAll(" ", "-") === slug
        )
      );

      if (!entry) {
        console.warn(`PF2e Monster Forge | Zauber nicht gefunden: ${slug}`);
        continue;
      }

      const document = await pack.getDocument(entry._id);
      if (!document) continue;

      const data = document.toObject();

      delete data._id;

      if (spellcastingEntryId) {
        foundry.utils.setProperty(data, "system.location.value", spellcastingEntryId);
        foundry.utils.setProperty(data, "system.location.signature", false);
        foundry.utils.setProperty(data, "system.location.heightenedLevel", null);
      }

      result.push(data);
    }

    return result;
  }
}

function normalizeTraitSource(source) {
  if (Array.isArray(source)) return source;

  if (!source || typeof source !== "object") return [];

  return Object.entries(source).map(([key, value]) => {
    if (typeof value === "string") {
      return {
        value: key,
        label: value
      };
    }

    return {
      value: value?.value ?? value?.slug ?? value?.id ?? key,
      label: value?.label ?? value?.name ?? key
    };
  });
}

function localizeMaybe(key, fallback) {
  if (typeof key !== "string") return String(fallback ?? "");

  const localized = game.i18n.localize(key);

  if (!localized || localized === key) {
    return String(fallback ?? key);
  }

  return localized;
}

async function localizeSpellPreviewNames(spells = []) {
  const pack =
    game.packs.get("pf2e.spells-srd") ??
    game.packs.find(pack =>
      pack.documentName === "Item" &&
      pack.metadata?.type === "Item" &&
      (
        pack.collection?.includes("spells") ||
        pack.metadata?.id?.includes("spells") ||
        pack.metadata?.label?.toLowerCase?.().includes("spell")
      )
    );

  if (!pack) return spells;

  const index = await pack.getIndex({
    fields: [
      "name",
      "type",
      "system.slug"
    ]
  });

  return spells.map(spell => {
    const entry = index.find(entry =>
      entry.type === "spell" &&
      (
        entry.system?.slug === spell.key ||
        entry.name?.slugify?.() === spell.key ||
        entry.name?.toLowerCase?.().replaceAll(" ", "-") === spell.key
      )
    );

    return {
      ...spell,
      name: entry?.name ?? spell.name ?? spell.key
    };
  });
}

function localizeValueMap(map, prefix) {
  return Object.entries(map ?? {}).map(([key, value]) => ({
    key,
    label: localizeMaybe(`${prefix}.${key}`, key),
    value
  }));
}

function localizeValueList(list, prefix) {
  return (list ?? []).map(key => ({
    key,
    label: localizeMaybe(`${prefix}.${key}`, key)
  }));
}

function getActionType(ability) {
  switch (ability.type) {
    case "reaction":
      return "reaction";

    case "free":
      return "free";

    case "passive":
      return "passive";

    case "action":
    default:
      return "action";
  }
}

function getSaveLabel(save, basic = false) {
  const prefix = basic ? "Basic" : "Normal";

  switch (save) {
    case "fortitude":
      return localizeMaybe(`PF2EMF.Checks.${prefix}Fortitude`, "Fortitude Save");

    case "reflex":
      return localizeMaybe(`PF2EMF.Checks.${prefix}Reflex`, "Reflex Save");

    case "will":
      return localizeMaybe(`PF2EMF.Checks.${prefix}Will`, "Will Save");

    default:
      return localizeMaybe("PF2EMF.Checks.Save", "Save");
  }
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
