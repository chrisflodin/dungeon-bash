import chalk from "chalk";
import { BattleState, UnitState } from "./battle";
import { Action } from "./battle/actionResolver";
import { input } from "./utils/wait";

type ForegroundColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "blackBright"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";

type BackgroundColor =
  | "bgBlack"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan"
  | "bgWhite"
  | "bgGray"
  | "bgGrey"
  | "bgBlackBright"
  | "bgRedBright"
  | "bgGreenBright"
  | "bgYellowBright"
  | "bgBlueBright"
  | "bgMagentaBright"
  | "bgCyanBright"
  | "bgWhiteBright";

const width = process.stdout.columns;
const height = process.stdout.rows;

const space = height * 0.1;
const padding = width * 0.4;

export class UI {
  constructor() {}

  static startGame() {
    console.log(UI.pad("Starting game"));
  }

  static async printBattleState(state: BattleState) {
    UI.separate();
    UI.space();
    const hero = state.find((unit) => unit.isHero);
    const enemies = state
      .filter((unit) => !unit.isHero)
      .sort((a, b) => b.initiative - a.initiative);
    if (!hero || !enemies) throw Error("Something went wrong");

    this.#printUnitBattleState(hero);
    UI.space();
    UI.title(`Enemies`, "white", "bgRed");
    enemies.forEach((e) => this.#printUnitBattleState(e));
    UI.space();
    UI.separate();
    await input();
  }

  static async printUnitDead(unit: UnitState) {
    console.log(
      UI.pad(chalk.bold(`${unit.name} is dead, skipping turn...`), -20)
    );
    await input();
  }

  static #printUnitBattleState(unit: UnitState) {
    const color: ForegroundColor = unit.active
      ? "green"
      : unit.health < 1
      ? "red"
      : "white";

    UI.title(unit.name, color);
    UI.body(`Health: ${unit.health}`, color);
    UI.body(`Initiative: ${unit.initiative}`, color);
    UI.body(`Attack Damage: ${unit.profile.attackDamage}`, color);
    console.log(`\n`);
  }

  static async printIntendAction({ actor, targets, name }: Action) {
    console.log(
      UI.pad(
        `${actor.name} intends to perform ${name} at ${targets
          .map((u) => u.name)
          .join(" ")}.`,
        -20
      )
    );
    await input();
  }

  static async printActionResult(resultDescription: string) {
    console.log(resultDescription);
    await input();
  }

  static space() {
    for (let count = 0; count < space; count++) {
      console.log();
    }
  }

  static pad(string: string, offset: number = 0) {
    const pad = Array.from({ length: padding + offset })
      .map((it) => " ")
      .join("");
    return `${pad}${string}`;
  }

  static separate() {
    const separator = Array.from({ length: width })
      .map((it) => "")
      .join("=");
    console.log(separator);
  }

  static title(
    string: string,
    color: ForegroundColor = "white",
    backgroundColor?: BackgroundColor
  ) {
    const ch = backgroundColor ? chalk[backgroundColor][color] : chalk[color];
    console.log(UI.pad(ch.bold(`${string}`)));
  }

  static body(
    string: string,
    color: ForegroundColor = "white",
    backgroundColor?: BackgroundColor
  ) {
    const ch = backgroundColor ? chalk[backgroundColor][color] : chalk[color];
    console.log(UI.pad(ch(`${string}`)));
  }
}
