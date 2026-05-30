import { generateMonsterDraft } from "../generators/monster-generator.js";
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
      width: 520,
      height: "auto"
    }
  };

  static PARTS = {
    form: {
      template: "modules/pf2e-monster-forge/templates/monster-forge-app.hbs"
    }
  };

  constructor(options = {}) {
    super(options);

    this.formData = {
      name: "Forged Monster",
      level: game.settings.get(MODULE_ID, "defaultLevel") ?? 1,
      role: game.settings.get(MODULE_ID, "defaultRole") ?? "brute",
      size: game.settings.get(MODULE_ID, "defaultSize") ?? "med",
      traits: [],
      ac: "moderate",
      hp: "moderate",
      fortitude: "moderate",
      reflex: "moderate",
      will: "moderate",
      attack: "moderate",
      damage: "moderate"
    };

    this.preview = this.#makeMonster();
  }

  async _prepareContext(options) {
    return {
      data: this.formData,
      preview: this.preview,
      traits: TraitsData.CREATURE_TRAITS ?? TraitsData.TRAITS ?? TraitsData.default ?? [],

      statRanks: {
        terrible: game.i18n.localize("PF2EMF.StatRanks.Terrible"),
        low: game.i18n.localize("PF2EMF.StatRanks.Low"),
        moderate: game.i18n.localize("PF2EMF.StatRanks.Moderate"),
        high: game.i18n.localize("PF2EMF.StatRanks.High"),
        extreme: game.i18n.localize("PF2EMF.StatRanks.Extreme")
      },

      roles: {
        brute: game.i18n.localize("PF2EMF.Roles.Brute"),
        soldier: game.i18n.localize("PF2EMF.Roles.Soldier"),
        skirmisher: game.i18n.localize("PF2EMF.Roles.Skirmisher"),
        spellcaster: game.i18n.localize("PF2EMF.Roles.Spellcaster")
      },

      sizes: {
        tiny: game.i18n.localize("PF2EMF.Sizes.Tiny"),
        sm: game.i18n.localize("PF2EMF.Sizes.Small"),
        med: game.i18n.localize("PF2EMF.Sizes.Medium"),
        lg: game.i18n.localize("PF2EMF.Sizes.Large"),
        huge: game.i18n.localize("PF2EMF.Sizes.Huge"),
        grg: game.i18n.localize("PF2EMF.Sizes.Gargantuan")
      }
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    const root = this.element;
    if (!root) return;

    root.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("change", () => {
        this.#readForm();
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
      ac: fd.get("ac") || "moderate",
      hp: fd.get("hp") || "moderate",
      fortitude: fd.get("fortitude") || "moderate",
      reflex: fd.get("reflex") || "moderate",
      will: fd.get("will") || "moderate",
      attack: fd.get("attack") || "moderate",
      damage: fd.get("damage") || "moderate"
    };
  }

  #makeMonster() {
    const raw = generateMonsterDraft(this.formData);
    return this.#normalizeMonster(raw);
  }

  #normalizeMonster(raw = {}) {
    return {
      name: raw.name ?? this.formData.name ?? "Forged Monster",
      level: Number(raw.level ?? this.formData.level ?? 1),
      size: raw.size ?? this.formData.size ?? "med",
      traits: raw.traits ?? this.formData.traits ?? [],

      ac: Number(raw.ac ?? raw.armorClass ?? 10),
      hp: Number(raw.hp ?? raw.hitPoints ?? 10),

      saves: {
        fortitude: Number(raw.saves?.fortitude ?? raw.fortitude ?? raw.fort ?? 0),
        reflex: Number(raw.saves?.reflex ?? raw.reflex ?? raw.ref ?? 0),
        will: Number(raw.saves?.will ?? raw.will ?? 0)
      },

      attack: Number(raw.attack ?? raw.attackBonus ?? raw.strike ?? 0),
      damage: raw.damage ?? raw.damageFormula ?? "1d6"
    };
  }

  async #createActor(monster) {
    return Actor.create({
      name: monster.name,
      type: "npc",
      system: {
        details: {
          level: {
            value: monster.level
          }
        },
        traits: {
          size: {
            value: monster.size
          },
          value: monster.traits
        },
        attributes: {
          ac: {
            value: monster.ac
          },
          hp: {
            value: monster.hp,
            max: monster.hp
          }
        },
        saves: {
          fortitude: {
            value: monster.saves.fortitude
          },
          reflex: {
            value: monster.saves.reflex
          },
          will: {
            value: monster.saves.will
          }
        }
      }
    });
  }
}