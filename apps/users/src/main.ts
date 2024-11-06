import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import checkEnvs from './utils/check-envs';

async function bootstrap() {
  const app = await NestFactory.create(UsersAppModule);

  const configService = app.get(ConfigService);

  checkEnvs(configService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('clientOptions.host', 'localhost'),
      port: +configService.get<number>('clientOptions.port', 3001),
    },
  });

  await app.startAllMicroservices();

  console.log(configService.get<string>('name'));
}

bootstrap();
