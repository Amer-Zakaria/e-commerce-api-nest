import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CustomRpcException from '@app/contracts/error/CustomRpcException';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToRpc().getContext().user;

    if (!user.isAdmin)
      throw new CustomRpcException({
        code: ERROR_TYPE.FORBIDDEN,
        message: 'You have to be an admin',
        status: HttpStatus.FORBIDDEN,
      });

    return true;
  }
}
