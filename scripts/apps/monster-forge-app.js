import { generateMonsterDraft } from "../generators/monster-generator.js";
import { ROLE_PRESETS } from "../data/role-presets.js";
import { ATTACK_PROFILES } from "../data/attack-profiles.js";
import { ADJUSTMENT_PROFILES } from "../data/adjustment-profiles.js";
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
      width: 760,
      height: 620
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

    this.formData = {
      name: "Forged Monster",
      level: game.settings.get(MODULE_ID, "defaultLevel") ?? 1,
      role,
      size: game.settings.get(MODULE_ID, "defaultSize") ?? "med",
      traits: [],
      attackProfile: "standard",
      adjustment: "normal",
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

    const rawTraitsSource =
      TraitsData.CREATURE_TRAITS ??
      TraitsData.TRAITS ??
      TraitsData.default ??
      [];

    const rawTraits = Array.isArray(rawTraitsSource)
      ? rawTraitsSource
      : Object.entries(rawTraitsSource).map(([key, value]) => {
          if (typeof value === "string") {
            return { value: key, label: value };
          }

          return {
            value: value?.value ?? value?.slug ?? value?.id ?? key,
            label: value?.label ?? value?.name ?? key
          };
        });

    const traitList = rawTraits.map(trait => {
      if (typeof trait === "string") {
        return {
          value: trait,
          label: localizeMaybe(`PF2EMF.Traits.${trait}`, trait),
          checked: selectedTraits.has(trait)
        };
      }

      const value = trait?.value ?? trait?.slug ?? trait?.id ?? String(trait);
      const rawLabel = trait?.label ?? trait?.name ?? value;

      return {
        value,
        label: typeof rawLabel === "string" ? localizeMaybe(rawLabel, value) : String(value),
        checked: selectedTraits.has(value)
      };
    });

    return {
      data: this.formData,
      preview: this.preview,
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

    root.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("change", () => {
        this.#readForm();

        if (input.name === "role") {
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
      size: fd.get("size") || "med",
      traits: fd.getAll("traits"),
      attackProfile: fd.get("attackProfile") || "standard",
      adjustment: fd.get("adjustment") || "normal",
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
    const preset = ROLE_PRESETS[this.formData.role] ?? ROLE_PRESETS.brute;

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

  #makeMonster() {
    const raw = generateMonsterDraft(this.formData);
    return this.#normalizeMonster(raw);
  }

  #normalizeMonster(raw = {}) {
    const traits = [
      ...(raw.traits ?? this.formData.traits ?? []),
      ...(raw.extraTraits ?? [])
    ];

    return {
      name: raw.name ?? this.formData.name ?? "Forged Monster",
      level: Number(raw.level ?? this.formData.level ?? 1),
      role: raw.role ?? this.formData.role ?? "brute",
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

      senses: Array.isArray(raw.senses) ? raw.senses : [],
      speeds: raw.speeds ?? { land: 25 },
      languages: Array.isArray(raw.languages) ? raw.languages : [],
      resistances: raw.resistances ?? {},
      weaknesses: raw.weaknesses ?? {},
      immunities: Array.isArray(raw.immunities) ? raw.immunities : [],

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
          }
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
        ),

        resistances: Object.fromEntries(
          Object.entries(monster.resistances ?? {}).map(([type, value]) => [
            type,
            { value }
          ])
        ),

        weaknesses: Object.fromEntries(
          Object.entries(monster.weaknesses ?? {}).map(([type, value]) => [
            type,
            { value }
          ])
        ),

        immunities: monster.immunities
      }
    });

    if (monster.attacks?.length) {
      await actor.createEmbeddedDocuments(
        "Item",
        monster.attacks.map(attack => this.#buildStrikeItem(attack))
      );
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
}

function localizeMaybe(key, fallback) {
  if (typeof key !== "string") return String(fallback ?? "");

  const localized = game.i18n.localize(key);

  if (!localized || localized === key) {
    return String(fallback ?? key);
  }

  return localized;
}
