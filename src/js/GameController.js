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
import cursors from "./cursors";
import { parametrs, coordinates } from "./constants";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = null;
    this.enemyTeam = null;
    this.positions = new Set();
    this.savedState = GameState.from({ currentTurn: "player" });
    this.selected = null;
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
    // if (this.selected && this.positions.has(index)) {
    //   const enemyCharacter = this.findCharacterByPosition(this.enemyTeam, index);
    //   enemyCharacter != - 1 ?
    // }

    const playerCharacter = this.findCharacterByPosition(
      this.playerTeam,
      index,
    );
    if (playerCharacter) {
      this.deselectAllCells();
      this.gamePlay.selectCell(index);
      this.selected = playerCharacter;
      return;
    }

    const enemyCharacter = this.findCharacterByPosition(this.enemyTeam, index);
    if (enemyCharacter) {
      GamePlay.showError("Был нажат персонаж противника");
    }
  }

  onCellEnter(index) {
    this.gamePlay.setCursor(cursors.notallowed);
    if (this.selected) {
      const type = this.selected.character.type;
      const position = this.selected.position;
      if (!this.positions.has(index)) {
        const allowedCellsForMove = this.getAvailableMovingCells(
          type,
          position,
        );
        if (allowedCellsForMove.has(index)) {
          this.gamePlay.selectCell(index, "green");
          this.gamePlay.setCursor(cursors.pointer);
        }
      } else if (this.cellCanBeAttacked(type, position, index)) {
        const enemyPositionedCharacter = this.findCharacterByPosition(
          this.enemyTeam,
          index,
        );
        if (enemyPositionedCharacter != undefined) {
          this.gamePlay.selectCell(index, "red");
          this.gamePlay.setCursor(cursors.crosshair);
        }
      }
    }

    const playerCharacter = this.findCharacterByPosition(
      [...this.playerTeam],
      index,
    );
    const enemyCharacter = this.findCharacterByPosition(
      [...this.enemyTeam],
      index,
    );
    if (playerCharacter) {
      this.showCharacterTooltip(playerCharacter.character, index);
      this.gamePlay.setCursor(cursors.pointer);
    }

    if (enemyCharacter) {
      this.showCharacterTooltip(enemyCharacter.character, index);
    }
  }

  onCellLeave(index) {
    if (this.positions.has(index)) {
      this.gamePlay.hideCellTooltip(index);
      if (
        this.selected &&
        this.cellCanBeAttacked(
          this.selected.character.type,
          this.selected.position,
          index,
        )
      ) {
        const enemyPositionedCharacter = this.findCharacterByPosition(
          this.enemyTeam,
          index,
        );
        if (enemyPositionedCharacter != undefined) {
          this.gamePlay.deselectCell(index);
        }
      }
    } else if (this.selected) {
      const allowedCellsForMove = this.getAvailableMovingCells(
        this.selected.character.type,
        this.selected.position,
      );
      if (allowedCellsForMove.has(index)) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  findCharacterByPosition(team, position) {
    return team.find((posChar) => posChar.position === position);
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

  getAvailableMovingCells(type, current) {
    const { maxMoveDistance } = parametrs[type];
    let set = new Set();
    const currentX = current % 8;
    const currentY = Math.floor(current / 8);
    for (let i = 1; i <= maxMoveDistance; i++) {
      coordinates.forEach(([x, y]) => {
        const newX = currentX + x * i;
        const newY = currentY + y * i;
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          set.add(newX + newY * 8);
        }
      });
    }
    return set.difference(this.positions);
  }
  cellCanBeAttacked(type, current, target) {
    const { maxAttackDistance: d } = parametrs[type];
    const currentX = current % 8;
    const currentY = Math.floor(current / 8);
    const targetX = target % 8;
    const targetY = Math.floor(target / 8);
    const xPass = targetX >= currentX - d && targetX <= currentX + d;
    const yPass = targetY >= currentY - d && targetY <= currentY + d;
    if (xPass && yPass) return true;
    return false;
  }
}
