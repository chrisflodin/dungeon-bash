import chalk from "chalk";
import { BattleState, UnitState } from "./battle";

export class UIRender {
  static renderBattleState(state: BattleState) {
    const hero = state.find((unit) => unit.isHero);
    const enemies = state
      .filter((unit) => !unit.isHero)
      .sort((a, b) => a.initiative - b.initiative);
    if (!hero || !enemies) throw Error("Something went wrong");

    console.log(`Enemies`);
    enemies.forEach((e) => this.#renderUnitBattleState(e));
    this.#renderUnitBattleState(hero);
    console.log(`==========================`);
  }

  static #renderUnitBattleState(unit: UnitState) {
    const color = unit.active ? "greenBright" : "white";

    console.log(chalk[color].bold(`${unit.name}-${unit.id.slice(0, 4)}`));
    console.log(`Health: ${unit.health}`);
    console.log(`Initiative: ${unit.initiative}`);
    console.log(`\n`);
  }
}
