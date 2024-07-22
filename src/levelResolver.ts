import { BattleResolver } from "./battle";
import { Level, LevelBuilder } from "./level";
import { Hero } from "./unit";

export class LevelResolver {
  #levels: Level[];
  #battleResolver: BattleResolver;

  constructor(levelbuilder: LevelBuilder, battleResolver: BattleResolver) {
    this.#levels = levelbuilder.build();
    this.#battleResolver = battleResolver;
  }

  *levelGenerator(levels: Level[]): Generator<Level, undefined, void> {
    for (const level of levels) {
      yield level;
    }
  }

  async runBattles(hero: Hero): Promise<Hero | undefined> {
    const levelIterator = this.levelGenerator(this.#levels);
    let completed = false;

    let levelResult: Hero | undefined;
    do {
      let level = levelIterator.next() as {
        value: Level | undefined;
        done: boolean;
      };
      const { done, value } = level;

      if (done || !value) {
        completed = done;
        break;
      }
      levelResult = await this.#battleResolver.initiateBattle(value, hero);
      if (typeof levelResult === "undefined") return;
    } while (!completed);
    return levelResult;
  }
}
