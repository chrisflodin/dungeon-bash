import { UUID } from "crypto";
import { LevelResult } from "../game";
import { BattleLevel, Level } from "../level";
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

export class BattleManager {
  turnTracker: number;
  turnOrder: UUID[] = [];

  constructor() {
    this.turnTracker = 0;
    this.turnOrder = [];
  }

  *levelGenerator(levels: Level[]): Generator<Level, undefined, void> {
    for (const level of levels) {
      yield level;
    }
  }

  async playBattle(
    level: BattleLevel,
    hero: UnitProfile
  ): Promise<LevelResult> {
    const participants = [...level.enemies, hero];
    this.turnTracker = 0;
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

    await UI.printBattleState(state);

    while (true) {
      state = await this.playTurn(state);

      const hero = this.getHero(state);
      const isEnemiesDefeated = this.getEnemies(state).every(
        (e) => e.health < 1
      );
      const isHeroDefeated = hero.health < 1;

      if (isEnemiesDefeated || isHeroDefeated) {
        return { state: { health: hero.health } };
      }
    }
  }

  async playTurn(state: BattleState): Promise<BattleState> {
    const hero = state.find((u) => !!u.isHero);
    const enemies = state.filter((u) => !u.isHero);
    if (!hero) throw Error("Hero not found");
    if (!enemies) throw Error("Enemies not found");

    state = this.#updateActiveUnitState(state);
    const activeUnit = this.getActiveUnit(state);

    const possibleTargets = enemies.filter((e) => e.health > 0);

    const heroTurn: boolean = activeUnit.isHero;

    const target: UnitState = heroTurn
      ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
      : hero;

    state = this.#updateTargetState(state, target);

    // Determine what kind of action. It is static for now.
    if (activeUnit.health < 1) {
      await UI.printUnitDead(activeUnit);

      this.#incrementTurn();
      return state;
    }

    const action: Action = {
      type: ActionType.ATTACK,
      target: target.id,
    };

    UI.printBattleState(state);
    await UI.printIntendAction({
      actor: activeUnit,
      description: "Hey",
      name: "not implemented",
      targets: [target],
    });

    this.resolveAction({
      action,
      activeUnit,
      state,
      target,
    });

    await UI.printBattleState(state);
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
  }) {
    switch (action.type) {
      case ActionType.ATTACK:
        return this.#attackUnit(state, activeUnit, target);
      case ActionType.DEFEND:
        // Not implemented
        break;
    }
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
  ): BattleState {
    const targetState = state.find((u) => u.id === target.id);
    if (!targetState) throw new Error("Could not find target");
    const withoutTarget = state.filter((u) => u.id !== target.id);
    targetState.health = Math.max(
      0,
      targetState.health - attacker.profile.attack()
    );
    return [...withoutTarget, targetState];
  }

  #incrementTurn() {
    this.turnTracker =
      this.turnTracker === this.turnOrder.length - 1 ? 0 : this.turnTracker + 1;
  }

  #updateActiveUnitState(state: BattleState): BattleState {
    const nextUnitId = this.turnOrder[this.turnTracker];
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
