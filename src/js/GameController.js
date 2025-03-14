import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import PositionedCharacter from "./PositionedCharacter";
import { GameState } from "./GameState";
import cursors from "./cursors";
import { parametrs, coordinates } from "./constants";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = null;
    this.enemyTeam = null;
    this.positions = new Set();
    this.savedState = GameState.from({
      currentTurn: "player",
      currentLevel: 1,
    });
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
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
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
    // Check if it's computer's turn
    if (this.savedState.currentTurn === "computer") {
      return;
    }

    if (
      this.selected &&
      this.getAvailableMovingCells(this.selected).has(index)
    ) {
      // Если клетка свободна, перемещаем персонажа
      this.gamePlay.deselectCell(this.selected.position);
      const oldPosition = this.selected.position;
      this.positions.delete(oldPosition);
      this.selected.position = index;
      this.positions.add(index);
      this.gamePlay.deselectCell(index);
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
      this.selected = null;
      this.savedState = GameState.from({
        currentTurn: "computer",
        currentLevel: this.savedState.currentLevel,
      });
      this.computerTurn();
      return;
    }

    if (this.selected && this.cellCanBeAttacked(this.selected, index)) {
      const enemyPositionedCharacter = this.findCharacterByPosition(
        this.enemyTeam,
        index,
      );
      if (enemyPositionedCharacter != undefined) {
        const attacker = this.selected.character;
        const target = enemyPositionedCharacter.character;
        const damage = Math.max(
          attacker.attack - target.defence,
          attacker.attack * 0.1,
        );
        this.gamePlay.showDamage(index, damage).then(() => {
          target.health -= damage;
          if (target.health <= 0) {
            this.positions.delete(enemyPositionedCharacter.position);
            this.enemyTeam = this.enemyTeam.filter(
              (posChar) => posChar.character !== target,
            );
          }
          this.gamePlay.deselectCell(this.selected.position);
          this.gamePlay.redrawPositions([
            ...this.playerTeam,
            ...this.enemyTeam,
          ]);
          this.selected = null;

          // Check if level is completed
          if (this.enemyTeam.length === 0) {
            this.checkForLevelUp();
          } else {
            this.savedState = GameState.from({
              currentTurn: "computer",
              currentLevel: this.savedState.currentLevel,
            });
            this.computerTurn();
          }
        });
      }
      return;
    }

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
  }

  onCellEnter(index) {
    this.gamePlay.setCursor(cursors.notallowed);
    if (this.selected) {
      if (!this.positions.has(index)) {
        const allowedCellsForMove = this.getAvailableMovingCells(this.selected);
        if (allowedCellsForMove.has(index)) {
          this.gamePlay.selectCell(index, "green");
          this.gamePlay.setCursor(cursors.pointer);
        }
      } else if (this.cellCanBeAttacked(this.selected, index)) {
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

    const playerPositionedCharacter = this.findCharacterByPosition(
      [...this.playerTeam],
      index,
    );
    const enemyPositionedCharacter = this.findCharacterByPosition(
      [...this.enemyTeam],
      index,
    );
    if (playerPositionedCharacter) {
      this.showCharacterTooltip(playerPositionedCharacter.character, index);
      this.gamePlay.setCursor(cursors.pointer);
    }

    if (enemyPositionedCharacter) {
      this.showCharacterTooltip(enemyPositionedCharacter.character, index);
    }
  }

  onCellLeave(index) {
    if (this.positions.has(index)) {
      this.gamePlay.hideCellTooltip(index);
      if (this.selected && this.cellCanBeAttacked(this.selected, index)) {
        const enemyPositionedCharacter = this.findCharacterByPosition(
          this.enemyTeam,
          index,
        );
        if (enemyPositionedCharacter) {
          this.gamePlay.deselectCell(index);
        }
      }
    } else if (this.selected) {
      const allowedCellsForMove = this.getAvailableMovingCells(this.selected);
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
    this.enemyTeam.forEach((posChar) =>
      this.gamePlay.deselectCell(posChar.position),
    );
  }

  showCharacterTooltip(character, index) {
    this.gamePlay.showCellTooltip(
      `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`,
      index,
    );
  }

  getAvailableMovingCells(positionedCharacter) {
    const type = positionedCharacter.character.type;
    const current = positionedCharacter.position;
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
    // Fix Set difference operation
    return new Set([...set].filter((x) => !this.positions.has(x)));
  }

  cellCanBeAttacked(attacker, targetIndex) {
    const type = attacker.character.type;
    const currentIndex = attacker.position;
    const { maxAttackDistance: d } = parametrs[type];
    const currentX = currentIndex % 8;
    const currentY = Math.floor(currentIndex / 8);
    const targetX = targetIndex % 8;
    const targetY = Math.floor(targetIndex / 8);
    const xPass = targetX >= currentX - d && targetX <= currentX + d;
    const yPass = targetY >= currentY - d && targetY <= currentY + d;
    if (xPass && yPass) return true;
    return false;
  }

  computerTurn() {
    if (this.enemyTeam.length === 0) {
      this.savedState = GameState.from({
        currentTurn: "player",
        currentLevel: this.savedState.currentLevel,
      });
      return;
    }

    // Try to find an attacker that can attack a player character
    let canAttack = false;
    let bestAttacker = null;
    let bestTarget = null;
    let maxDamage = 0;

    // Find the best attack opportunity
    for (const attacker of this.enemyTeam) {
      for (const target of this.playerTeam) {
        if (this.cellCanBeAttacked(attacker, target.position)) {
          const damage = Math.max(
            attacker.character.attack - target.character.defence,
            attacker.character.attack * 0.1,
          );

          // If this attack would kill the target or deals more damage than previous options
          if (target.character.health <= damage || damage > maxDamage) {
            canAttack = true;
            bestAttacker = attacker;
            bestTarget = target;
            maxDamage = damage;
          }
        }
      }
    }

    if (canAttack && bestAttacker && bestTarget) {
      // Attack the target
      this.attack(bestAttacker, bestTarget);
    } else {
      // If no attack is possible, move towards nearest target
      const attacker = this.selectBestAttacker();
      const target = this.findNearestTarget(attacker);

      if (target) {
        // Get available cells for movement
        const availableMoveCells = this.getAvailableMovingCells(attacker);

        // Move towards target
        this.moveTowardsTarget(attacker, target, availableMoveCells);
      }
    }

    // Check if game is over
    if (this.playerTeam.length === 0) {
      this.checkForGameOver();
    } else {
      // Передаем ход игроку
      this.savedState = GameState.from({
        currentTurn: "player",
        currentLevel: this.savedState.currentLevel,
      });
    }
  }

  selectBestAttacker() {
    // Select the character with highest attack value
    return this.enemyTeam.reduce((best, current) => {
      return !best || current.character.attack > best.character.attack
        ? current
        : best;
    }, null);
  }

  moveTowardsTarget(attacker, target, availableMoveCells) {
    if (availableMoveCells.size === 0) return;

    let bestCell = attacker.position;
    let minDistance = Infinity;

    // Convert Set to Array for iteration
    const moveCells = Array.from(availableMoveCells);
    for (const cell of moveCells) {
      const distance = this.calculateDistance(cell, target.position);
      if (distance < minDistance) {
        minDistance = distance;
        bestCell = cell;
      }
    }

    // Перемещаем персонажа на выбранную клетку, если она отличается от текущей
    if (bestCell !== attacker.position) {
      this.positions.delete(attacker.position);
      attacker.position = bestCell;
      this.positions.add(bestCell);
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
    }
  }

  // Метод для поиска ближайшей цели
  findNearestTarget(attacker) {
    if (this.playerTeam.length === 0) return null;

    let nearestTarget = null;
    let minDistance = Infinity;

    this.playerTeam.forEach((playerCharacter) => {
      const distance = this.calculateDistance(
        attacker.position,
        playerCharacter.position,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestTarget = playerCharacter;
      }
    });

    return nearestTarget;
  }

  // Метод для вычисления расстояния между двумя клетками
  calculateDistance(position1, position2) {
    const x1 = position1 % 8;
    const y1 = Math.floor(position1 / 8);
    const x2 = position2 % 8;
    const y2 = Math.floor(position2 / 8);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  // Метод для выполнения атаки
  attack(attacker, target) {
    const damage = Math.max(
      attacker.character.attack - target.character.defence,
      attacker.character.attack * 0.1,
    );

    // Наносим урон
    target.character.health -= damage;

    // Показываем урон на поле
    this.gamePlay.showDamage(target.position, damage);

    // Перерисовываем позиции
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);

    // Проверяем, умер ли персонаж
    if (target.character.health <= 0) {
      this.gamePlay.deselectCell(target.position);
      this.playerTeam = this.playerTeam.filter((char) => char !== target);
      this.positions = this.positions.difference(new Set([target.position]));
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
    }
  }

  checkForLevelUp() {
    if (this.enemyTeam.length === 0) {
      this.levelUpCharacters();
      this.startNewLevel();
    }
  }

  levelUpCharacters() {
    this.playerTeam.forEach((positionedCharacter) => {
      const character = positionedCharacter.character;
      character.level += 1;
      character.health = Math.min(character.level + 80, 100);
      character.attack = Math.max(
        character.attack,
        character.attack * ((80 + character.health) / 100),
      );
      character.defence = Math.max(
        character.defence,
        character.defence * ((80 + character.health) / 100),
      );
    });
  }

  startNewLevel() {
    const themes = ["prairie", "desert", "arctic", "mountain"];
    const currentThemeIndex = themes.indexOf(this.gamePlay.theme);
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    this.gamePlay.drawUi(nextTheme);

    // Генерация новой команды противников
    this.enemyTeam = this.generateTeamWithPositions({
      types: [Daemon, Undead, Vampire],
      maxLevel: this.savedState.currentLevel + 1,
      characterCount: 2,
      availablePositions: [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 62,
      ],
    });

    // Перерисовка позиций
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
  }
  checkForGameOver() {
    if (this.playerTeam.length === 0) {
      this.gameOver();
    } else if (this.savedState.currentLevel >= 4) {
      this.gameOver(true);
    }
  }

  gameOver(isVictory = false) {
    this.gamePlay.blockField();
    if (isVictory) {
      this.gamePlay.showMessage("Поздравляем! Вы прошли все уровни!");
    } else {
      this.gamePlay.showMessage("Игра окончена. Вы проиграли.");
    }
  }

  newGame() {
    this.playerTeam = null;
    this.enemyTeam = null;
    this.positions = new Set();
    this.savedState = GameState.from({
      currentTurn: "player",
      currentLevel: 1,
    });
    this.init();
  }
}
