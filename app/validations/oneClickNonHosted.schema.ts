import * as zod from 'zod';

import { phoneSchema } from './phone.schema';
import { birthdaySchema } from './birthday.schema';

export const oneClickNonHostedSchema = zod.object({
  phone: phoneSchema,
  birthday: birthdaySchema,
});
