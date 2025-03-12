import { calcTileType } from "../../js/utils";

describe("calcTileType", () => {
  const testCases = [
    // Угловые ячейки
    { index: 0, boardSize: 8, expected: "top-left" },
    { index: 7, boardSize: 8, expected: "top-right" },
    { index: 56, boardSize: 8, expected: "bottom-left" },
    { index: 63, boardSize: 8, expected: "bottom-right" },

    // Крайние ячейки (не угловые)
    { index: 1, boardSize: 8, expected: "top" },
    { index: 6, boardSize: 8, expected: "top" },
    { index: 57, boardSize: 8, expected: "bottom" },
    { index: 62, boardSize: 8, expected: "bottom" },
    { index: 8, boardSize: 8, expected: "left" },
    { index: 16, boardSize: 8, expected: "left" },
    { index: 15, boardSize: 8, expected: "right" },
    { index: 23, boardSize: 8, expected: "right" },

    // Центральные ячейки
    { index: 9, boardSize: 8, expected: "center" },
    { index: 18, boardSize: 8, expected: "center" },
    { index: 45, boardSize: 8, expected: "center" },

    // Дополнительные тесты для других размеров поля
    { index: 0, boardSize: 5, expected: "top-left" },
    { index: 4, boardSize: 5, expected: "top-right" },
    { index: 20, boardSize: 5, expected: "bottom-left" },
    { index: 16, boardSize: 5, expected: "center" },
    { index: 2, boardSize: 5, expected: "top" },
    { index: 22, boardSize: 5, expected: "bottom" },
    { index: 5, boardSize: 5, expected: "left" },
    { index: 9, boardSize: 5, expected: "right" },
    { index: 12, boardSize: 5, expected: "center" },
  ];

  testCases.forEach(({ index, boardSize, expected }) => {
    test(`should return "${expected}" for index ${index} on board size ${boardSize}`, () => {
      expect(calcTileType(index, boardSize)).toBe(expected);
    });
  });
});
