import { IntegrationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function integrateByTrigSubstitution(func: string, variable: string): IntegrationResult {
  return {
    id: uuidv4(),
    func,
    variable,
    result: `Integrated ${func} with respect to ${variable} using trig substitution`,
    steps: [],
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  };
}

export function integrateByPartialFractions(func: string, variable: string): IntegrationResult {
  return {
    id: uuidv4(),
    func,
    variable,
    result: `Integrated ${func} with respect to ${variable} using partial fractions`,
    steps: [],
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  };
}
