import inquirer from "inquirer";

export async function wait(s: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, s * 1000);
  });
}

export async function input() {
  return new Promise((resolve) => {
    inquirer
      .prompt({ type: "input", name: "", message: "" })
      .then(() => resolve(""));
  });
}
