import GameController from "../js/GameController";
import Swordsman from "../js/characters/Swordsman";
import Bowman from "../js/characters/Bowman";
import Magician from "../js/characters/Magician";
import PositionedCharacter from "../js/PositionedCharacter";

describe("cellCanBeAttacked", () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test("should return true for Swordsman attacking adjacent cell", () => {
    const character = new Swordsman(1);
    const current = 0; // Позиция в левом верхнем углу
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 1; // Соседняя клетка

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(true);
  });

  test("should return false for Swordsman attacking distant cell", () => {
    const character = new Swordsman(1);
    const current = 0; // Позиция в левом верхнем углу
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 10; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(false);
  });

  test("should return true for Bowman attacking within range", () => {
    const current = 10; // Позиция в середине поля
    const character = new Bowman(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 12; // Клетка в радиусе атаки

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(true);
  });

  test("should return false for Bowman attacking out of range", () => {
    const current = 10; // Позиция в середине поля
    const character = new Bowman(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 30; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(false);
  });

  test("should return true for Magician attacking within range", () => {
    const current = 63; // Позиция в правом нижнем углу
    const character = new Magician(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 55; // Клетка в радиусе атаки

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(true);
  });

  test("should return false for Magician attacking out of range", () => {
    const current = 63; // Позиция в правом нижнем углу
    const character = new Magician(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const target = 0; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(
      positionedCharacter,
      target,
    );
    expect(result).toBe(false);
  });
});
