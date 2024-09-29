import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: (value: string) => string | null;
}

export const useFormValidation = (initialState: { [key: string]: string }, validationRules: ValidationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues(prevValues => ({ ...prevValues, [name]: value }));
    if (validationRules[name]) {
      const error = validationRules[name](value);
      setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    }
  }, [validationRules]);

  const validateAll = useCallback(() => {
    const newErrors: { [key: string]: string | null } = {};
    let isValid = true;
    Object.keys(validationRules).forEach(key => {
      const error = validationRules[key](values[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  return { values, errors, handleChange, validateAll };
};
