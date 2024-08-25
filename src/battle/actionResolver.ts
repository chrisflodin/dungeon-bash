import { Unit } from ".";

export interface Action {
  description: string;
  actor: Unit;
  targets: Unit[];
}

export interface ActionResult {
  description: string;
}

export class ActionFactory {
  constructor() {}
}

export class ActionResolver {
  resolve(action: Action): Unit {
    return action.actor;
  }
}
