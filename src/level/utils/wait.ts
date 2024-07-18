export async function wait(s: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, s * 1000);
  });
}
