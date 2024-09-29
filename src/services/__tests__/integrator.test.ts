import { calculateIntegral } from '../integrator';
import { parseFunction } from '../parser';
import { Worker } from 'worker_threads';

jest.mock('worker_threads', () => ({
  Worker: jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    onmessage: jest.fn(),
    terminate: jest.fn(),
  })),
}));

// Mock require.resolve
jest.mock('path', () => ({
  resolve: jest.fn(() => 'mocked-worker-path'),
}));

describe('integrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWorkerResponse = (result: string | { error: string }) => {
    (Worker as jest.MockedClass<typeof Worker>).mockImplementation(() => ({
      postMessage: jest.fn(),
      addEventListener: jest.fn().mockImplementation((event, handler) => {
        if (event === 'message') {
          setTimeout(() => handler({ data: typeof result === 'string' ? { result, steps: [] } : result }), 0);
        }
      }),
      removeEventListener: jest.fn(),
      terminate: jest.fn(),
    } as unknown as Worker));
  };

  it('calculates the integral of x^2 from 0 to 1 correctly', async () => {
    mockWorkerResponse('1/3');
    const func = parseFunction('x^2');
    const result = await calculateIntegral(func, 'x', '0', '1');
    expect(result.result).toBe('1/3');
  });

  it('calculates the integral of sin(x) from 0 to pi correctly', async () => {
    mockWorkerResponse('2');
    const func = parseFunction('sin(x)');
    const result = await calculateIntegral(func, 'x', '0', 'pi');
    expect(result.result).toBe('2');
  });

  it('handles invalid functions', async () => {
    mockWorkerResponse({ error: 'Integration error: Invalid function' });
    const func = parseFunction('1/0');
    await expect(calculateIntegral(func, 'x', '0', '1')).rejects.toThrow('Integration error: Invalid function');
  });

  it('calculates the integral of e^x from 0 to 1 correctly', async () => {
    mockWorkerResponse('1.71828');
    const func = parseFunction('e^x');
    const result = await calculateIntegral(func, 'x', '0', '1');
    expect(parseFloat(result.result)).toBeCloseTo(1.71828, 5);
  });

  it('calculates the integral of log(x) from 1 to e correctly', async () => {
    mockWorkerResponse('1');
    const func = parseFunction('log(x)');
    const result = await calculateIntegral(func, 'x', '1', 'e');
    expect(result.result).toBe('1');
  });
});
