import { z } from 'zod';
import { orderStatusList } from './order.schema';
import { isValidObjectId } from 'mongoose';

export const createOrderSchema = z
  .object({
    status: z.enum(orderStatusList).optional(),
    products: z
      .array(
        z.object({
          id: z.string().refine((val) => isValidObjectId(val), {
            message: 'Invalid MongoDB ObjectId',
          }),
          orderedQuantity: z.number().min(1),
        }),
      )
      .min(1),
  })
  .strict();

export type ICreateOrder = z.infer<typeof createOrderSchema>;
