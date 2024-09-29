import { MathNode } from 'mathjs';
import { IntegrationError } from '../utils/errors';

export interface IntegrationStep {
  step: string;
  result: string;
}

export interface IntegrationResult {
  indefiniteIntegral: string;
  definiteIntegral?: number | string;
  steps: IntegrationStep[];
  method: string;
}

export async function calculateIntegral(
  func: MathNode, 
  variable: string, 
  lowerBound: string | null, 
  upperBound: string | null,
  method: string
): Promise<IntegrationResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/integrationWorker.ts', import.meta.url));
    
    worker.onmessage = (e: MessageEvent) => {
      if (e.data.error) {
        reject(new IntegrationError(e.data.error));
      } else {
        resolve(e.data.result);
      }
      worker.terminate();
    };
    
    worker.postMessage({ func: func.toString(), variable, lowerBound, upperBound, method });
  });
}

export async function handleImproperIntegral(
  func: math.MathNode,
  variable: string,
  lowerBound: string,
  upperBound: string
): Promise<IntegrationResult> {
  // Implement improper integral logic here
  return {
    indefiniteIntegral: `∫${func.toString()}d${variable}`,
    definiteIntegral: undefined,
    steps: [],
    method: "Improper integral"
  };
}

export async function calculateIndefiniteIntegral(func: MathNode, variable: string): Promise<IntegrationResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('../workers/integrationWorker.ts', import.meta.url));

    worker.onmessage = (e: MessageEvent) => {
      resolve({
        indefiniteIntegral: e.data.indefiniteIntegral,
        definiteIntegral: e.data.definiteIntegral,
        steps: e.data.steps,
        method: e.data.method
      });
    };

    worker.postMessage({
      func: func.toString(),
      variable,
      type: 'indefinite'
    });
  });
}
