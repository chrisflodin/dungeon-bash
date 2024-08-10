/*
Soldiers are able to bolster their allies and increase their power.
*/

import { BattleManager } from "./battle";
import { Level, LevelType } from "./level";
import { ShopManager } from "./shop";
import { HeroProfile, HeroState } from "./unit";
import { isBattleLevel, isShopLevel } from "./utils/typeNarrowing";

export interface LevelResult {
  state: HeroState;
}

export class GameManager {
  battleManager: BattleManager;
  shopManager: ShopManager;
  hero: HeroProfile;
  levels: Level[];

  constructor({
    levels,
    hero,
    battleManager,
    shopManager,
  }: {
    levels: Level[];
    battleManager: BattleManager;
    shopManager: ShopManager;
    hero: HeroProfile;
  }) {
    this.battleManager = battleManager;
    this.shopManager = shopManager;
    this.hero = hero;
    this.levels = levels;
  }

  async #playLevel(level: Level): Promise<LevelResult> {
    switch (level.type) {
      case LevelType.BATTLE:
        if (isBattleLevel(level))
          return await this.battleManager.playBattle(level, this.hero);
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
