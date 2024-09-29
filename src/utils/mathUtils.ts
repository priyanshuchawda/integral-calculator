import * as nerdamer from 'nerdamer/all.min';
import { evaluate } from 'mathjs';

export function simplifyExpression(expr: string): string {
  try {
    return nerdamer(expr).simplify().toString();
  } catch (error) {
    console.error('Simplification error:', error);
    return expr;
  }
}

export function expandExpression(expr: string): string {
  try {
    return nerdamer(expr).expand().toString();
  } catch (error) {
    console.error('Expansion error:', error);
    return expr;
  }
}

export function isProductOfTrigFunctions(expr: string): boolean {
  const trigFunctions = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
  return trigFunctions.some(trig => expr.includes(trig)) && expr.includes('*');
}

export function normalizeFunction(func: string, variable: string): string {
  // Your normalization logic here
  // This function should handle the normalization of the function
  // considering both the function string and the variable
  return func; // This is a placeholder, replace with actual normalization logic
}

export const evaluateFunction = (func: string, x: number): number => {
  try {
    return evaluate(func, { x });
  } catch (error) {
    console.error('Error evaluating function:', error);
    return NaN;
  }
};

export const generatePlotData = (func: string, start: number, end: number, points = 100) => {
  const data = [];
  const step = (end - start) / points;
  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    try {
      const y = evaluate(func, { x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        data.push({ x, y });
      }
    } catch (error) {
      console.error(`Error evaluating function at x=${x}:`, error);
      // Skip this point
    }
  }
  return data;
};

const integralCache = new Map<string, string>();

export function memoizedIntegrate(func: string, variable: string): string {
  const cacheKey = `${func}|${variable}`;
  if (integralCache.has(cacheKey)) {
    return integralCache.get(cacheKey)!;
  }

  const result = nerdamer(`integrate(${func}, ${variable})`).toString();
  integralCache.set(cacheKey, result);
  return result;
}
