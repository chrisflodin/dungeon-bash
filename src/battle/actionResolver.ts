import { UnitState } from ".";
import { UI } from "../ui-render";

export interface Action {
  name: string;
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
    UI.printIntendAction(action);
    UI.printActionResult("NOT IMPLEMENTED");
    return action.actor;
  }
}

// export class AttackAction {
//   constructor(name: string) {
//     super(name);
//   }

//   resolve({ actor, target }: { actor: UnitState; target: UnitState }) {
//     return target;
//   }
//   describe(): string {
//     return "";
//   }
// }
