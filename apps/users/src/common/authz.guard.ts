import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import CustomRpcException from '@app/contracts/error/CustomRpcException';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // Extract the token
    const message = context.getArgByIndex(0);
    const metadata = message?.metadata;
    const token = metadata?.headers?.['x-auth-token'];

    // Check token existance
    if (!token)
      throw new CustomRpcException({
        status: HttpStatus.UNAUTHORIZED,
        code: ERROR_TYPE.NO_TOKEN,
        message: 'Access denied. No token provided.',
      });

    try {
      // Validate the token
      const decoded = jwt.verify(
        token,
        this.configService.get<string>('jwtPrivateKey', ''),
      );

      // Inject the user in the context
      context.switchToRpc().getContext().user = decoded;

      return true;
    } catch (err) {
      throw new CustomRpcException({
        status: HttpStatus.UNAUTHORIZED,
        code: ERROR_TYPE.INVALID_TOKEN,
        message: 'Invalid token',
      });
    }
  }
}
