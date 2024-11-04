import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppDevConfig from './config/config.dev';
import AppProdConfig from './config/config.prod';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import GlobalDevConfig from '@app/contracts/config/config.dev';
import GlobalProdConfig from '@app/contracts/config/config.prod';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrdersResolver } from './orders/orders.resolver';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { CheckExistenceService } from './common/check-existence.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      formatError: (err) =>
        ({
          code: err.message,
          validation: err.extensions?.validation,
          message: err.extensions?.message,
        }) as any,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProductsModule,
    HealthModule,
    ConfigModule.forRoot({
      load:
        process.env.NODE_ENV === 'production'
          ? [GlobalProdConfig, AppProdConfig]
          : [GlobalDevConfig, AppDevConfig],
      isGlobal: true,
    }),
    AuthModule,
    OrdersModule,
  ],
  providers: [OrdersResolver, OrdersService, CheckExistenceService],
})
export class ECommerceCoreModule {}
