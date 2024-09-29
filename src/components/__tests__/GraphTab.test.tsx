import { generatePoints, findIntersections, calculateDerivative } from '../GraphTab';
import * as math from 'mathjs';

describe('GraphTab functions', () => {
  test('generatePoints', () => {
    const points = generatePoints('x^2', [-2, 2]);
    expect(points.length).toBeGreaterThan(0);
    expect(points[0]).toHaveProperty('x');
    expect(points[0]).toHaveProperty('y');
  });

  test('findIntersections', () => {
    const functions = [
      { expr: 'x', color: 'red' },
      { expr: 'x^2', color: 'blue' }
    ];
    const intersections = findIntersections(functions, [-1, 1]);
    expect(intersections).toHaveLength(2);
    expect(intersections[0]).toEqual({ x: 0, y: 0 });
    expect(intersections[1]).toEqual({ x: 1, y: 1 });
  });

  test('calculateDerivative', () => {
    const derivative = calculateDerivative('x^2');
    expect(derivative).toBe('2 * x');
  });
});