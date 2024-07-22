import { randomUUID, UUID } from "crypto";

type UnitMap = {
  Soldier: typeof Soldier;
  Barbarian: typeof Barbarian;
};

export type UnitType = keyof UnitMap;

export interface UnitConfig {
  type: UnitType;
  number: number;
}

export abstract class Unit {
  readonly name: string;
  readonly isHero: boolean;
  readonly id: UUID;
  protected _allies: Unit[] = [];
  attackDamage: number;
  initiative: number;
  health: number;

  constructor({
    name,
    attackDamage,
    health,
    initiative,
    isHero,
  }: {
    name: string;
    health: number;
    attackDamage: number;
    initiative: number;
    isHero?: boolean;
  }) {
    this.id = randomUUID();
    this.name = isHero ? name : `${name}-${this.id.slice(0, 4)}`;
    this.isHero = isHero ?? false;
    this.attackDamage = attackDamage;
    this.health = health;
    this.initiative = initiative;
  }

  abstract attack(): number;
  abstract initialSpecial(): void;
}

export class Hero extends Unit {
  constructor() {
    super({
      name: "Hero",
      isHero: true,
      attackDamage: 5,
      health: 10,
      initiative: 12,
    });
  }

  attack(): number {
    return this.attackDamage;
  }

  initialSpecial(): void {
    // this.bolster();
  }
}
export class Soldier extends Unit {
  constructor() {
    super({
      name: "Soldier",
      attackDamage: random(1, 3),
      health: random(2, 5),
      initiative: random(3, 8),
    });
  }

  attack(): number {
    return this.attackDamage;
  }

  bolster() {
    // for (const ally of this._allies) {
    //   ally.increaseAttackDamage(5);
    // }
  }

  initialSpecial(): void {
    this.bolster();
  }
}

export class Barbarian extends Unit {
  constructor() {
    super({
      name: "Barbarian",
      attackDamage: random(3, 5),
      health: random(5, 8),
      initiative: random(5, 13),
    });
  }

  attack(): number {
    return this.attackDamage;
  }

  initialSpecial(): void {
    throw new Error("Not implemented");
  }
}
export class UnitFactory {
  make(unitType: UnitType) {
    switch (unitType) {
      case "Soldier":
        return new Soldier();
      case "Barbarian":
        return new Barbarian();
    }
  }
}
function random(arg0: number, arg1: number): number {
  throw new Error("Function not implemented.");
}
