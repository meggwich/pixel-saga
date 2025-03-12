import Character from "../../js/Character";
import Bowman from "../../js/characters/Bowman";
import Daemon from "../../js/characters/Daemon";
import Magician from "../../js/characters/Magician";
import Swordsman from "../../js/characters/Swordsman";
import Undead from "../../js/characters/Undead";
import Vampire from "../../js/characters/Vampire";

// Данные для тестирования каждого класса
const characterClasses = [
  { Class: Bowman, type: "bowman", attack: 25, defence: 25 },
  { Class: Swordsman, type: "swordsman", attack: 40, defence: 10 },
  { Class: Magician, type: "magician", attack: 10, defence: 40 },
  { Class: Vampire, type: "vampire", attack: 25, defence: 25 },
  { Class: Undead, type: "undead", attack: 40, defence: 10 },
  { Class: Daemon, type: "daemon", attack: 10, defence: 10 },
];

// Тест на создание экземпляров классов
test("Inherited classes should not throw an error", () => {
  characterClasses.forEach(({ Class }) => {
    expect(() => new Class(1)).not.toThrow();
  });
});

// Тест на правильные характеристики персонажей 1-ого уровня
describe("Character properties for level 1", () => {
  characterClasses.forEach(({ Class, type, attack, defence }) => {
    test(`${type} should have correct properties`, () => {
      const character = new Class(1);
      expect(character.level).toBe(1);
      expect(character.attack).toBe(attack);
      expect(character.defence).toBe(defence);
      expect(character.health).toBe(50);
      expect(character.type).toBe(type);
    });
  });
});

// Тест на исключение при создании объекта базового класса Character
test("Character should throw an error when instantiated directly", () => {
  expect(() => new Character(1)).toThrow(
    "Нельзя создавать экземпляры класса Character напрямую",
  );
});
