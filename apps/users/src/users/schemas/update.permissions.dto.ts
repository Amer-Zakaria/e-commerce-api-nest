import { z } from 'zod';
import { Permissions } from '@app/contracts/common/permissions';

export const updatePermissionsSchema = z
  .object({
    userId: z.string(),
    permissions: z.array(z.nativeEnum(Permissions)).min(1),
  })
  .strict();

export type updatePermissionsDto = z.infer<typeof updatePermissionsSchema>;
