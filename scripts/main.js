import { MonsterForgeApp } from "./apps/monster-forge-app.js";
import { registerMonsterForgeSettings } from "./settings.js";

Hooks.once("init", () => {
  registerMonsterForgeSettings();
  Handlebars.registerHelper("ifEquals", function(a, b, options) {
    return a == b ? options.fn(this) : options.inverse(this);
  });
});

Hooks.once("ready", () => {
  game.pf2eMonsterForge = {
    open: () => new MonsterForgeApp().render(true)
  };

  const controls = ui.controls?.controls;
  const tokenControls = controls?.find((control) => control.name === "token");
  if (tokenControls) {
    tokenControls.tools.push({
      name: "pf2e-monster-forge",
      title: "PF2EMF.controls.open",
      icon: "fa-solid fa-dragon",
      button: true,
      onClick: () => game.pf2eMonsterForge.open()
    });
    ui.controls.render();
  }
});
