/*
Soldiers are able to bolster their allies and increase their power.
*/

export class GameManager {
  start() {
    console.log("Starting game");
    this.goToNextLevel();
  }
  stop() {
    console.log("Stopping game");
  }

  public goToNextLevel() {}
}
