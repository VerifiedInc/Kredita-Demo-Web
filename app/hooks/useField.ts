import { useState } from 'react';
import { z } from 'zod';

export const useField = (schema: z.ZodSchema) => {
  const [value, setValue] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const validation = schema.safeParse(value);
  const error = !validation.success
    ? validation?.error?.format()?._errors?.[0]
    : null;

  const change = (value: string) => {
    setValue(value);
    setTouched(true);
  };

  const reset = () => {
    setValue('');
    setTouched(false);
  };

  const isValid = (value: string) => {
    const validation = schema.safeParse(value);
    return validation.success;
  };

  return {
    value,
    touched,
    error,
    isValid,
    change,
    reset,
  };
};
