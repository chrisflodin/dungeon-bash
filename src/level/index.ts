import { randomUUID, UUID } from "crypto";
import { Unit, UnitFactory, UnitType } from "../unit";

interface UnitInLevel {}

// Stored in db
export interface LevelDTO {
  id: UUID;
  name: string;
  possibleUnits: UnitType[];
  numberOfUnits: number;
}

export interface Level {
  name: string;
  sequence: number;
  units: Unit[];
}

export class LevelBuilder {
  unitFactory: UnitFactory;

  constructor(unitFactory: UnitFactory) {
    this.unitFactory = unitFactory;
  }

  build(): Level[] {
    return LEVELS.map((level, i) => {
      const units: Unit[] = [];
      for (let i = 0; i < level.numberOfUnits; i++) {
        const typeIndex = Math.floor(
          Math.random() * level.possibleUnits.length
        );
        const type = level.possibleUnits[typeIndex];
        const unit = this.unitFactory.make(type);
        units.push(unit);
      }

      return {
        name: level.name,
        sequence: i,
        units,
      };
    });
  }
}

export const LEVELS: LevelDTO[] = [
  {
    id: randomUUID(),
    name: "Test",
    numberOfUnits: 2,
    possibleUnits: ["Barbarian", "Soldier"],
  },
  {
    id: randomUUID(),
    name: "Test2",
    numberOfUnits: 3,
    possibleUnits: ["Barbarian", "Soldier"],
  },
];
