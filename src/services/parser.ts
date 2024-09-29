import { create, all, MathNode } from 'mathjs';
import { EmptyFunctionError, InvalidFunctionError } from '../utils/errors';

const math = create(all);

export function parseFunction(func: string): MathNode {
  if (!func.trim()) {
    throw new EmptyFunctionError();
  }

  try {
    return math.parse(func);
  } catch (error) {
    console.error('Error parsing function:', error);
    throw new InvalidFunctionError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export function simplifyFunction(func: MathNode): MathNode {
  try {
    return math.simplify(func);
  } catch (error) {
    console.warn('Error simplifying function:', error);
    return func;
  }
}
