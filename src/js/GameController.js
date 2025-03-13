import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import PositionedCharacter from "./PositionedCharacter";
import GameState from "./GameState";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = null;
    this.enemyTeam = null;
    this.positions = new Set();
    this.savedState = GameState.from({ currentTurn: "player" });
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    // Генерация команд с использованием объекта для передачи параметров
    this.playerTeam = this.generateTeamWithPositions({
      types: [Bowman, Swordsman, Magician],
      maxLevel: 1,
      characterCount: 2,
      availablePositions: [
        0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
      ],
    });

    this.enemyTeam = this.generateTeamWithPositions({
      types: [Daemon, Undead, Vampire],
      maxLevel: 1,
      characterCount: 2,
      availablePositions: [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 62,
      ],
    });

    // Отрисовка
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  generateTeamWithPositions({
    types,
    maxLevel,
    characterCount,
    availablePositions,
  }) {
    const team = generateTeam(types, maxLevel, characterCount);
    const positions = this.getRandomPositions(
      availablePositions,
      team.characters.length,
    );
    return team.characters.map(
      (character, index) =>
        new PositionedCharacter(character, positions[index]),
    );
  }

  getRandomPositions(availablePositions, count) {
    const positions = [];
    while (positions.length < count) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      if (!positions.includes(position)) {
        positions.push(position);
        this.positions.add(position);
      }
    }
    return positions;
  }

  onCellClick(index) {
    if (!this.positions.has(index)) {
      GamePlay.showError("Была нажата пустая ячейка");
      return;
    }

    const playerCharacter = this.findCharacterByPosition(
      this.playerTeam,
      index,
    );
    if (playerCharacter) {
      this.deselectAllCells();
      this.gamePlay.selectCell(index);
      return;
    }

    const enemyCharacter = this.findCharacterByPosition(this.enemyTeam, index);
    if (enemyCharacter) {
      GamePlay.showError("Был нажат персонаж противника");
    }
  }

  onCellEnter(index) {
    if (!this.positions.has(index)) return;

    const character = this.findCharacterByPosition(
      [...this.playerTeam, ...this.enemyTeam],
      index,
    );
    if (character) {
      this.showCharacterTooltip(character, index);
    }
  }

  onCellLeave(index) {
    if (this.positions.has(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  findCharacterByPosition(team, position) {
    return team.find((posChar) => posChar.position === position)?.character;
  }

  deselectAllCells() {
    this.playerTeam.forEach((posChar) =>
      this.gamePlay.deselectCell(posChar.position),
    );
  }

  showCharacterTooltip(character, index) {
    this.gamePlay.showCellTooltip(
      `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`,
      index,
    );
  }
}
