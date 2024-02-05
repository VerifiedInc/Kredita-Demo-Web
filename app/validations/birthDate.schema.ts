import * as zod from 'zod';

export const birthDateSchema = zod.string().refine((value: string) => {
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (regex.test(value)) {
    return !isNaN(Date.parse(value));
  }
  return false;
}, 'Birthday is invalid');
