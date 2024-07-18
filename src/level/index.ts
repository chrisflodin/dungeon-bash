import { Enemy, EnemyConfig, EnemyFactory } from "../enemy";
import { ENEMIES_IN_LEVEL, LevelGenerationConfig } from "./config";

interface LevelConfig {
  name: string;
  enemies: EnemyConfig[];
}

class Level {
  #name: string;
  #enemies: Enemy[] = [];

  constructor(name: string, enemies: Enemy[]) {
    this.#name = name;
    this.#enemies = enemies;
  }

  displayEnemies() {
    console.log("------");
    console.log("LEVEL");
    console.log(this.#name);
    console.log(this.#enemies);
    console.log("------");
  }
}

export class LevelFactory {
  #enemyFactory: EnemyFactory;
  constructor(enemyFactory: EnemyFactory) {
    this.#enemyFactory = enemyFactory;
  }

  make(config: LevelConfig) {
    const enemies = config.enemies.map((eConf) => {
      return this.#enemyFactory.make(eConf);
    });
    return new Level("1", enemies);
  }
}

export class LevelBuilder {
  #levelFactory: LevelFactory;

  constructor(levelFactory: LevelFactory) {
    this.#levelFactory = levelFactory;
  }

  build(): Level[] {
    return ENEMIES_IN_LEVEL.map((generationConfig) => {
      const config = this.#generateLevelFromConfig(generationConfig);
      return this.#levelFactory.make(config);
    });
  }

  #generateLevelFromConfig(config: LevelGenerationConfig): LevelConfig {
    return {
      name: "Level 1",
      enemies: [{ number: 1, type: "Soldier" }],
    };
  }
}
