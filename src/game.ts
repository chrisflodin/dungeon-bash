/*
Soldiers are able to bolster their allies and increase their power.
*/

import { LevelResolver } from "./levelResolver";
import { Hero } from "./unit";

export class GameManager {
  levelResolver: LevelResolver;
  hero: Hero;

  constructor(levelResolver: LevelResolver, hero: Hero) {
    this.levelResolver = levelResolver;
    this.hero = hero;
  }

  async start() {
    console.log("Starting game");
    console.log();
    await this.levelResolver.runBattles(this.hero);
    console.log("Game over");
  }
  stop() {
    console.log("Stopping game");
  }
}
