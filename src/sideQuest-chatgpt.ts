import readline from "readline";

type ActionNeeded = { key: string; damage: number };

function getRandomAction(): ActionNeeded {
  const keys = ["a", "b", "c", "d"];
  const key = keys[Math.floor(Math.random() * keys.length)];
  return {
    key,
    damage: 10,
  };
}

async function keyPressHandler(key: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(`Press this key! ${key}`);

    const onKeyPress = (input: string) => {
      if (input === key) {
        rl.close();
        resolve(true);
      }
    };

    rl.on("line", onKeyPress);

    setTimeout(() => {
      rl.close();
      resolve(false);
    }, 10000); // 10 seconds to press the key
  });
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

    const keyPressed = await keyPressHandler(action.key);

    if (keyPressed) {
      console.log("Key pressed in time!");
      yield action;
    } else {
      console.log(`You failed to press ${action.key} in time.`);
      return action.damage;
    }
  }
}

export const startSideQuest = async () => {
  console.log("SideQuest started.");
  const actionIter = actionGenerator();
  let totalDamage = 0;

  for await (const action of actionIter) {
    if (typeof action === "number") {
      totalDamage += action;
    }
  }

  console.log(`I was hurt this much: ${totalDamage}`);
};

// Example usage
startSideQuest().then(() => console.log("SideQuest completed."));
