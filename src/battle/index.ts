import { UUID } from "crypto";
import { Level } from "../level";
import { UIRender } from "../ui-render";
import { Hero, Unit } from "../unit";
import { waitForInput } from "../utils/wait";

enum ActionType {
  ATTACK,
  DEFEND,
}

interface Action {
  target: UUID;
  type: ActionType;
}

export type UnitState = Pick<
  Unit,
  "id" | "health" | "isHero" | "name" | "initiative"
> & { active?: boolean; target?: boolean };
export type BattleState = UnitState[];

export class BattleResolver {
  turnTracker: number;
  turnOrder: UUID[] = [];
  units: Unit[];

  constructor() {
    this.turnTracker = 0;
    this.turnOrder = [];
    this.units = [];
  }

  async battle(level: Level, hero: Hero): Promise<Hero | undefined> {
    this.turnTracker = 0;
    this.units = [...level.units, hero];
    this.turnOrder = this.calculateTurnOrder(this.units);
    const result = await this.playBattle();
    if (result) {
      hero.health === result?.health;
      return hero;
    } else {
      return undefined;
    }
  }

  async playBattle(): Promise<UnitState | undefined> {
    // Starting State
    const hero = this.units.find((u) => !!u.isHero);
    const enemies = this.units.filter((u) => !u.isHero);
    let nextUnitId: UUID = this.turnOrder[this.turnTracker];
    let nextUnit = this.units.find((u) => u.id === nextUnitId);
    if (!hero) throw Error("Hero not found");
    if (!enemies) throw Error("Enemies not found");

    let state: BattleState = this.units.map((u) => ({
      name: u.name,
      id: u.id,
      health: u.health,
      isHero: u.isHero,
      initiative: u.initiative,
      active: u.id === nextUnitId,
    }));

    while (true) {
      state = [
        ...(await this.playTurn({
          state: state,
          hero,
          enemies,
        })),
      ];

      const isEnemiesDefeated = state
        .filter((u) => u.id !== hero.id)
        .every((e) => e.health < 1);

      const heroState = state.find((u) => u.id === hero.id);
      if (!heroState) throw new Error("No hero state");
      const isHeroDefeated = heroState?.health < 1;

      if (isEnemiesDefeated) return heroState;
      if (isHeroDefeated) return undefined;
    }
  }

  async playTurn({
    state,
    enemies,
    hero,
  }: {
    state: BattleState;
    hero: Hero;
    enemies: Unit[];
  }): Promise<BattleState> {
    state = this.#updateActiveUnitState(state);
    const possibleTargets = enemies.filter((e) => e.health > 0);
    const activeUnit = this.units.find(
      (u) => u.id === this.turnOrder[this.turnTracker]
    );

    if (!activeUnit) throw new Error("No active unit");
    const heroTurn: boolean = activeUnit.isHero;

    const target: Unit = heroTurn
      ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
      : hero;
    state = this.#updateTargetState(state, target);

    UIRender.renderBattleState(state);
    // const { action }: { action: Action } = await inquirer.prompt<{
    //   action: Action;
    // }>({
    //   name: "Choose action",
    //   choices: [{ name: "Attack!", value: Action.ATTACK }],
    //   type: "list",
    //   message: "asd",
    // });

    // const choices: Choice[] = this.units.map((u) => ({value: u.}))

    // const { enemy }: { enemy: Action } = await inquirer.prompt<{
    //   action: Action;
    // }>({
    //   name: "Choose action",
    //   choices: [{}],
    //   type: "list",
    //   message: "asd",
    // });

    // Determine what kind of action. It is static for now.
    const action: Action = {
      type: ActionType.ATTACK,
      target: target.id,
    };

    switch (action.type) {
      case ActionType.ATTACK:
        console.log(`${activeUnit.name} is going to attack ${target.name}`);
        state = this.#attackUnit(state, activeUnit, target);
        break;
      case ActionType.DEFEND:
        console.log(`${activeUnit.name} is going to defend`);
        // Add your code for Action 2 here
        break;
    }

    await waitForInput();
    this.#incrementTurn();
    return state;
  }

  #attackUnit(state: BattleState, attacker: Unit, target: Unit): BattleState {
    const targetState = state.find((u) => u.id === target.id);
    if (!targetState) throw new Error("Could not find target");
    const withoutTarget = state.filter((u) => u.id !== target.id);
    targetState.health = targetState.health - attacker.attack();
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

  calculateTurnOrder(units: Unit[]): UUID[] {
    const participants: Unit[] = [...units];
    return participants
      .sort((a, b) => b.initiative - a.initiative)
      .map((u) => u.id);
  }
}
