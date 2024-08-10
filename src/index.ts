#!/usr/bin/env node
import { BattleManager } from "./battle";
import { GameManager } from "./game";
import { BattleLevelBuilder, LevelBuilder, ShopLevelBuilder } from "./level";
import { BATTLE_LEVELS } from "./level/configs";
import { ShopManager } from "./shop";
import { UI } from "./ui-render";
import { EnemyFactory, HeroProfile } from "./unit";

// Set up unit creation
const enemyFactory = new EnemyFactory();
const hero = new HeroProfile();

// Build levels
const battleLevelBuilder = new BattleLevelBuilder(enemyFactory);
const shopLevelBuilder = new ShopLevelBuilder();
const levelBuilder = new LevelBuilder(battleLevelBuilder, shopLevelBuilder);
const levels = levelBuilder.build(BATTLE_LEVELS);

// Handle gameplay logic
const battleManager = new BattleManager();
const shopManager = new ShopManager();
const game = new GameManager({ levels, hero, battleManager, shopManager });

async function start() {
  UI.startGame();
  await game.playLevels();
}

start();
