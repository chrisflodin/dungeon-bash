#!/usr/bin/env node

import { EnemyFactory } from "./enemy";
import { GameManager } from "./game";
import { LevelBuilder, LevelFactory } from "./level";

const game = new GameManager();
const enemyFactory = new EnemyFactory();
const levelFactory = new LevelFactory(enemyFactory);
const levels = new LevelBuilder(levelFactory).build();

async function start() {
  game.start();
}

start();

// startSideQuest();
