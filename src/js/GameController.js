import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import PositionedCharacter from "./PositionedCharacter";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = null;
    this.enemyTeam = null;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];

    // Генерация команд
    this.playerTeam = generateTeam(playerTypes, 1, 2);
    this.enemyTeam = generateTeam(enemyTypes, 1, 2);

    // Размещение персонажей игрока в столбцах 1 и 2
    const playerPositions = this.getRandomPositions(
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      this.playerTeam.characters.length,
    );
    this.playerTeam = this.playerTeam.characters.map(
      (character, index) =>
        new PositionedCharacter(character, playerPositions[index]),
    );

    // Размещение персонажей соперника в столбцах 7 и 8
    const enemyPositions = this.getRandomPositions(
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 62],
      this.enemyTeam.characters.length,
    );
    this.enemyTeam = this.enemyTeam.characters.map(
      (character, index) =>
        new PositionedCharacter(character, enemyPositions[index]),
    );

    // Отрисовка
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
  }

  // Вспомогательная функция для получения случайных позиций
  getRandomPositions(availablePositions, count) {
    const positions = [];
    while (positions.length < count) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      if (!positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
