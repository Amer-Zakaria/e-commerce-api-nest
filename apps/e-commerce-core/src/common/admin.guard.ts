import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;

    if (!user.isAdmin)
      throw new ForbiddenException(ERROR_TYPE.FORBIDDEN, {
        cause: 'You have to be an admin',
      });

    return true;
  }
}
