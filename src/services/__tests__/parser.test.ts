import { parseFunction } from '../parser';

describe('parser', () => {
  it('parses a simple polynomial correctly', () => {
    const result = parseFunction('x^2 + 2*x + 1');
    expect(result.toString()).toBe('x ^ 2 + 2 * x + 1');
  });

  it('parses trigonometric functions correctly', () => {
    const result = parseFunction('sin(x) + cos(x)');
    expect(result.toString()).toBe('sin(x) + cos(x)');
  });

  it('parses exponential and logarithmic functions correctly', () => {
    const result = parseFunction('e^x + log(x)');
    expect(result.toString()).toBe('e ^ x + log(x)');
  });

  it('throws an error for invalid functions', () => {
    expect(() => parseFunction('1 +')).toThrow('Invalid function');
  });

  it('throws an error for empty input', () => {
    expect(() => parseFunction('')).toThrow('Function cannot be empty');
  });
});
