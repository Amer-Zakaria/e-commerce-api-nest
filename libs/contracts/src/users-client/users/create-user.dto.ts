import { z } from 'zod';

export const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least 1 lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
  .refine((val) => !/\s/.test(val), {
    message: 'Password must not contain white spaces',
  });

export const createUserSchema = z
  .object({
    name: z.string().min(5).max(50),
    email: z.string().email().min(5).max(255),
    password: passwordValidation,
  })
  .strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;
