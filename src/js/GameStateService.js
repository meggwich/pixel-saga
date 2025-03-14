import { GameState } from "./GameState";

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem("state", JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem("state"));
    } catch (e) {
      throw new Error("Invalid state");
    }
  }
  saveGameState() {
    this.stateService.save(this.savedState);
  }

  loadGameState() {
    try {
      const state = this.stateService.load();
      this.savedState = GameState.from(state);
      this.init();
    } catch (e) {
      this.gamePlay.showMessage("Не удалось загрузить состояние игры.");
    }
  }
}
