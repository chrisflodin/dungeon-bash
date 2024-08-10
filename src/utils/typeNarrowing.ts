import { BattleLevel, Level, LevelType, ShopLevel } from "../level";
import {
  BattleLevelConfig,
  LevelConfig,
  ShopLevelConfig,
} from "../level/configs";

export function isBattleLevelConfig(
  level: LevelConfig
): level is BattleLevelConfig {
  return level.type === LevelType.BATTLE;
}

export function isShopLevelConfig(
  level: LevelConfig
): level is ShopLevelConfig {
  return level.type === LevelType.SHOP;
}

export function isBattleLevel(level: Level): level is BattleLevel {
  return level.type === LevelType.BATTLE;
}

export function isShopLevel(level: Level): level is ShopLevel {
  return level.type === LevelType.SHOP;
}
