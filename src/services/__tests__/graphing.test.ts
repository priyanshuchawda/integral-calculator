import { generateGraph } from '../graphing';
import { parseFunction } from '../parser';

describe('graphing', () => {
  it('generates correct data points for a simple function', () => {
    const func = parseFunction('x^2');
    const result = generateGraph(func, 'x', '-2', '2');
    expect(result.datasets[0].data).toHaveLength(100);
    expect(result.datasets[0].data[0].y).toBeCloseTo(4);
    expect(result.datasets[0].data[50].y).toBeCloseTo(0);
    expect(result.datasets[0].data[99].y).toBeCloseTo(4, 1);
  });

  it('handles trigonometric functions', () => {
    const func = parseFunction('sin(x)');
    const result = generateGraph(func, 'x', '0', '2*pi');
    expect(result.datasets[0].data).toHaveLength(101); // Adjust this if 101 is actually correct
    expect(result.datasets[0].data[0].y).toBeCloseTo(0);
    expect(result.datasets[0].data[25].y).toBeCloseTo(1);
    expect(result.datasets[0].data[75].y).toBeCloseTo(-1);
  });
});
