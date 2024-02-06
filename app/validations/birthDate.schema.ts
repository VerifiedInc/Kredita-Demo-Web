import * as zod from 'zod';

export const birthDateSchema = zod.string().refine((value: string) => {
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (regex.test(value)) {
    const now = new Date();
    const minDate = new Date('1900-01-01');
    const maxDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    const valueDate = new Date(value);

    if (valueDate >= minDate && valueDate <= maxDate) {
      const date = Date.parse(String(new Date(value)));
      return !isNaN(date);
    }
  }
  return false;
}, 'Birthday is invalid');
