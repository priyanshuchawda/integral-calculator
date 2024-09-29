import { create, all } from 'mathjs';
import { InvalidFunctionError, InvalidVariableError, InvalidBoundError } from './errors';

const math = create(all);

export function validateFunction(func: string): void {
  if (!func.trim()) {
    throw new InvalidFunctionError('Function cannot be empty');
  }

  try {
    math.parse(func);
  } catch (error) {
    throw new InvalidFunctionError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export function validateVariable(variable: string): void {
  if (!/^[a-zA-Z]$/.test(variable)) {
    throw new InvalidVariableError('Variable must be a single letter.');
  }
}

export function validateBound(bound: string): void {
  // Replace π with pi and ∞ with Infinity for validation
  const normalizedBound = bound.replace(/π/g, 'pi').replace(/∞/g, 'Infinity');
  
  try {
    // Use a simple regex to check if the bound is a valid mathematical expression
    if (!/^[-+]?(\d*\.\d+|\d+\.?\d*)([eE][-+]?\d+)?$|^pi$|^e$|^[-+]?Infinity$/.test(normalizedBound)) {
      // If it's not a simple number, pi, e, or infinity, try to evaluate it
      eval(normalizedBound);
    }
  } catch (error) {
    throw new InvalidBoundError('Invalid bound expression');
  }
}

export function validateIntegrationMethod(method: string): void {
  const validMethods = ['auto', 'substitution', 'parts', 'partial_fractions', 'trig_substitution'];
  if (!validMethods.includes(method)) {
    throw new Error('Invalid integration method');
  }
}

export function validateComplexPath(path: string): void {
  // Implement validation for complex integration paths
  // This is a placeholder and should be replaced with actual implementation
  if (!path.match(/^[CRLUD]+$/)) {
    throw new Error('Invalid complex integration path');
  }
}
