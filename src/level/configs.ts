import { LevelType } from ".";
import { UnitType } from "../unit";

export interface LevelConfig {
  name: string;
  type: LevelType;
}

export interface BattleLevelConfig extends LevelConfig {
  name: string;
  possibleUnits: UnitType[];
  numberOfUnits: number;
  type: LevelType.BATTLE;
}

// Not implemented
export interface ShopLevelConfig extends LevelConfig {
  name: string;
  possibleItems: any[];
  type: LevelType.SHOP;
}

export const BATTLE_LEVELS: BattleLevelConfig[] = [
  {
    name: "Test",
    numberOfUnits: 2,
    possibleUnits: ["Barbarian", "Soldier"],
    type: LevelType.BATTLE,
  },
  {
    name: "Test2",
    numberOfUnits: 3,
    possibleUnits: ["Barbarian", "Soldier"],
    type: LevelType.BATTLE,
  },
];

// Not implemented
export const SHOP_LEVELS: ShopLevelConfig[] = [];
