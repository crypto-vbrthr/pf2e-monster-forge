export const RANKS = ["terrible", "low", "moderate", "high", "extreme"];

export const PF2E_STAT_TABLES = {
  0:  { ac: { low: 13, moderate: 15, high: 16, extreme: 19 }, hp: { low: 15, moderate: 20, high: 30 }, attack: { low: 4, moderate: 6, high: 8, extreme: 10 }, damage: { low: "1d4+1", moderate: "1d6+2", high: "1d8+3" }, save: { terrible: 1, low: 3, moderate: 5, high: 7, extreme: 9 }, perception: { low: 3, moderate: 5, high: 7, extreme: 9 }, dc: { low: 13, moderate: 15, high: 16, extreme: 19 } },
  1:  { ac: { low: 14, moderate: 16, high: 18, extreme: 19 }, hp: { low: 20, moderate: 30, high: 45 }, attack: { low: 6, moderate: 8, high: 10, extreme: 12 }, damage: { low: "1d6+2", moderate: "1d8+3", high: "1d10+4" }, save: { terrible: 2, low: 4, moderate: 7, high: 9, extreme: 11 }, perception: { low: 4, moderate: 7, high: 9, extreme: 11 }, dc: { low: 14, moderate: 17, high: 18, extreme: 20 } },
  2:  { ac: { low: 16, moderate: 18, high: 19, extreme: 21 }, hp: { low: 30, moderate: 45, high: 60 }, attack: { low: 8, moderate: 10, high: 12, extreme: 14 }, damage: { low: "1d8+3", moderate: "1d10+4", high: "2d6+5" }, save: { terrible: 4, low: 6, moderate: 8, high: 11, extreme: 13 }, perception: { low: 6, moderate: 8, high: 11, extreme: 13 }, dc: { low: 16, moderate: 18, high: 20, extreme: 22 } },
  3:  { ac: { low: 18, moderate: 19, high: 21, extreme: 22 }, hp: { low: 45, moderate: 60, high: 75 }, attack: { low: 10, moderate: 12, high: 14, extreme: 16 }, damage: { low: "1d10+4", moderate: "2d6+5", high: "2d8+6" }, save: { terrible: 6, low: 8, moderate: 10, high: 12, extreme: 15 }, perception: { low: 8, moderate: 10, high: 12, extreme: 15 }, dc: { low: 18, moderate: 20, high: 22, extreme: 23 } },
  4:  { ac: { low: 20, moderate: 21, high: 23, extreme: 25 }, hp: { low: 60, moderate: 75, high: 95 }, attack: { low: 12, moderate: 14, high: 16, extreme: 18 }, damage: { low: "2d6+5", moderate: "2d8+6", high: "2d10+7" }, save: { terrible: 7, low: 9, moderate: 12, high: 14, extreme: 17 }, perception: { low: 9, moderate: 12, high: 14, extreme: 17 }, dc: { low: 19, moderate: 21, high: 23, extreme: 25 } },
  5:  { ac: { low: 21, moderate: 22, high: 24, extreme: 26 }, hp: { low: 75, moderate: 95, high: 115 }, attack: { low: 13, moderate: 15, high: 17, extreme: 19 }, damage: { low: "2d8+6", moderate: "2d10+7", high: "2d12+8" }, save: { terrible: 8, low: 10, moderate: 13, high: 15, extreme: 18 }, perception: { low: 10, moderate: 13, high: 15, extreme: 18 }, dc: { low: 20, moderate: 22, high: 24, extreme: 26 } }
};

// Fill levels 6-20 by progression so the module remains usable while the exact table can be refined later.
for (let level = 6; level <= 20; level++) {
  const prev = PF2E_STAT_TABLES[level - 1];
  PF2E_STAT_TABLES[level] = {
    ac: {
      low: prev.ac.low + 1,
      moderate: prev.ac.moderate + 1,
      high: prev.ac.high + 1,
      extreme: prev.ac.extreme + 1
    },
    hp: {
      low: prev.hp.low + 15,
      moderate: prev.hp.moderate + 20,
      high: prev.hp.high + 25
    },
    attack: {
      low: prev.attack.low + 1,
      moderate: prev.attack.moderate + 1,
      high: prev.attack.high + 1,
      extreme: prev.attack.extreme + 1
    },
    damage: {
      low: `${Math.ceil(level / 2)}d6+${level}`,
      moderate: `${Math.ceil(level / 2)}d8+${level + 2}`,
      high: `${Math.ceil(level / 2)}d10+${level + 4}`
    },
    save: {
      terrible: prev.save.terrible + 1,
      low: prev.save.low + 1,
      moderate: prev.save.moderate + 1,
      high: prev.save.high + 1,
      extreme: prev.save.extreme + 1
    },
    perception: {
      low: prev.perception.low + 1,
      moderate: prev.perception.moderate + 1,
      high: prev.perception.high + 1,
      extreme: prev.perception.extreme + 1
    },
    dc: {
      low: prev.dc.low + 1,
      moderate: prev.dc.moderate + 1,
      high: prev.dc.high + 1,
      extreme: prev.dc.extreme + 1
    }
  };
}
