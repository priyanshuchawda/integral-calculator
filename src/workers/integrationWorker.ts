/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

import * as math from 'mathjs';
import * as nerdamer from 'nerdamer/all.min';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';
import { simplifyExpression, expandExpression, normalizeFunction } from '../utils/mathUtils';
import { integrateByTrigSubstitution, integrateByPartialFractions } from '../utils/advancedIntegration';
import { evaluateComplexIntegral } from '../utils/complexIntegration';
import { simpsonRule } from '../utils/numericalIntegration';
import { IntegrationResult as ImportedIntegrationResult, IntegrationStep as ImportedIntegrationStep } from '../types';
import { memoizedIntegrate } from '../utils/mathUtils';

class IntegrationError extends Error {
  constructor(public message: string, public details: string, public errorType: string) {
    super(message);
    this.name = 'IntegrationError';
  }
}

const commonIntegrals: { [key: string]: string } = {
  'x': '(1/2) * x^2',
  'x^n': '(1/(n+1)) * x^(n+1)',
  'sin(x)': '-cos(x)',
  'cos(x)': 'sin(x)',
  'tan(x)': '-ln(|cos(x)|)',
  'e^x': 'e^x',
  'ln(x)': 'x * ln(x) - x',
  '1/x': 'ln(|x|)',
  '(sec(x))^2 / tan(x)': 'ln|tan(x)|',
  'sec^2(x) / tan(x)': 'ln|tan(x)|',
  '(sec(x))^2/tan(x)': 'ln|tan(x)|',
  'sec^2(x)/tan(x)': 'ln|tan(x)|',
};

function integrate(func: string, variable: string, method: string, lowerBound?: string, upperBound?: string): ImportedIntegrationResult {
  console.log(`Integrating function: ${func}, variable: ${variable}, method: ${method}, bounds: ${lowerBound} to ${upperBound}`);
  try {
    const steps: ImportedIntegrationStep[] = [];
    steps.push({ step: 'Original function', result: func, explanation: '' });

    // Normalize the function
    const normalizedFunc = normalizeFunction(func, variable);
    console.log(`Normalized function: ${normalizedFunc}`);
    
    let result: string;
    if (lowerBound !== undefined && upperBound !== undefined) {
      console.log(`Calculating definite integral from ${lowerBound} to ${upperBound}`);
      const indefiniteResult = nerdamer(`integrate(${normalizedFunc}, ${variable})`).toString();
      console.log(`Indefinite integral: ${indefiniteResult}`);
      
      const upperEval = nerdamer(indefiniteResult).evaluate({[variable]: upperBound}).toString();
      const lowerEval = nerdamer(indefiniteResult).evaluate({[variable]: lowerBound}).toString();
      console.log(`Upper bound evaluation: ${upperEval}`);
      console.log(`Lower bound evaluation: ${lowerEval}`);
      
      result = nerdamer(`${upperEval} - (${lowerEval})`).toString();
      console.log(`Definite integral result: ${result}`);
    } else {
      result = nerdamer(`integrate(${normalizedFunc}, ${variable})`).toString();
      console.log(`Indefinite integral result: ${result}`);
    }

    steps.push({ step: 'Integration result', result: result, explanation: 'Integrated the function' });
    
    return {
      id: Date.now().toString(),
      func,
      variable,
      result,
      steps,
      color: '#000000',
      indefiniteIntegral: result
    };
  } catch (error) {
    console.error('Integration error:', error);
    let errorMessage = 'Unknown error occurred';
    let errorType = 'UnknownError';

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('division by zero')) {
        errorType = 'DivisionByZeroError';
      } else if (error.message.includes('undefined function')) {
        errorType = 'UndefinedFunctionError';
      }
    }

    throw new IntegrationError('Integration failed', errorMessage, errorType);
  }
}

function getIntegrationFunction(method: string): (func: string, variable: string) => ImportedIntegrationResult {
  switch (method) {
    case 'substitution':
      return integrateByUSubstitution;
    case 'parts':
      return integrateByParts;
    case 'partial_fractions':
      return integrateByPartialFractions;
    case 'trig_substitution':
      return integrateByTrigonometricSubstitution;
    case 'rational_functions':
      return integrateByRationalFunctions;
    default:
      return integrateAutomatic;
  }
}

function integrateAutomatic(func: string, variable: string): ImportedIntegrationResult {
  console.log('Attempting automatic integration');
  const steps: ImportedIntegrationStep[] = [];
  steps.push({ step: 'Attempting automatic integration', result: func, explanation: '' });

  // Try symbolic integration with nerdamer first
  try {
    console.log('Attempting symbolic integration with nerdamer');
    const result = nerdamer(`integrate(${func}, ${variable})`);
    let indefiniteIntegral = result.toString();
    console.log('Nerdamer integration result:', indefiniteIntegral);

    // Simplify the result
    indefiniteIntegral = simplifyExpression(indefiniteIntegral);
    console.log('Simplified result:', indefiniteIntegral);

    steps.push({ step: 'Symbolic integration', result: `∫ ${func} d${variable} = ${indefiniteIntegral} + C`, explanation: 'Integrated symbolically and simplified the result' });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: `${indefiniteIntegral} + C`,
      steps,
      color: '#000000',
      indefiniteIntegral
    };
  } catch (error) {
    console.error('Nerdamer integration error:', error);
    steps.push({ step: 'Symbolic integration failed', result: 'Error', explanation: String(error) });
  }

  // If symbolic integration fails, try other methods
  console.log('Symbolic integration failed, trying other methods');
  const techniques = [
    integrateByParts,
    integrateByUSubstitution,
    integrateByTrigonometricSubstitution,
    integrateByPartialFractions,
    integrateByRationalFunctions
  ];

  for (const technique of techniques) {
    console.log(`Trying integration technique: ${technique.name}`);
    const result = technique(func, variable);
    if (result && result.result !== "result") {
      console.log(`Integration successful using ${technique.name}`);
      return result;
    }
  }

  // If all else fails, fall back to numerical integration
  console.log('All integration techniques failed, falling back to numerical integration');
  return numericalIntegration(func, variable, '-10', '10');
}

function integrateByParts(func: string, variable: string): ImportedIntegrationResult {
  const steps: ImportedIntegrationStep[] = [];
  steps.push({ step: 'Attempting integration by parts', result: func, explanation: '' });

  // Identify u and dv
  const terms = func.split('*');
  if (terms.length !== 2) return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };

  const [u, dv] = terms;
  steps.push({ step: 'Identified u and dv', result: `u = ${u}, dv = ${dv}`, explanation: '' });

  try {
    // Calculate v
    const v = nerdamer(`integrate(${dv}, ${variable})`).toString();
    steps.push({ step: 'Calculated v', result: `v = ${v}`, explanation: '' });

    // Calculate du
    const du = nerdamer(`diff(${u}, ${variable})`).toString();
    steps.push({ step: 'Calculated du', result: `du = ${du}`, explanation: '' });

    // Apply integration by parts formula
    let result = nerdamer(`${u}*${v} - integrate(${v}*${du}, ${variable})`).toString();
    steps.push({ step: 'Applied integration by parts formula', result: `∫ ${func} d${variable} = ${result}`, explanation: '' });

    // Simplify the result
    result = simplifyExpression(result);
    steps.push({ step: 'Simplified result', result: `∫ ${func} d${variable} = ${result} + C`, explanation: 'Simplified the integrated expression' });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: `${result} + C`,
      steps,
      color: '#000000',
      indefiniteIntegral: result
    };
  } catch (error) {
    console.error('Integration by parts error:', error);
    return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };
  }
}

function integrateByUSubstitution(func: string, variable: string): ImportedIntegrationResult {
  const steps: ImportedIntegrationStep[] = [];
  steps.push({ step: 'Attempting u-substitution', result: func, explanation: '' });

  // Identify potential u-substitution
  const match = func.match(/(\w+)\(([^)]+)\)/);
  if (!match) return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };

  const [, outerFunc, innerFunc] = match;
  steps.push({ step: 'Identified potential u-substitution', result: `u = ${innerFunc}`, explanation: '' });

  try {
    // Calculate du
    const du = nerdamer(`diff(${innerFunc}, ${variable})`).toString();
    steps.push({ step: 'Calculated du', result: `du = ${du} d${variable}`, explanation: '' });

    // Perform substitution
    const substitutedFunc = func.replace(`${outerFunc}(${innerFunc})`, 'u');
    steps.push({ step: 'Substituted function', result: substitutedFunc, explanation: '' });

    // Integrate with respect to u
    const result = nerdamer(`integrate(${substitutedFunc}, u)`).toString();
    steps.push({ step: 'Integrated with respect to u', result: `∫ ${substitutedFunc} du = ${result}`, explanation: '' });

    // Substitute back
    const finalResult = result.replace(/u/g, `(${innerFunc})`);
    steps.push({ step: 'Substituted back', result: `∫ ${func} d${variable} = ${finalResult} + C`, explanation: '' });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: `${finalResult} + C`,
      steps,
      color: '#000000',
      indefiniteIntegral: finalResult
    };
  } catch (error) {
    console.error('U-substitution error:', error);
    return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };
  }
}

function integrateByTrigonometricSubstitution(func: string, variable: string): ImportedIntegrationResult {
  return integrateByTrigSubstitution(func, variable);
}

function integrateByRationalFunctions(func: string, variable: string): ImportedIntegrationResult {
  // Implementation for integrating rational functions
  // This may involve a combination of partial fractions and other techniques
  // ... implementation details ...
  return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };
}

function isRationalFunction(func: string): boolean {
  // Check if the function is a ratio of polynomials
  // ... implementation ...
  return false;
}

function hasTrigonometricPattern(func: string): boolean {
  // Check for patterns that suggest trigonometric substitution would be useful
  // ... implementation ...
  return false;
}

function numericalIntegration(func: string, variable: string, lowerBound: string, upperBound: string): ImportedIntegrationResult {
  const steps: ImportedIntegrationStep[] = [
    { step: 'Numerical integration', result: 'Using trapezoidal rule', explanation: '' }
  ];

  try {
    // Replace π with pi and ∞ with Infinity for evaluation
    const normalizedLowerBound = lowerBound.replace(/π/g, 'pi').replace(/∞/g, 'Infinity');
    const normalizedUpperBound = upperBound.replace(/π/g, 'pi').replace(/∞/g, 'Infinity');

    const lowerBoundValue = math.evaluate(normalizedLowerBound);
    const upperBoundValue = math.evaluate(normalizedUpperBound);

    // Validate input
    if (!isFinite(lowerBoundValue) || !isFinite(upperBoundValue)) {
      throw new Error('Cannot perform numerical integration with infinite bounds');
    }

    // Implement trapezoidal rule for numerical integration
    const n = 1000; // Number of intervals
    const h = (upperBoundValue - lowerBoundValue) / n;
    let sum = 0;

    const evaluate = (x: number) => {
      try {
        return math.evaluate(func, { [variable]: x });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Error evaluating function at x = ${x}: ${errorMessage}`);
      }
    };

    for (let i = 1; i < n; i++) {
      const x = lowerBoundValue + i * h;
      sum += evaluate(x);
    }

    const result = h * (
      (evaluate(lowerBoundValue) + evaluate(upperBoundValue)) / 2 + sum
    );
    
    steps.push({ step: 'Result', result: `Approximate value: ${result}`, explanation: '' });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: math.format(result, { precision: 14 }),
      steps,
      color: '#000000'
    };
  } catch (error) {
    console.error('Numerical integration error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    steps.push({ step: 'Error', result: 'Numerical integration failed', explanation: errorMessage });
    return {
      id: Date.now().toString(),
      func,
      variable,
      result: 'Unable to evaluate',
      steps,
      color: '#000000'
    };
  }
}

function integrateProductOfTrigFunctions(func: string, variable: string): ImportedIntegrationResult {
  const steps: ImportedIntegrationStep[] = [];
  steps.push({ step: 'Integrating product of trigonometric functions', result: func, explanation: '' });

  try {
    // Expand the trigonometric expression
    const expandedFunc = expandExpression(func);
    steps.push({ step: 'Expanded trigonometric expression', result: expandedFunc, explanation: 'Applied trigonometric identities to expand the expression' });

    // Integrate the expanded expression
    const result = nerdamer(`integrate(${expandedFunc}, ${variable})`).toString();
    steps.push({ step: 'Integrated expanded expression', result: `∫ ${expandedFunc} d${variable} = ${result}`, explanation: '' });

    // Simplify the result
    const simplifiedResult = simplifyExpression(result);
    steps.push({ step: 'Simplified result', result: `∫ ${func} d${variable} = ${simplifiedResult} + C`, explanation: 'Simplified the integrated expression' });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: `${simplifiedResult} + C`,
      steps,
      color: '#000000',
      indefiniteIntegral: simplifiedResult
    };
  } catch (error) {
    console.error('Integration of trigonometric product error:', error);
    return { id: Date.now().toString(), func, variable, result: "result", steps: [], color: '#000000' };
  }
}

function evaluateDefiniteIntegral(func: string, variable: string, lowerBound: string, upperBound: string, method: string): ImportedIntegrationResult {
  const indefiniteResult = integrate(func, variable, method);
  
  try {
    console.log(`Calculating definite integral of ${func} from ${lowerBound} to ${upperBound}`);
    
    // Replace π with pi and ∞ with Infinity for evaluation
    const normalizedLowerBound = lowerBound.replace(/π/g, 'pi').replace(/∞/g, 'Infinity');
    const normalizedUpperBound = upperBound.replace(/π/g, 'pi').replace(/∞/g, 'Infinity');
    
    const lowerBoundValue = math.evaluate(normalizedLowerBound);
    const upperBoundValue = math.evaluate(normalizedUpperBound);
    
    console.log(`Converted bounds: ${lowerBoundValue} to ${upperBoundValue}`);

    if (!isFinite(lowerBoundValue) || !isFinite(upperBoundValue)) {
      // Special case for simple exponential functions
      if (func.match(/^e\^\([-]?[a-z]\)$/i)) {
        const coefficient = func.includes('-') ? -1 : 1;
        const definiteIntegral = nerdamer(`1 / ${coefficient}`).evaluate().toString();
        indefiniteResult.steps.push({
          step: 'Definite integration of exponential function',
          result: `∫[${lowerBound}, ${upperBound}] ${func} d${variable} = ${definiteIntegral}`,
          explanation: `For e^(${coefficient}x), the definite integral from 0 to ∞ is 1/${coefficient}`
        });
        return {
          ...indefiniteResult,
          result: definiteIntegral
        };
      }
      return handleImproperIntegral(func, variable, lowerBoundValue, upperBoundValue, indefiniteResult);
    }

    const indefiniteIntegral = nerdamer(indefiniteResult.result.replace(' + C', ''));
    const upperValue = indefiniteIntegral.evaluate({ [variable]: upperBoundValue });
    const lowerValue = indefiniteIntegral.evaluate({ [variable]: lowerBoundValue });
    
    const definiteIntegral = math.subtract(upperValue.valueOf(), lowerValue.valueOf());

    console.log('Evaluated definite result:', definiteIntegral);

    indefiniteResult.steps.push({
      step: 'Definite integration',
      result: `∫[${lowerBound}, ${upperBound}] ${func} d${variable} = ${math.format(definiteIntegral, { precision: 14 })}`,
      explanation: `Evaluated the indefinite integral at the upper bound (${upperBound}) and lower bound (${lowerBound}), then subtracted the results.`
    });

    return {
      ...indefiniteResult,
      result: math.format(definiteIntegral, { precision: 14 })
    };
  } catch (error) {
    console.error('Definite integration error:', error);
    // Fall back to numerical integration if symbolic integration fails
    return numericalIntegration(func, variable, lowerBound, upperBound);
  }
}

function handleImproperIntegral(func: string, variable: string, lowerBound: number, upperBound: number, indefiniteResult: ImportedIntegrationResult): ImportedIntegrationResult {
  const steps: ImportedIntegrationStep[] = [...indefiniteResult.steps];
  steps.push({ step: 'Improper integral detected', result: '', explanation: 'One or both bounds are infinite' });

  try {
    const indefiniteIntegral = nerdamer(indefiniteResult.result.replace(' + C', ''));
    let result: string;

    if (isFinite(lowerBound) && !isFinite(upperBound)) {
      // Integral from a finite value to infinity
      const limitAtInfinity = nerdamer(`limit(${indefiniteIntegral}, ${variable}, inf)`);
      const lowerValue = indefiniteIntegral.evaluate({ [variable]: lowerBound });
      result = nerdamer(`(${limitAtInfinity}) - (${lowerValue})`).evaluate().toString();
      steps.push({
        step: 'Evaluate limit at infinity',
        result: `lim(x→∞) ${indefiniteResult.result} - ${indefiniteResult.result.replace(variable, lowerBound.toString())} = ${result}`,
        explanation: 'Subtracted the value at the lower bound from the limit at infinity'
      });
    } else if (!isFinite(lowerBound) && isFinite(upperBound)) {
      // Integral from negative infinity to a finite value
      const limitAtNegInfinity = nerdamer(`limit(${indefiniteIntegral}, ${variable}, -inf)`);
      const upperValue = indefiniteIntegral.evaluate({ [variable]: upperBound });
      result = nerdamer(`(${upperValue}) - (${limitAtNegInfinity})`).evaluate().toString();
      steps.push({
        step: 'Evaluate limit at negative infinity',
        result: `${indefiniteResult.result.replace(variable, upperBound.toString())} - lim(x→-∞) ${indefiniteResult.result} = ${result}`,
        explanation: 'Subtracted the limit at negative infinity from the value at the upper bound'
      });
    } else {
      // Integral from negative infinity to positive infinity
      const limitAtPosInfinity = nerdamer(`limit(${indefiniteIntegral}, ${variable}, inf)`);
      const limitAtNegInfinity = nerdamer(`limit(${indefiniteIntegral}, ${variable}, -inf)`);
      result = nerdamer(`(${limitAtPosInfinity}) - (${limitAtNegInfinity})`).evaluate().toString();
      steps.push({
        step: 'Evaluate limits at both infinities',
        result: `lim(x→∞) ${indefiniteResult.result} - lim(x→-∞) ${indefiniteResult.result} = ${result}`,
        explanation: 'Subtracted the limit at negative infinity from the limit at positive infinity'
      });
    }

    // Check if the result is infinite, undefined, or complex
    if (result.includes('Infinity') || result.includes('NaN') || result.includes('i')) {
      return {
        id: Date.now().toString(),
        func,
        variable,
        result: 'Divergent',
        steps: [
          ...steps,
          {
            step: 'Final result',
            result: 'The integral diverges',
            explanation: 'The improper integral does not converge to a finite real value'
          }
        ],
        color: '#000000'
      };
    }

    // Try to simplify the result
    const simplifiedResult = nerdamer(result).evaluate().toString();

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: simplifiedResult,
      steps: [
        ...steps,
        {
          step: 'Final result',
          result: simplifiedResult,
          explanation: 'Simplified the result of the improper integral'
        }
      ],
      color: '#000000'
    };
  } catch (error) {
    console.error('Improper integral evaluation error:', error);
    steps.push({
      step: 'Error',
      result: 'Unable to evaluate improper integral',
      explanation: error instanceof Error ? error.message : 'Unknown error'
    });
    return {
      id: Date.now().toString(),
      func,
      variable,
      result: 'Unable to evaluate',
      steps,
      color: '#000000'
    };
  }
}

self.onmessage = async (e: MessageEvent) => {
  const { func, variable, lowerBound, upperBound, method } = e.data;
  console.log('Worker received:', func, variable, lowerBound, upperBound, method);

  try {
    let result: ImportedIntegrationResult;
    
    if (lowerBound === null && upperBound === null) {
      // Indefinite integral
      result = await calculateIndefiniteIntegral(func, variable, method);
    } else {
      // Definite integral
      result = await calculateDefiniteIntegral(func, variable, lowerBound, upperBound, method);
    }

    self.postMessage({ result });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

async function calculateIndefiniteIntegral(func: string, variable: string, method: string): Promise<ImportedIntegrationResult> {
  console.log(`Calculating indefinite integral of ${func} with respect to ${variable}`);
  
  const steps: ImportedIntegrationStep[] = [];
  steps.push({
    step: 'Integrate the function',
    result: '',
    explanation: `We need to find the indefinite integral of ${func} with respect to ${variable}.`
  });

  try {
    const normalizedFunc = normalizeFunction(func, variable);
    steps.push({
      step: 'Normalize function',
      result: normalizedFunc,
      explanation: 'Convert the function to a standardized form for integration.'
    });

    const result = memoizedIntegrate(normalizedFunc, variable);
    console.log('Indefinite integral result:', result);
    
    const finalResult = `${result} + C`;
    steps.push({
      step: 'Compute indefinite integral',
      result: finalResult,
      explanation: 'Apply integration rules to find the indefinite integral.'
    });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result: finalResult,
      steps,
      color: '#000000',
      indefiniteIntegral: result
    };
  } catch (error) {
    console.error('Integration error:', error);
    let errorMessage = 'Unknown error occurred';
    let errorType = 'UnknownError';

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('division by zero')) {
        errorType = 'DivisionByZeroError';
      } else if (error.message.includes('undefined function')) {
        errorType = 'UndefinedFunctionError';
      }
    }

    steps.push({
      step: 'Error',
      result: 'Unable to compute integral',
      explanation: errorMessage
    });

    throw new IntegrationError('Integration failed', errorMessage, errorType);
  }
}

async function calculateDefiniteIntegral(func: string, variable: string, lowerBound: string, upperBound: string, method: string): Promise<ImportedIntegrationResult> {
  console.log(`Calculating definite integral of ${func} from ${lowerBound} to ${upperBound}`);
  
  const steps: ImportedIntegrationStep[] = [];
  steps.push({
    step: 'Integrate the function',
    result: '',
    explanation: `We need to find the definite integral of ${func} from ${lowerBound} to ${upperBound} with respect to ${variable}.`
  });

  try {
    const normalizedFunc = normalizeFunction(func, variable);
    steps.push({
      step: 'Normalize function',
      result: normalizedFunc,
      explanation: 'Convert the function to a standardized form for integration.'
    });

    const indefiniteIntegral = nerdamer(`integrate(${normalizedFunc}, ${variable})`).toString();
    steps.push({
      step: 'Compute indefinite integral',
      result: indefiniteIntegral,
      explanation: 'Find the indefinite integral of the function.'
    });

    const upperEval = nerdamer(indefiniteIntegral).evaluate({ [variable]: upperBound }).toString();
    const lowerEval = nerdamer(indefiniteIntegral).evaluate({ [variable]: lowerBound }).toString();
    steps.push({
      step: 'Evaluate bounds',
      result: `Upper bound: ${upperEval}, Lower bound: ${lowerEval}`,
      explanation: 'Evaluate the indefinite integral at the upper and lower bounds.'
    });

    const result = nerdamer(`${upperEval} - (${lowerEval})`).toString();
    steps.push({
      step: 'Compute definite integral',
      result: result,
      explanation: 'Subtract the lower bound evaluation from the upper bound evaluation to get the definite integral.'
    });

    return {
      id: Date.now().toString(),
      func,
      variable,
      result,
      steps,
      color: '#000000'
    };
  } catch (error) {
    console.error('Integration error:', error);
    steps.push({
      step: 'Error',
      result: 'Unable to compute integral',
      explanation: error instanceof Error ? error.message : 'Unknown error'
    });
    return {
      id: Date.now().toString(),
      func,
      variable,
      result: 'Unable to compute',
      steps,
      color: '#000000'
    };
  }
}
