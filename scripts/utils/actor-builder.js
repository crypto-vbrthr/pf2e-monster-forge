export async function createNpcActorFromDraft(draft) {
  const actorData = {
    name: draft.name,
    type: "npc",
    img: "icons/svg/mystery-man.svg",
    system: {
      details: {
        level: { value: draft.level }
      },
      traits: {
        size: { value: draft.size },
        value: draft.traits
      },
      attributes: {
        hp: {
          value: draft.stats.hp,
          max: draft.stats.hp
        },
        ac: {
          value: draft.stats.ac
        }
      },
      saves: {
        fortitude: { value: draft.stats.fortitude },
        reflex: { value: draft.stats.reflex },
        will: { value: draft.stats.will }
      },
      perception: {
        mod: draft.stats.perception
      }
    }
  };

  const actor = await Actor.create(actorData);
  await createStrikeItems(actor, draft.attacks);
  return actor;
}

async function createStrikeItems(actor, attacks) {
  const items = attacks.map((attack) => ({
    name: attack.name,
    type: "melee",
    system: {
      bonus: { value: attack.bonus },
      damageRolls: {
        primary: {
          damage: attack.damage,
          damageType: attack.damageType
        }
      },
      traits: {
        value: attack.traits ?? []
      }
    }
  }));

  if (items.length > 0) await actor.createEmbeddedDocuments("Item", items);
}
