import { IntegrationResult, IntegrationError } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

export const calculateIntegral = async (
  func: string,
  variable: string,
  lowerBound: string | null,
  upperBound: string | null,
  method: string
): Promise<IntegrationResult> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/integrationWorker.ts', import.meta.url));

    worker.onmessage = (e: MessageEvent) => {
      console.log('Worker message received:', e.data);
      if (e.data.result) {
        resolve({
          id: Date.now().toString(),
          func,
          variable,
          result: e.data.result.result,
          steps: e.data.result.steps,
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        } as IntegrationResult);
      } else if (e.data.error) {
        reject(new IntegrationError(e.data.error.message, e.data.error.details));
      } else {
        reject(new Error('Integration failed: No result or error received'));
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      reject(new IntegrationError('Worker error', error.message));
      worker.terminate();
    };

    const message = { func, variable, lowerBound, upperBound, method };
    console.log('Sending message to worker:', message);
    worker.postMessage(message);
  });
};
