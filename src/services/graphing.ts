import * as math from 'mathjs';

interface GraphData {
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number }>;
    borderColor: string;
    fill: boolean;
  }>;
}

export function generateGraph(
  func: math.MathNode | string,
  variable: string,
  lowerBound: string | null,
  upperBound: string | null
): GraphData {
  const lower = lowerBound ? math.evaluate(lowerBound) : -10;
  const upper = upperBound ? math.evaluate(upperBound) : 10;
  const step = (upper - lower) / 100;

  const data: Array<{ x: number; y: number }> = [];
  for (let x = lower; x <= upper; x += step) {
    try {
      const y = math.evaluate(func.toString(), { [variable]: x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        data.push({ x, y });
      }
    } catch (error) {
      console.error('Error evaluating function:', error);
    }
  }

  return {
    datasets: [
      {
        label: 'Function',
        data: data,
        borderColor: 'blue',
        fill: false
      }
    ]
  };
}

export function generateIntegralGraph(
  integralFunc: string,
  variable: string,
  lowerBound: string,
  upperBound: string
): any {
  const lower = math.evaluate(lowerBound);
  const upper = math.evaluate(upperBound);
  const step = (upper - lower) / 100;

  const data = [];
  for (let x = lower; x <= upper; x += step) {
    try {
      const y = math.evaluate(integralFunc, { [variable]: x });
      data.push({ x, y });
    } catch (error) {
      console.error('Error evaluating integral function:', error);
    }
  }

  return {
    labels: data.map(point => point.x),
    datasets: [
      {
        label: 'Indefinite Integral',
        data: data.map(point => ({ x: point.x, y: point.y })),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };
}
