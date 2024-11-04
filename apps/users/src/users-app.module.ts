import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppDevConfig from './config/config.dev';
import AppProdConfig from './config/config.prod';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import GlobalDevConfig from '@app/contracts/config/config.dev';
import GlobalProdConfig from '@app/contracts/config/config.prod';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load:
        process.env.NODE_ENV === 'production'
          ? [GlobalProdConfig, AppProdConfig]
          : [GlobalDevConfig, AppDevConfig],
      isGlobal: true,
    }),
    UsersModule,
    HealthModule,
    AuthModule,
  ],
})
export class UsersAppModule {}
