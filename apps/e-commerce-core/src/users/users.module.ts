import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientConfigModule } from '../client-config/client-config.module';
import { ClientConfigService } from '../client-config/client-config.service';
import { USERS_CLIENT } from './constant';

@Module({
  imports: [ClientConfigModule],
  providers: [
    UsersService,
    {
      provide: USERS_CLIENT,
      useFactory: (ConfigService: ClientConfigService) => {
        const clientOptions = ConfigService.UsersClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
