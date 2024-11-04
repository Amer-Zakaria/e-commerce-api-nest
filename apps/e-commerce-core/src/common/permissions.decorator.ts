import { Permissions } from '@app/contracts/common/permissions';
import { Reflector } from '@nestjs/core';

export const PermissionsDec = Reflector.createDecorator<Permissions[]>();
