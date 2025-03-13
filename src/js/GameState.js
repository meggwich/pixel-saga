export default class GameState {
  // Метод для создания объекта GameState из произвольного объекта
  static from(object) {
    if (object && object.currentTurn) {
      return new GameState(object.currentTurn);
    }
    return new GameState(); // По умолчанию ход игрока
  }
}
