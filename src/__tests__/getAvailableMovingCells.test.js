import GameController from "../js/GameController";
import Swordsman from "../js/characters/Swordsman";
import Bowman from "../js/characters/Bowman";
import Magician from "../js/characters/Magician";
import PositionedCharacter from "../js/PositionedCharacter";

describe("getAvailableMovingCells", () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test("should return correct cells for Swordsman", () => {
    const current = 0; // Позиция в левом верхнем углу
    const character = new Swordsman(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const expectedCells = new Set([1, 8, 9, 2, 16, 18, 3, 24, 27, 4, 32, 36]);

    const result = gameController.getAvailableMovingCells(positionedCharacter);
    expect(result).toEqual(expectedCells);
  });

  test("should return correct cells for Bowman", () => {
    const current = 10; // Позиция в середине поля
    const character = new Bowman(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const expectedCells = new Set([
      1, 2, 3, 8, 9, 11, 12, 17, 18, 19, 24, 26, 28,
    ]);

    const result = gameController.getAvailableMovingCells(positionedCharacter);
    expect(result).toEqual(expectedCells);
  });

  test("should return correct cells for Magician", () => {
    const current = 63; // Позиция в правом нижнем углу
    const character = new Magician(1);
    const positionedCharacter = new PositionedCharacter(character, current);
    const expectedCells = new Set([55, 62, 54]);

    const result = gameController.getAvailableMovingCells(positionedCharacter);
    expect(result).toEqual(expectedCells);
  });
});
