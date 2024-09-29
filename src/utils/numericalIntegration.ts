import * as math from 'mathjs';

export function simpsonRule(func: string, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let sum = math.evaluate(func, { x: a }) + math.evaluate(func, { x: b });

  for (let i = 1; i < n; i += 2) {
    sum += 4 * math.evaluate(func, { x: a + i * h });
  }
  for (let i = 2; i < n - 1; i += 2) {
    sum += 2 * math.evaluate(func, { x: a + i * h });
  }

  return (h / 3) * sum;
}
