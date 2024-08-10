import { randomUUID, UUID } from "crypto";
import { random } from "./utils/random";

type UnitMap = {
  Soldier: typeof SoldierProfile;
  Barbarian: typeof BarbarianProfile;
};

export type UnitType = keyof UnitMap;

export interface UnitConfig {
  type: UnitType;
  number: number;
}

export abstract class UnitProfile {
  readonly name: string;
  readonly isHero: boolean;
  readonly id: UUID;
  protected _allies: UnitProfile[] = [];
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

export type HeroState = Pick<UnitProfile, "health">;

export class HeroProfile extends UnitProfile {
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
export class SoldierProfile extends UnitProfile {
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

export class BarbarianProfile extends UnitProfile {
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
export class EnemyFactory {
  make(unitType: UnitType) {
    switch (unitType) {
      case "Soldier":
        return new SoldierProfile();
      case "Barbarian":
        return new BarbarianProfile();
    }
  }
}
