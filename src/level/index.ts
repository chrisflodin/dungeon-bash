import { randomUUID, UUID } from "crypto";
import { EnemyFactory, UnitProfile, UnitType } from "../unit";
import { isBattleLevelConfig, isShopLevelConfig } from "../utils/typeNarrowing";
import { BattleLevelConfig, LevelConfig } from "./configs";

export enum LevelType {
  BATTLE = "BATTLE",
  SHOP = "SHOP",
}

export type Level = BattleLevel | ShopLevel;
export interface BattleLevel {
  id: UUID;
  type: LevelType;
  name?: string;
  sequence?: number;
  enemies: UnitProfile[];
  possibleUnits?: UnitType[];
  numberOfUnits?: number;
}

export interface ShopLevel {
  id: UUID;
  type: LevelType;
  name?: string;
  sequence?: number;
  items: any[];
}

export class BattleLevelBuilder {
  #unitFactory: EnemyFactory;

  constructor(unitFactory: EnemyFactory) {
    this.#unitFactory = unitFactory;
  }

  buildLevel(levelConfig: BattleLevelConfig, index: number): BattleLevel {
    const enemies: UnitProfile[] = [];
    const { name, numberOfUnits, possibleUnits, type } = levelConfig;
    for (let i = 0; i < numberOfUnits; i++) {
      const typeIndex = Math.floor(Math.random() * possibleUnits.length);
      const type = possibleUnits[typeIndex];
      const unit = this.#unitFactory.make(type);
      enemies.push(unit);
    }

    return {
      id: randomUUID(),
      name: name,
      sequence: index,
      type,
      enemies,
    };
  }
}

// Not implemented
export class ShopLevelBuilder {
  buildLevel(): ShopLevel {
    return {
      id: randomUUID(),
      name: "Name",
      items: [],
      type: LevelType.SHOP,
      sequence: 0,
    };
  }
}

export class LevelBuilder {
  battleLevelBuilder: BattleLevelBuilder;
  shopLevelBuilder: ShopLevelBuilder;

  constructor(
    battleLevelBuilder: BattleLevelBuilder,
    shopLevelBuilder: ShopLevelBuilder
  ) {
    this.battleLevelBuilder = battleLevelBuilder;
    this.shopLevelBuilder = shopLevelBuilder;
  }

  build(levelConfigs: LevelConfig[]): Level[] {
    const built: Level[] = [];
    levelConfigs.forEach((config, i) => {
      switch (config.type) {
        case LevelType.BATTLE:
          if (isBattleLevelConfig(config))
            built.push(this.battleLevelBuilder.buildLevel(config, i));
          break;
        case LevelType.SHOP:
          // Not implemented yet
          if (isShopLevelConfig(config))
            built.push(this.shopLevelBuilder.buildLevel());

        default:
          throw new Error(`Level type: ${config.type} not recognized`);
      }
    });
    return built;
  }
}
