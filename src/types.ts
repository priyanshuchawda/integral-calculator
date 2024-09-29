export interface IntegrationStep {
  step: string;
  result: string;
  explanation: string;
}

export interface IntegrationResult {
  id: string;
  func: string;
  variable: string;
  result: string;
  steps: IntegrationStep[];
  color: string;
  indefiniteIntegral?: string; // Add this line
}

export class IntegrationError extends Error {
  constructor(public message: string, public details: string) {
    super(message);
    this.name = 'IntegrationError';
  }
}
