import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PermissionsDec } from './permissions.decorator';
import { Permissions } from '@app/contracts/common/permissions';
import CustomRpcException from '@app/contracts/error/CustomRpcException';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Extract the user
    const user = context.switchToRpc().getContext().user;

    const requiredPermissions = this.reflector.get(
      PermissionsDec,
      context.getHandler(),
    );

    if (user.isAdmin || !requiredPermissions) return true;

    if (!hasAllPermissions(user.permissions, requiredPermissions))
      throwTheError(requiredPermissions);

    return true;
  }
}

function throwTheError(requiredPermissiosn: Permissions[]) {
  throw new CustomRpcException({
    code: ERROR_TYPE.FORBIDDEN,
    status: HttpStatus.FORBIDDEN,
    message: `you don't have an access to this resource, required permission: ${requiredPermissiosn}.`,
  });
}

function hasAllPermissions(
  userPermissions: Permissions[] = [],
  requiredPermissions: Permissions[] = [],
): boolean {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}
