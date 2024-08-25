import { UUID } from "crypto";
import { BattleLevel } from "../level";
import { UIBattle } from "../ui-render";
import { Hero, Unit } from "../unit";

enum ActionType {
  ATTACK,
  DEFEND,
}

interface Action {
  target: UUID;
  type: ActionType;
}

export type BattleState = {
  units: Array<Unit | Hero>;
  activeUnit?: string;
};

type ActionResult = {
  description: string;
  state: BattleState;
};

export class BattleManager {
  turn: number;
  turnOrder: UUID[] = [];

  constructor() {
    this.turn = 0;
    this.turnOrder = [];
  }

  async playBattle(level: BattleLevel, hero: Hero): Promise<Hero> {
    let state: BattleState = {
      units: [...level.enemies, hero],
      activeUnit: undefined,
    };
    this.turn = 0;
    this.turnOrder = this.calculateTurnOrder(state);

    while (true) {
      state = await this.playTurn(state);

      const hero = this.getHero(state);
      const isEnemiesDefeated = this.getEnemies(state).every(
        (e) => e.health < 1
      );
      const isHeroDefeated = hero.health < 1;

      if (isEnemiesDefeated || isHeroDefeated) return hero;
    }
  }

  async playTurn(state: BattleState): Promise<BattleState> {
    const hero = state.units.find((u) => u instanceof Hero);
    const enemies = state.units.filter((u) => !(u instanceof Hero));
    if (!hero) throw Error("Hero not found");
    if (!enemies) throw Error("Enemies not found");

    // Determine active unit
    state = this.#updateActiveUnit(state);
    const activeUnit = this.getActiveUnit(state);
    const heroTurn: boolean = activeUnit instanceof Hero;

    // Determine target
    const possibleTargets = enemies.filter((e) => e.health > 0);
    const target: Unit = heroTurn
      ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
      : hero;

    // End unit turn if dead
    if (activeUnit.health < 1) {
      await UIBattle.printFrame(
        state,
        `${activeUnit.name} is dead, skipping turn...`
      );
      this.#incrementTurn();
      return state;
    }

    // Determine kind of action. Is static for now.
    const action: Action = {
      type: ActionType.ATTACK,
      target: target.id,
    };

    const intendedAction = UIBattle.getIntendedAction({
      actor: activeUnit,
      description: "attack",
      targets: [target],
    });

    await UIBattle.printFrame(state, intendedAction);

    const result = this.resolveAction({
      action,
      state,
      target,
    });
    state = result.state;

    await UIBattle.printFrame(state, result.description);

    this.#incrementTurn();
    return state;
  }
  getActiveUnit(state: BattleState) {
    const unit = state.units.find((u) => u.id === state.activeUnit);
    if (!unit) throw Error("Could not get active unit");
    return unit;
  }

  resolveAction({
    action,
    state,
    target,
  }: {
    state: BattleState;
    action: Action;
    target: Unit;
  }): ActionResult {
    switch (action.type) {
      case ActionType.ATTACK:
        return this.#resolveAttackOnUnit(
          state,
          this.getActiveUnit(state),
          target
        );
      case ActionType.DEFEND:
        // Not implemented
        break;
    }
    throw Error("No action was resolved");
  }

  getHero(state: BattleState): Hero {
    const hero = state.units.find((u) => u instanceof Hero);
    if (!hero || !(hero instanceof Hero))
      throw new Error("ERR: Hero not found");
    return hero;
  }

  getEnemies(state: BattleState): Unit[] {
    const enemies = state.units.filter((u) => !(u instanceof Hero));
    if (enemies.length < 1) throw new Error("ERR: Enemies not found");
    return enemies;
  }

  #resolveAttackOnUnit(
    state: BattleState,
    actor: Unit,
    target: Unit
  ): ActionResult {
    const restOfUnits = state.units.filter((u) => u.id !== target.id);
    target.health = Math.max(0, target.health - actor.attackDamage);
    return {
      state: { ...state, units: [...restOfUnits, target] },
      description: `${target.name} suffered ${actor.attackDamage} damage from ${actor.name}`,
    };
  }

  #incrementTurn() {
    this.turn = this.turn === this.turnOrder.length - 1 ? 0 : this.turn + 1;
  }

  #updateActiveUnit(state: BattleState): BattleState {
    return {
      ...state,
      activeUnit: this.turnOrder[this.turn],
    };
  }

  calculateTurnOrder(state: BattleState): UUID[] {
    const participants: Unit[] = [...state.units];
    return participants
      .sort((a, b) => b.initiative - a.initiative)
      .map((u) => u.id);
  }
}
