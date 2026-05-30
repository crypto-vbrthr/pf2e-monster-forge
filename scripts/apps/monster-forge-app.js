import { generateMonsterDraft } from "../generators/monster-generator.js";
import * as TraitsData from "../data/traits.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODULE_ID = "pf2e-monster-forge";

export class MonsterForgeApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "pf2e-monster-forge",
    tag: "form",
    window: {
      title: "PF2EMF.AppTitle",
      icon: "fa-solid fa-dragon",
      resizable: true
    },
    position: {
      width: 520,
      height: "auto"
    },
    form: {
      handler: MonsterForgeApp.#onSubmit,
      closeOnSubmit: false
    },
    actions: {
      preview: MonsterForgeApp.#onPreview,
      createActor: MonsterForgeApp.#onCreateActor
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

    this.preview = generateMonsterDraft(this.formData);
  }

  async _prepareContext(options) {
    return {
      data: this.formData,
      preview: this.preview,
      traits: TraitsData.CREATURE_TRAITS ?? TraitsData.TRAITS ?? TraitsData.default ?? []
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    const form = this.element;

    form.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("change", () => {
        this.#readForm();
        this.preview = generateMonster(this.formData);
        this.render();
      });
    });
  }

  #readForm() {
    const form = this.element;
    if (!form) return;

    const formData = new FormData(form);

    this.formData = {
      name: formData.get("name") || "Forged Monster",
      level: Number(formData.get("level") ?? 1),
      role: formData.get("role") || "brute",
      size: formData.get("size") || "med",
      traits: formData.getAll("traits"),
      ac: formData.get("ac") || "moderate",
      hp: formData.get("hp") || "moderate",
      fortitude: formData.get("fortitude") || "moderate",
      reflex: formData.get("reflex") || "moderate",
      will: formData.get("will") || "moderate",
      attack: formData.get("attack") || "moderate",
      damage: formData.get("damage") || "moderate"
    };
  }

  static async #onSubmit(event, form, formData) {
    event.preventDefault();
  }

  static async #onPreview(event, target) {
    const app = this;
    app.#readForm();
    app.preview = generateMonsterDraft(app.formData);
    app.render();
  }

  static async #onCreateActor(event, target) {
    const app = this;
    app.#readForm();
    const monster = generateMonsterDraft(app.formData);

    const actorData = {
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
          value: monster.traits ?? []
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
    };

    await Actor.create(actorData);

    ui.notifications.info(
      game.i18n.format("PF2EMF.ActorCreated", { name: monster.name })
    );
  }
}
