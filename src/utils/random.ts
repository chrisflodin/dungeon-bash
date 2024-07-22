export function random(minValue: number, maxValue: number) {
  return Math.max(minValue, Math.floor(Math.random() * maxValue));
}
