import { useState } from 'react';
import { validateFunction, validateVariable, validateBound, validateIntegrationMethod } from '../utils/validation';

interface FormValues {
  func: string;
  variable: string;
  isDefinite: boolean;
  lowerBound: string;
  upperBound: string;
  method: string;
}

export const useIntegrationForm = (initialState: FormValues) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));

    try {
      switch (name) {
        case 'func':
          validateFunction(value);
          break;
        case 'variable':
          validateVariable(value);
          break;
        case 'lowerBound':
        case 'upperBound':
          validateBound(value);
          break;
        case 'method':
          validateIntegrationMethod(value);
          break;
      }
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error instanceof Error ? error.message : 'Invalid input' }));
    }
  };

  return { values, errors, handleChange };
};
