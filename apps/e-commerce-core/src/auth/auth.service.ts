import { Inject, Injectable } from '@nestjs/common';
import { UserAuthDto } from '@app/contracts/users-client/auth/user.auth.dto';
import { AUTH_CLIENT } from './constant';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/users-client/auth/auth.pattern';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_CLIENT) private authClient: ClientProxy) {}

  create(userAuthDto: UserAuthDto) {
    return this.authClient.send(AUTH_PATTERNS.USER_AUTH, {
      payload: userAuthDto,
      metadata: {},
    });
  }
}
