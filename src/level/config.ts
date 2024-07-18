import { EnemyName } from "../enemy";

export interface LevelGenerationConfig {
  level: number;
  possibleEnemies: EnemyName[];
}

export const ENEMIES_IN_LEVEL: LevelGenerationConfig[] = [
  {
    level: 1,
    possibleEnemies: ["Soldier"],
  },
  {
    level: 2,
    possibleEnemies: ["Soldier"],
  },
  {
    level: 3,
    possibleEnemies: ["Soldier", "Warlock"],
  },
];
