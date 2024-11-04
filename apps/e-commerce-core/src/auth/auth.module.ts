import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AUTH_CLIENT } from './constant';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
  imports: [ClientConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_CLIENT,
      useFactory: (ConfigService: ClientConfigService) => {
        const clientOptions = ConfigService.UsersClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
})
export class AuthModule {}
