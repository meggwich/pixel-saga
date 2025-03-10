import { calcTileType } from "../js/utils";

describe("calcTileType", () => {
  // Угловые ячейки
  test('should return "top-left" for the first cell', () => {
    expect(calcTileType(0, 8)).toBe("top-left");
  });

  test('should return "top-right" for the last cell in the first row', () => {
    expect(calcTileType(7, 8)).toBe("top-right");
  });

  test('should return "bottom-left" for the first cell in the last row', () => {
    expect(calcTileType(56, 8)).toBe("bottom-left");
  });

  test('should return "bottom-right" for the last cell', () => {
    expect(calcTileType(63, 8)).toBe("bottom-right");
  });

  // Крайние ячейки (не угловые)
  test('should return "top" for cells in the first row (not corners)', () => {
    expect(calcTileType(1, 8)).toBe("top");
    expect(calcTileType(6, 8)).toBe("top");
  });

  test('should return "bottom" for cells in the last row (not corners)', () => {
    expect(calcTileType(57, 8)).toBe("bottom");
    expect(calcTileType(62, 8)).toBe("bottom");
  });

  test('should return "left" for cells in the first column (not corners)', () => {
    expect(calcTileType(8, 8)).toBe("left");
    expect(calcTileType(16, 8)).toBe("left");
  });

  test('should return "right" for cells in the last column (not corners)', () => {
    expect(calcTileType(15, 8)).toBe("right");
    expect(calcTileType(23, 8)).toBe("right");
  });

  // Центральные ячейки
  test('should return "center" for cells not on the edges', () => {
    expect(calcTileType(9, 8)).toBe("center");
    expect(calcTileType(18, 8)).toBe("center");
    expect(calcTileType(45, 8)).toBe("center");
  });

  // Дополнительные тесты для других размеров поля
  test("should work for different board sizes", () => {
    expect(calcTileType(0, 5)).toBe("top-left");
    expect(calcTileType(4, 5)).toBe("top-right");
    expect(calcTileType(20, 5)).toBe("bottom-left");
    expect(calcTileType(16, 5)).toBe("center");
    expect(calcTileType(2, 5)).toBe("top");
    expect(calcTileType(22, 5)).toBe("bottom");
    expect(calcTileType(5, 5)).toBe("left");
    expect(calcTileType(9, 5)).toBe("right");
    expect(calcTileType(12, 5)).toBe("center");
  });
});
