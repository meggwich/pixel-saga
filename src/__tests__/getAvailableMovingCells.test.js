import GameController from "../js/GameController";

describe("getAvailableMovingCells", () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test("should return correct cells for Swordsman", () => {
    const type = "swordsman";
    const current = 0; // Позиция в левом верхнем углу
    const expectedCells = new Set([1, 8, 9, 2, 16, 18, 3, 24, 27, 4, 32, 36]);

    const result = gameController.getAvailableMovingCells(type, current);
    expect(result).toEqual(expectedCells);
  });

  test("should return correct cells for Bowman", () => {
    const type = "bowman";
    const current = 10; // Позиция в середине поля
    const expectedCells = new Set([
      1, 2, 3, 8, 9, 11, 12, 17, 18, 19, 24, 26, 28,
    ]);

    const result = gameController.getAvailableMovingCells(type, current);
    expect(result).toEqual(expectedCells);
  });

  test("should return correct cells for Magician", () => {
    const type = "magician";
    const current = 63; // Позиция в правом нижнем углу
    const expectedCells = new Set([55, 62, 54]);

    const result = gameController.getAvailableMovingCells(type, current);
    expect(result).toEqual(expectedCells);
  });
});
