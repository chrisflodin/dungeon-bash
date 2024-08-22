import { UnitState } from ".";

export interface Action {
  description: string;
  actor: UnitState;
  targets: UnitState[];
}

export interface ActionResult {
  description: string;
}

export class ActionFactory {
  constructor() {}
}

export class ActionResolver {
  resolve(action: Action): UnitState {
    return action.actor;
  }
}
