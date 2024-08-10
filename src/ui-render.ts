import chalk from "chalk";
import { BattleState, UnitState } from "./battle";

export class UI {
  static startGame() {
    console.log("Starting game");
  }

  static battleState(state: BattleState) {
    const hero = state.find((unit) => unit.isHero);
    const enemies = state
      .filter((unit) => !unit.isHero)
      .sort((a, b) => b.initiative - a.initiative);
    if (!hero || !enemies) throw Error("Something went wrong");

    this.#unitBattleState(hero);
    console.log();
    console.log(chalk.bgRed(`Enemies`));
    enemies.forEach((e) => this.#unitBattleState(e));
    console.log(`==========================`);
  }

  static renderUnitDead(unit: UnitState) {
    console.log(chalk.bold(`${unit.name} is dead, skipping turn...`));
  }

  static #unitBattleState(unit: UnitState) {
    const color =
      unit.health < 1 ? "red" : unit.active ? "greenBright" : "white";

    console.log(chalk[color].bold(unit.name));
    console.log(chalk[color](`Health: ${unit.health}`));
    console.log(chalk[color](`Initiative: ${unit.initiative}`));

    console.log(chalk[color](`Attack Damage: ${unit.profile.attackDamage}`));
    console.log(`\n`);
  }
}
