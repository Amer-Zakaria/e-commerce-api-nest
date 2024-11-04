import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionsDec } from './permissions.decorator';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@app/contracts/common/permissions';
import IUser from '@app/contracts/users-client/users/IUser';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    let req: any;
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext().req;
    }
    const user = req.user as IUser;
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
  throw new ForbiddenException(ERROR_TYPE.FORBIDDEN, {
    cause: `you don't have an access to this resource, required permission: ${requiredPermissiosn}.`,
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
