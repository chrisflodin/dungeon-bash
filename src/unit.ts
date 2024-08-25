import { randomUUID, UUID } from "crypto";
import { random } from "./utils/random";

export type UnitType = "soldier" | "barbarian";
export interface UnitConfig {
  type: UnitType;
  number: number;
}

export class Unit {
  readonly name: string;
  readonly id: UUID;
  attackDamage: number;
  initiative: number;
  health: number;

  constructor({
    name,
    attackDamage,
    health,
    initiative,
  }: {
    name: string;
    health: number;
    attackDamage: number;
    initiative: number;
  }) {
    this.id = randomUUID();
    this.name = this instanceof Hero ? name : `${name}-${this.id.slice(0, 4)}`;
    this.attackDamage = attackDamage;
    this.health = health;
    this.initiative = initiative;
  }
}
export class Hero extends Unit {
  xp = 0;
  level = 1;

  constructor() {
    super({
      name: "Hero",
      attackDamage: 5,
      health: 10,
      initiative: 12,
    });
  }
}
export class EnemyFactory {
  make(unitType: UnitType) {
    switch (unitType) {
      case "soldier":
        return new Unit({
          name: "Soldier",
          attackDamage: random(1, 3),
          health: random(2, 5),
          initiative: random(3, 8),
        });
      case "barbarian":
        return new Unit({
          name: "Soldier",
          attackDamage: random(3, 5),
          health: random(5, 8),
          initiative: random(5, 13),
        });
    }
  }
}
