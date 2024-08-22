import inquirer from "inquirer";

export async function input() {
  return new Promise((resolve) => {
    inquirer
      .prompt({ type: "input", name: "", message: "" })
      .then(() => resolve(""));
  });
}
