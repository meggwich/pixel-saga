import Bowman from "../js/characters/Bowman";

test("Tooltip format is correct", () => {
  const character = new Bowman(1);
  const tooltip = `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  expect(tooltip).toBe("🎖1 ⚔25 🛡25 ❤50");
});
