import { z } from 'zod';
import { categories } from './product.schema';

export const createProductSchema = z
  .object({
    name: z.string().min(5).max(255),
    price: z.number().min(10),
    quantity: z.number().min(0),
    tags: z.array(z.string().min(1)).min(1),
    category: z
      .enum(categories as any)
      .optional()
      .nullish(),
    vendor: z
      .object({ name: z.string(), bio: z.string().optional() })
      .optional(),
  })
  .strict();

export type ICreateProduct = z.infer<typeof createProductSchema>;
