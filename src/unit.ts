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
  initiative: number;
  protected _attackDamage: number;
  protected _allies: Unit[] = [];
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
    this.name = name;
    this.id = randomUUID();
    this.isHero = isHero ?? false;
    this._attackDamage = attackDamage;
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
      attackDamage: 3,
      health: 10,
      initiative: 12,
    });
  }

  attack(): number {
    return this._attackDamage;
  }

  initialSpecial(): void {
    // this.bolster();
  }
}
export class Soldier extends Unit {
  constructor() {
    super({
      name: "Soldier",
      attackDamage: 3,
      health: 5,
      initiative: 8,
    });
  }

  attack(): number {
    return this._attackDamage;
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
      attackDamage: 3,
      health: 8,
      initiative: 9,
    });
  }

  attack(): number {
    return this._attackDamage;
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
