import { calcHealthLevel } from "../../js/utils";

describe("calcHealthLevel", () => {
  const testCases = [
    { health: 10, expected: "critical" },
    { health: 14, expected: "critical" },
    { health: 15, expected: "normal" },
    { health: 30, expected: "normal" },
    { health: 49, expected: "normal" },
    { health: 50, expected: "high" },
    { health: 75, expected: "high" },
    { health: 100, expected: "high" },
  ];

  testCases.forEach(({ health, expected }) => {
    test(`should return "${expected}" for health ${health}`, () => {
      expect(calcHealthLevel(health)).toBe(expected);
    });
  });
});
