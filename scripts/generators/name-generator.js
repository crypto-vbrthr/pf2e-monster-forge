const roots = ["Ash", "Bram", "Grak", "Morr", "Vesk", "Tharn", "Ul", "Krag", "Nym", "Zar"];
const endings = ["fang", "hide", "maw", "thorn", "shade", "scale", "claw", "spark", "gloom", "spine"];

export function generateName() {
  const root = roots[Math.floor(Math.random() * roots.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  return `${root}${ending}`;
}
