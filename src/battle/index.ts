import { UUID } from "crypto";
import { LevelResult } from "../game";
import { BattleLevel } from "../level";
import { UI } from "../ui-render";
import { UnitProfile } from "../unit";

enum ActionType {
  ATTACK,
  DEFEND,
}

interface Action {
  target: UUID;
  type: ActionType;
}

export type UnitState = Pick<
  UnitProfile,
  "id" | "health" | "isHero" | "name" | "initiative"
> & { profile: UnitProfile; active?: boolean; target?: boolean };
export type BattleState = UnitState[];

type ActionResult = {
  description: string;
  state: UnitState[];
};

export class BattleManager {
  turn: number;
  turnOrder: UUID[] = [];

  constructor() {
    this.turn = 0;
    this.turnOrder = [];
  }

  async playBattle(
    level: BattleLevel,
    hero: UnitProfile
  ): Promise<LevelResult> {
    const participants = [...level.enemies, hero];
    this.turn = 0;
    this.turnOrder = this.calculateTurnOrder(participants);

    let state: BattleState = participants.map((u) => {
      const { health, id, initiative, isHero, name } = u;
      return {
        id,
        health,
        initiative,
        isHero,
        name,
        profile: u,
      };
    });

    await UI.printFrame(state, "Starting battle");

    while (true) {
      state = await this.playTurn(state);

      const hero = this.getHero(state);
      const isEnemiesDefeated = this.getEnemies(state).every(
        (e) => e.health < 1
      );
      const isHeroDefeated = hero.health < 1;

      if (isEnemiesDefeated) {
        await UI.printFrame(state, "Battle won!");
        return { state: { health: hero.health } };
      }

      if (isHeroDefeated) {
        await UI.printFrame(state, "Game over :(");
        return { state: { health: hero.health } };
      }
    }
  }

  async playTurn(state: BattleState): Promise<BattleState> {
    const hero = state.find((u) => !!u.isHero);
    const enemies = state.filter((u) => !u.isHero);
    if (!hero) throw Error("Hero not found");
    if (!enemies) throw Error("Enemies not found");

    // Determine active unit
    state = this.#updateActiveUnit(state);
    const activeUnit = this.getActiveUnit(state);
    const heroTurn: boolean = activeUnit.isHero;

    // Determine target
    const possibleTargets = enemies.filter((e) => e.health > 0);
    const target: UnitState = heroTurn
      ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
      : hero;
    state = this.#updateTargetState(state, target);

    // End unit turn if dead
    if (activeUnit.health < 1) {
      await UI.printFrame(
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

    const intendedAction = UI.getIntendedAction({
      actor: activeUnit,
      description: "attack",
      targets: [target],
    });

    await UI.printFrame(state, intendedAction);

    const result = this.resolveAction({
      action,
      activeUnit,
      state,
      target,
    });
    state = result.state;

    await UI.printFrame(result.state, result.description);

    this.#incrementTurn();
    return state;
  }

  resolveAction({
    action,
    activeUnit,
    state,
    target,
  }: {
    state: BattleState;
    action: Action;
    activeUnit: UnitState;
    target: UnitState;
  }): ActionResult {
    switch (action.type) {
      case ActionType.ATTACK:
        return this.#attackUnit(state, activeUnit, target);
      case ActionType.DEFEND:
        // Not implemented
        break;
    }
    throw Error("No action was resolved");
  }

  getHero(state: BattleState): UnitState {
    const hero = state.find((u) => !!u.isHero);
    if (!hero) throw new Error("ERR: Hero not found");
    return hero;
  }

  getActiveUnit(state: BattleState): UnitState {
    const activeUnit = state.find((u) => u.active);
    if (!activeUnit) throw new Error("ERR: active unit not found");
    return activeUnit;
  }

  getEnemies(state: BattleState): UnitState[] {
    const enemies = state.filter((u) => !u.isHero);
    if (enemies.length < 1) throw new Error("ERR: Enemies not found");
    return enemies;
  }

  #attackUnit(
    state: BattleState,
    attacker: UnitState,
    target: UnitState
  ): ActionResult {
    const targetState = state.find((u) => u.id === target.id);
    if (!targetState) throw new Error("Could not find target");
    const restOfUnits = state.filter((u) => u.id !== target.id);
    const damage = attacker.profile.attack();

    targetState.health = Math.max(
      0,
      targetState.health - attacker.profile.attack()
    );
    return {
      state: [...restOfUnits, targetState],
      description: `${target.name} suffered ${damage} damage from ${attacker.name}`,
    };
  }

  #incrementTurn() {
    this.turn = this.turn === this.turnOrder.length - 1 ? 0 : this.turn + 1;
  }

  #updateActiveUnit(state: BattleState): BattleState {
    const nextUnitId = this.turnOrder[this.turn];
    return state.map((unitState) => ({
      ...unitState,
      active: unitState.id === nextUnitId,
    }));
  }

  #updateTargetState(state: BattleState, target: UnitState): BattleState {
    return state.map((unitState) => ({
      ...unitState,
      target: target.target,
    }));
  }

  calculateTurnOrder(units: UnitProfile[]): UUID[] {
    const participants: UnitProfile[] = [...units];
    return participants
      .sort((a, b) => b.initiative - a.initiative)
      .map((u) => u.id);
  }
}
