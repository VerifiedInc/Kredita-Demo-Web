import { useMemo, useReducer } from 'react';
import { z } from 'zod';

type FieldHookOptions = {
  name: string;
  schema: z.ZodSchema;
  label?: string;
  initialValue?: string;
};

type ReducerState = { value: string; touched: boolean };

const fieldReducer = (
  state: ReducerState,
  action: Partial<ReducerState>
): ReducerState => ({ ...state, ...action });

export const useField = ({
  name,
  schema,
  label,
  initialValue,
}: FieldHookOptions) => {
  const [state, dispatch] = useReducer(fieldReducer, {
    value: initialValue || '',
    touched: false,
  });

  const validation = schema.safeParse(state.value);

  const error = useMemo(() => {
    if (!state.touched) return null;

    return !validation.success
      ? validation?.error?.format()?._errors?.[0]
      : null;
  }, [state, validation]);

  const valid = schema.safeParse(state.value).success;

  const change = (value: string | any) => {
    const _value = typeof value === 'string' ? value : value.target.value;
    dispatch({ value: _value, touched: true });
  };

  const reset = () => {
    dispatch({ value: '', touched: false });
  };

  const isValid = (value: string) => {
    const validation = schema.safeParse(value);
    return validation.success;
  };

  return {
    ...state,
    name,
    error,
    valid,
    label,
    isValid,
    change,
    reset,
  };
};
