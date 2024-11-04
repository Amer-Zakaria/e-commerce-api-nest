import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/contracts/users-client/users/create-user.dto';
import { USERS_PATTERNS } from '@app/contracts/users-client/users/users.pattern';
import { USERS_CLIENT } from './constant';
import { Permissions } from '@app/contracts/common/permissions';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_CLIENT) private usersClient: ClientProxy) {}

  findAll(token?: string) {
    const metadata = { headers: { 'x-auth-token': token } };

    return this.usersClient.send(USERS_PATTERNS.FIND_ALL, {
      payload: { whatsoever: 'yo' },
      metadata,
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.usersClient.send(USERS_PATTERNS.CREATE, {
      payload: createUserDto,
      metadata: {},
    });
  }

  updateUserPermissions({
    permissions,
    userId,
    token,
  }: {
    permissions: Permissions[];
    userId: string;
    token: string;
  }) {
    const metadata = {
      params: {
        userId,
      },
      headers: {
        'x-auth-token': token,
      },
    };

    return this.usersClient.send(USERS_PATTERNS.UPDATE_USER_PERMISSIONS, {
      metadata,
      payload: permissions,
    });
  }
}
