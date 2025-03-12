// import { characterGenerator } from '../src/js/generators';
// import Bowman from '../src/js/characters/Bowman';
// import Swordsman from '../src/js/characters/Swordsman';
// import Magician from '../src/js/characters/Magician';
import { characterGenerator } from "../../js/generators";
import Bowman from "../../js/characters/Bowman";
import Swordsman from "../../js/characters/Swordsman";
import Magician from "../../js/characters/Magician";

test("characterGenerator should infinitely generate characters from allowedTypes", () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const generator = characterGenerator(allowedTypes, 3);

  const characters = new Set();
  for (let i = 0; i < 100; i++) {
    const character = generator.next().value;
    expect(allowedTypes).toContain(character.constructor);
    characters.add(character);
  }

  // Проверяем, что все персонажи уникальны
  expect(characters.size).toBe(100);
});
