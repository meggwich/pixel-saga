export class GameState {
  constructor(currentTurn = "player", currentLevel = 1, maxScore = 0) {
    this.currentTurn = currentTurn;
    this.currentLevel = currentLevel;
    this.maxScore = maxScore;
  }

  static from(object) {
    if (object && object.currentTurn) {
      return new GameState(
        object.currentTurn,
        object.currentLevel,
        object.maxScore,
      );
    }
    return new GameState();
  }
}
