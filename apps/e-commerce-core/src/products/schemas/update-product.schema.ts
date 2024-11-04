import { z } from 'zod';
import { categories } from './product.schema';

export const updateProductSchema = z
  .object({
    name: z.string().min(5).max(255),
    price: z.number().min(10),
    tags: z.array(z.string().min(1)).min(1),
    category: z
      .enum(categories as any)
      .optional()
      .nullish(),
    quantity: z.number().min(0),
    vendor: z
      .object({ name: z.string(), bio: z.string().optional() })
      .optional(),
  })
  .strict();

export type IUpdateProduct = z.infer<typeof updateProductSchema>;
