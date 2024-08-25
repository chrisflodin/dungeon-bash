import { BattleManager } from "./battle";
import { Level, LevelType } from "./level";
import { ShopManager } from "./shop";
import { UIWorld } from "./ui-render";
import { Hero } from "./unit";
import { isBattleLevel, isShopLevel } from "./utils/typeNarrowing";

export class GameManager {
  hero: Hero;
  levels: Level[];
  battleManager: BattleManager;
  shopManager: ShopManager;

  constructor({
    hero,
    levels,
    battleManager,
    shopManager,
  }: {
    hero: Hero;
    levels: Level[];
    battleManager: BattleManager;
    shopManager: ShopManager;
  }) {
    this.hero = hero;
    this.levels = levels;
    this.battleManager = battleManager;
    this.shopManager = shopManager;
  }

  async #playLevel(level: Level): Promise<Hero> {
    switch (level.type) {
      case LevelType.BATTLE:
        if (isBattleLevel(level)) {
          await UIWorld.printFrame(this.hero, ["Starting battle"]);
          const hero = await this.battleManager.playBattle(level, this.hero);
          await UIWorld.printFrame(hero, [
            hero.health > 0 ? "You won the battle!" : "You lost :(",
          ]);
          return hero;
        }
      case LevelType.SHOP:
        if (isShopLevel(level))
          return await this.shopManager.visitShop(this.hero);
      default:
        throw Error(`Level: ${level.name} has type ${level.type}`);
    }
  }

  async playLevels() {
    for await (const level of this.levels) {
      await this.#playLevel(level);
    }
  }
}
