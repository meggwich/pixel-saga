import GameController from "../js/GameController";

describe("cellCanBeAttacked", () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test("should return true for Swordsman attacking adjacent cell", () => {
    const type = "swordsman";
    const current = 0; // Позиция в левом верхнем углу
    const target = 1; // Соседняя клетка

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(true);
  });

  test("should return false for Swordsman attacking distant cell", () => {
    const type = "swordsman";
    const current = 0; // Позиция в левом верхнем углу
    const target = 10; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(false);
  });

  test("should return true for Bowman attacking within range", () => {
    const type = "bowman";
    const current = 10; // Позиция в середине поля
    const target = 12; // Клетка в радиусе атаки

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(true);
  });

  test("should return false for Bowman attacking out of range", () => {
    const type = "bowman";
    const current = 10; // Позиция в середине поля
    const target = 30; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(false);
  });

  test("should return true for Magician attacking within range", () => {
    const type = "magician";
    const current = 63; // Позиция в правом нижнем углу
    const target = 55; // Клетка в радиусе атаки

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(true);
  });

  test("should return false for Magician attacking out of range", () => {
    const type = "magician";
    const current = 63; // Позиция в правом нижнем углу
    const target = 0; // Клетка вне радиуса атаки

    const result = gameController.cellCanBeAttacked(type, current, target);
    expect(result).toBe(false);
  });
});
