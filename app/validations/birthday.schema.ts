import * as zod from 'zod';

export const birthdaySchema = zod.string().refine((value: string) => {
  const regex = /\d{2}\/\d{2}\/\d{4}/;
  if (regex.test(value)) {
    return !isNaN(Date.parse(value));
  }
  return false;
}, 'Birthday is invalid');
