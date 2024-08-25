import { LevelType } from ".";
import { UnitType } from "../unit";

export interface LevelConfig {
  name: string;
  type: LevelType;
}

export interface BattleLevelConfig extends LevelConfig {
  name: string;
  canEncounterUnitType: UnitType[];
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
    canEncounterUnitType: ["barbarian", "soldier"],
    type: LevelType.BATTLE,
  },
  {
    name: "Test2",
    numberOfUnits: 3,
    canEncounterUnitType: ["barbarian", "soldier"],
    type: LevelType.BATTLE,
  },
];

// Not implemented
export const SHOP_LEVELS: ShopLevelConfig[] = [];
