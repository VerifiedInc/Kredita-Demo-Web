import { z } from 'zod';

export const countrySchema = z.string().min(2).max(2);
