import { generateTeam } from "../../js/generators";
import Bowman from "../../js/characters/Bowman";
import Swordsman from "../../js/characters/Swordsman";
import Magician from "../../js/characters/Magician";

test("generateTeam should create the correct number of characters within the level range", () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const maxLevel = 4;
  const characterCount = 5;
  const team = generateTeam(allowedTypes, maxLevel, characterCount);

  expect(team.characters.length).toBe(characterCount);

  team.characters.forEach((character) => {
    expect(character.level).toBeGreaterThanOrEqual(1);
    expect(character.level).toBeLessThanOrEqual(maxLevel);
    expect(allowedTypes).toContain(character.constructor);
  });
});
