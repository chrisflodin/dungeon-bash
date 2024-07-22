#!/usr/bin/env node
import { BattleResolver } from "./battle";
import { GameManager } from "./game";
import { LevelBuilder } from "./level";
import { LevelResolver } from "./levelResolver";
import { Hero, UnitFactory } from "./unit";

const unitFactory = new UnitFactory();
const levelBuilder = new LevelBuilder(unitFactory);
const battleResolver = new BattleResolver();
const levelResolver = new LevelResolver(levelBuilder, battleResolver);
const hero = new Hero();
const game = new GameManager(levelResolver, hero);

async function start() {
  await game.start();
}

start();

// startSideQuest();
