export class EmptyFunctionError extends Error {
  constructor() {
    super('Function cannot be empty');
    this.name = 'EmptyFunctionError';
  }
}

export class InvalidFunctionError extends Error {
  constructor(message: string) {
    super(`Invalid function: ${message}`);
    this.name = 'InvalidFunctionError';
  }
}

export class IntegrationError extends Error {
  constructor(message: string) {
    super(`Integration error: ${message}`);
    this.name = 'IntegrationError';
  }
}

export class InvalidVariableError extends Error {
  constructor(message: string) {
    super(`Invalid variable: ${message}`);
    this.name = 'InvalidVariableError';
  }
}

export class InvalidBoundError extends Error {
  constructor(message: string) {
    super(`Invalid bound: ${message}`);
    this.name = 'InvalidBoundError';
  }
}
