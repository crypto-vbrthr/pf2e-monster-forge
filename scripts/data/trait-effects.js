export const TRAIT_EFFECTS = {
  dragon: {
    senses: ["darkvision"],
    speeds: {
      fly: 30
    },
    languages: ["draconic"],
    skills: {
      intimidation: "high",
      arcana: "moderate"
    }
  },

  undead: {
    senses: ["darkvision"],
    immunities: ["death-effects", "disease", "poison"],
    traits: ["void-healing"],
    skills: {
      stealth: "moderate",
      religion: "moderate"
    }
  },

  animal: {
    senses: ["low-light-vision"],
    skills: {
      athletics: "moderate",
      survival: "high"
    },
    abilityOverrides: {
      int: "terrible"
    }
  },

  beast: {
    senses: ["darkvision"],
    skills: {
      athletics: "high",
      survival: "moderate"
    }
  },

  humanoid: {
    languages: ["common"],
    skills: {
      society: "moderate"
    }
  },

  fiend: {
    senses: ["darkvision"],
    languages: ["diabolic", "demonic"],
    weaknesses: {
      holy: 5
    },
    skills: {
      deception: "moderate",
      intimidation: "high",
      religion: "moderate"
    }
  },

  celestial: {
    senses: ["darkvision"],
    languages: ["empyrean"],
    weaknesses: {
      unholy: 5
    },
    skills: {
      diplomacy: "moderate",
      religion: "high"
    }
  },

  fey: {
    senses: ["low-light-vision"],
    languages: ["fey"],
    skills: {
      deception: "high",
      nature: "moderate",
      performance: "moderate"
    }
  },

  construct: {
    senses: ["darkvision"],
    immunities: ["bleed", "death-effects", "disease", "healing", "mental", "nonlethal", "poison", "spirit"],
    skills: {
      athletics: "moderate"
    },
    abilityOverrides: {
      int: "terrible",
      con: "terrible"
    }
  },

  aquatic: {
    speeds: {
      swim: 30
    },
    skills: {
      athletics: "moderate"
    }
  },

  amphibious: {
    speeds: {
      swim: 25
    }
  },

  fire: {
    resistances: {
      fire: 5
    },
    weaknesses: {
      cold: 5
    }
  },

  cold: {
    resistances: {
      cold: 5
    },
    weaknesses: {
      fire: 5
    }
  },

  electricity: {
    resistances: {
      electricity: 5
    }
  },

  acid: {
    resistances: {
      acid: 5
    }
  },

  holy: {
    traits: ["holy"]
  },

  unholy: {
    traits: ["unholy"]
  }
};

export function scaleTraitValue(level, value) {
  const safeLevel = Math.max(0, Number(level) || 0);

  if (safeLevel >= 20) return value + 15;
  if (safeLevel >= 15) return value + 10;
  if (safeLevel >= 10) return value + 5;
  if (safeLevel >= 5) return value + 2;

  return value;
}
