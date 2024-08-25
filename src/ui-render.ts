import chalk from "chalk";
import { BattleState } from "./battle";
import { Action } from "./battle/actionResolver";
import { Hero, Unit } from "./unit";
import { input } from "./utils/input";

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

const space = height * 0.05;
const padding = width * 0.4;

export abstract class UI {
  static space(multiplier: number = 1) {
    for (let count = 0; count < space * multiplier; count++) {
      console.log();
    }
  }

  static pad(string: string, offset: number = 0) {
    const pad = Array.from({ length: padding + offset })
      .map(() => " ")
      .join("");
    return `${pad}${string}`;
  }

  static separate() {
    const separator = Array.from({ length: width })
      .map(() => "=")
      .join("");
    console.log(separator);
  }

  static title(
    string: string,
    color: ForegroundColor = "white",
    backgroundColor?: BackgroundColor
  ) {
    const ch = backgroundColor ? chalk[backgroundColor][color] : chalk[color];
    console.log(UIBattle.pad(ch.bold(`${string}`)));
  }

  static body(
    string: string,
    color: ForegroundColor = "white",
    backgroundColor?: BackgroundColor
  ) {
    const ch = backgroundColor ? chalk[backgroundColor][color] : chalk[color];
    console.log(UIBattle.pad(ch(`${string}`)));
  }

  static async printFrame(
    state: BattleState | Hero,
    message: string | string[]
  ) {}
}

export class UIWorld extends UI {
  static async printFrame(hero: Hero, messages: string[]) {
    UIWorld.separate();
    UIWorld.space(4);
    UIWorld.printWorldState(hero);
    UIWorld.space();
    for (const message of messages) {
      UIWorld.body(message);
    }
    UIWorld.space(4);
    UIWorld.separate();
    await input();
  }

  static printWorldState(hero: Hero) {
    UIWorld.title(`${hero.name}`);
    UIWorld.body(`Health: ${hero.health}`);
    UIWorld.body(`Level: ${hero.level}`);
    UIWorld.body(`Experience: ${hero.xp}`);
    UIWorld.body(`Attack damage: ${hero.attackDamage}`);
    UIWorld.body(`Initiative: ${hero.initiative}`);
  }
}
export class UIBattle extends UI {
  constructor() {
    super();
  }

  static async printFrame(state: BattleState, message: string) {
    UIBattle.separate();
    UIBattle.space();
    UIBattle.printBattleState(state);
    UIBattle.space();
    UIBattle.body(message);
    UIBattle.space();
    UIBattle.separate();
    await input();
  }

  static printBattleState(state: BattleState) {
    const hero = state.units.find((unit) => unit instanceof Hero);
    const enemies = state.units
      .filter((unit) => !(unit instanceof Hero))
      .sort((a, b) => b.initiative - a.initiative);
    if (!hero || !enemies) throw Error("Something went wrong");

    this.#printUnitBattleState(hero, state);
    UIBattle.space();
    UIBattle.title(`Enemies`, "white", "bgRed");
    enemies.forEach((e) => this.#printUnitBattleState(e, state));
  }

  static #printUnitBattleState(unit: Unit, state: BattleState) {
    const isActive = unit.id === state.activeUnit;
    const color: ForegroundColor =
      unit.health < 1 ? "red" : isActive ? "green" : "white";

    UIBattle.title(unit.name, color);
    UIBattle.body(`Health: ${unit.health}`, color);
    UIBattle.body(`Initiative: ${unit.initiative}`, color);
    UIBattle.body(`Attack Damage: ${unit.attackDamage}`, color);
    console.log();
  }

  static getIntendedAction({ actor, targets, description }: Action) {
    return `${actor.name} intends to ${description} ${targets
      .map((u) => u.name)
      .join(" ")}.`;
  }

  static async printPerformedAction({ actor, targets, description }: Action) {
    console.log(
      UIBattle.pad(`${actor.name} hit ${targets.map((u) => u.name).join(" ")}`)
    );
    await input();
  }
}
