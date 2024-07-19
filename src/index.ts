#!/usr/bin/env node
import { BattleResolver } from "./battle";
import { GameManager } from "./game";
import { LevelBuilder } from "./level";
import { Hero, UnitFactory } from "./unit";

const game = new GameManager();
const unitFactory = new UnitFactory();
const levels = new LevelBuilder(unitFactory).build();
const battleResolver = new BattleResolver();
const hero = new Hero();

async function start() {
  game.start();
  const level1 = levels[0];
  const battleResult = await battleResolver.battle(level1, hero);
  if (typeof battleResult === "undefined") {
    console.log("GAME OVER");
  } else {
    console.log("GAME CONTINUES");
  }
}

start();

// startSideQuest();
