import inquirer from "inquirer";

import { wait } from "./utils/wait";

type ActionNeeded = { key: string; damage: number };

function getRandomAction(): ActionNeeded {
  return {
    key: "a",
    damage: 10,
  };
}

async function* keyPressGen(
  key: string
): AsyncGenerator<boolean, boolean, string> {
  let count = 10;
  let input;
  let completed = false;
  inquirer
    .prompt([
      { name: "key", type: "input", message: `Press this key! ${key}\n` },
    ])
    .then((a) => {
      if (a.key === key) completed = true;
    });

  while (count > 0) {
    if (completed) return true;
    input = yield false;
    if (input === key) return true;
    console.log(count);
    count--;
    await wait(1);
  }

  return false;
}

async function* actionGenerator(): AsyncGenerator<
  ActionNeeded,
  number | undefined,
  void
> {
  console.log("Action started");
  while (true) {
    const action = getRandomAction();
    console.log(`Press ${action.key} before it's too late!`);

    const iter = keyPressGen(action.key);

    let keyPressed = false;
    while (true) {
      const { value, done } = await iter.next();
      if (value) {
        keyPressed = true;
        return 0;
      }
      if (done) return action.damage;
    }
  }
}

export const startSideQuest = async () => {
  console.log("SideQuest started.");
  const actionIter = actionGenerator();
  const action = await actionIter.next();
  console.log(`I was hurt this much: ${action.value}`);
};
