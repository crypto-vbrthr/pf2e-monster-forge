import { ROLE_PRESETS } from "../data/role-presets.js";
import { TRAITS } from "../data/traits.js";
import { SIZE_DATA } from "../data/size-data.js";
import { RANKS } from "../data/pf2e-stat-tables.js";
import { generateMonsterDraft } from "../generators/monster-generator.js";
import { createNpcActorFromDraft } from "../utils/actor-builder.js";

export class MonsterForgeApp extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "pf2e-monster-forge",
      title: game.i18n.localize("PF2EMF.app.title"),
      template: "modules/pf2e-monster-forge/templates/monster-forge-app.hbs",
      width: 720,
      height: "auto",
      closeOnSubmit: false,
      submitOnChange: true
    });
  }

  constructor(...args) {
    super(...args);
    this.formState = {
      name: "",
      level: game.settings.get("pf2e-monster-forge", "defaultLevel") ?? 1,
      role: "brute",
      size: "med",
      traits: [],
      hpRank: "moderate",
      acRank: "moderate",
      fortitudeRank: "moderate",
      reflexRank: "moderate",
      willRank: "moderate",
      attackRank: "moderate",
      damageRank: "moderate"
    };
  }

  async getData() {
    const draft = generateMonsterDraft(this.formState);
    return {
      state: this.formState,
      draft,
      roles: Object.entries(ROLE_PRESETS).map(([key, value]) => ({ key, label: game.i18n.localize(value.i18n) })),
      sizes: Object.entries(SIZE_DATA).map(([key, value]) => ({ key, label: game.i18n.localize(value.i18n) })),
      traits: Object.entries(TRAITS).map(([key, value]) => ({
        key,
        label: game.i18n.localize(value.i18n),
        checked: this.formState.traits.includes(value.pf2e)
      })),
      ranks: RANKS.map((rank) => ({ key: rank, label: game.i18n.localize(`PF2EMF.rank.${rank}`) })),
      levels: Array.from({ length: 21 }, (_, level) => level)
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-action='create-actor']").on("click", async () => {
      const draft = generateMonsterDraft(this.formState);
      const actor = await createNpcActorFromDraft(draft);
      ui.notifications.info(game.i18n.format("PF2EMF.notification.created", { name: actor.name }));
    });
  }

  async _updateObject(_event, formData) {
    const expanded = foundry.utils.expandObject(formData);
    const traits = [];
    for (const [traitKey, enabled] of Object.entries(expanded.traits ?? {})) {
      if (enabled) traits.push(TRAITS[traitKey]?.pf2e ?? traitKey);
    }

    this.formState = {
      ...this.formState,
      ...expanded,
      traits,
      level: Number(expanded.level ?? this.formState.level)
    };
    this.render(false);
  }
}
