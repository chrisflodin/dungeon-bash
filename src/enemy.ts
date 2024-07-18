type EnemyMap = {
  Soldier: typeof Soldier;
  Warlock: typeof Warlock;
};

export type EnemyName = keyof EnemyMap;

export interface EnemyConfig {
  type: EnemyName;
  number: number;
}

export abstract class Enemy {
  protected _power: number;
  protected _allies: Enemy[] = [];

  constructor(power: number) {
    this._power = power;
  }

  // BAD It should not be the enemy's responsibility to keep track of which allies it has.
  public assignAllies(allies: Enemy[]) {
    this._allies = allies;
  }

  public increasePower(power: number) {
    this._power += power;
  }

  abstract attack(): number;
  abstract initialSpecial(): void;
}

export class Soldier extends Enemy {
  constructor() {
    super(10);
  }

  attack(): number {
    return this._power;
  }

  bolster() {
    for (const ally of this._allies) {
      ally.increasePower(5);
    }
  }

  initialSpecial(): void {
    this.bolster();
  }
}

export class Warlock extends Enemy {
  constructor() {
    super(10);
  }

  attack(): number {
    throw new Error("Not implemented");
    return this._power;
  }

  initialSpecial(): void {
    throw new Error("Not implemented");
  }
}
export class EnemyFactory {
  make(config: EnemyConfig) {
    switch (config.type) {
      case "Soldier":
        return new Soldier();
      case "Warlock":
        return new Warlock();
    }
  }
}
