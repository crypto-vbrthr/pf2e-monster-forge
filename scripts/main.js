const MODULE_ID = "pf2e-monster-forge";

Hooks.once("init", () => {
  console.log("PF2e Monster Forge | init");
  registerSettings();
});

Hooks.once("ready", () => {
  console.log("PF2e Monster Forge | ready");

  Hooks.on("renderActorDirectory", (app, html) => {
    injectMonsterForgeButton(app, html);
  });

  // Falls der Actors-Tab schon offen ist
  setTimeout(() => {
    const actorDirectory = ui.actors;
    if (actorDirectory?.rendered) actorDirectory.render(true);
  }, 250);
});

function registerSettings() {
  game.settings.register(MODULE_ID, "defaultLevel", {
    name: "PF2EMF.Settings.DefaultLevel.Name",
    hint: "PF2EMF.Settings.DefaultLevel.Hint",
    scope: "world",
    config: true,
    type: Number,
    default: 1,
    range: { min: -1, max: 25, step: 1 }
  });

  game.settings.register(MODULE_ID, "defaultRole", {
    name: "PF2EMF.Settings.DefaultRole.Name",
    hint: "PF2EMF.Settings.DefaultRole.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "brute",
    choices: {
      brute: "PF2EMF.Roles.Brute",
      soldier: "PF2EMF.Roles.Soldier",
      skirmisher: "PF2EMF.Roles.Skirmisher",
      spellcaster: "PF2EMF.Roles.Spellcaster"
    }
  });

  game.settings.register(MODULE_ID, "defaultSize", {
    name: "PF2EMF.Settings.DefaultSize.Name",
    hint: "PF2EMF.Settings.DefaultSize.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "med",
    choices: {
      tiny: "PF2EMF.Sizes.Tiny",
      sm: "PF2EMF.Sizes.Small",
      med: "PF2EMF.Sizes.Medium",
      lg: "PF2EMF.Sizes.Large",
      huge: "PF2EMF.Sizes.Huge",
      grg: "PF2EMF.Sizes.Gargantuan"
    }
  });
}

function injectMonsterForgeButton(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  if (root.querySelector(".pf2e-monster-forge-button")) return;

  const footer =
    root.querySelector(".directory-footer") ??
    root.querySelector("footer") ??
    root.querySelector(".directory-list")?.parentElement ??
    root;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("pf2e-monster-forge-button");
  button.innerHTML = `<i class="fas fa-dragon"></i> Monster Forge`;

  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const module = await import("./apps/monster-forge-app.js");
      new module.MonsterForgeApp().render(true);
    } catch (error) {
      console.error("PF2e Monster Forge | Could not open app", error);
      ui.notifications.error("Monster Forge konnte nicht geöffnet werden. Siehe Konsole.");
    }
  });

  footer.appendChild(button);
  console.log("PF2e Monster Forge | Actor-directory button injected");
}
