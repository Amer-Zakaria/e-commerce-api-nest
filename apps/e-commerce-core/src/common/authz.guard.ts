import { ERROR_TYPE } from '@app/contracts/error/error-types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // Extract the token
    let req: Request;
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext().req;
    }
    const token = req.header('x-auth-token');

    // Check token existance
    if (!token)
      throw new UnauthorizedException(ERROR_TYPE.NO_TOKEN, {
        cause: 'Access denied. No token provided.',
      });

    try {
      // Validate the token
      const decoded = jwt.verify(
        token,
        this.configService.get<string>('jwtPrivateKey', ''),
      );

      // Inject the user in the request
      (req as any).user = decoded;

      return true;
    } catch (err) {
      throw new UnauthorizedException(ERROR_TYPE.INVALID_TOKEN, {
        cause: 'Invalid token',
      });
    }
  }
}
