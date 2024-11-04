import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export default z
  .string()
  .refine((objectId) => isValidObjectId(objectId), { message: 'Invalid Id' });
