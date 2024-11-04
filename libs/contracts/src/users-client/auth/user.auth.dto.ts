import { z } from 'zod';
import { passwordValidation } from '../users/create-user.dto';

export const userCredSchema = z
  .object({
    email: z.string().min(5).max(255).email(),
    password: passwordValidation,
  })
  .strict();
export type UserAuthDto = z.infer<typeof userCredSchema>;
